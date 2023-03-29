import createError from 'http-errors'

export class PostsController {
  #service
  #webhooksService
  #linkBuilder

  constructor(service, webhooksService, linkBuilder) {
    this.#service = service
    this.#webhooksService = webhooksService
    this.#linkBuilder = linkBuilder
  }

  async loadPost(req, res, next, id) {
    try {
      const post = await this.#service.getById(id)

      if (!post) {
        next(createError(404, 'Not found!'))
        return
      }

      req.post = post

      next()
    } catch (error) {
      next(error)
    }
  }

  async find(req, res, next) {
    this.#linkBuilder.addSingleArticleLink(`${req.protocol}://${req.get('host')}${req.baseUrl}/${req.post.id}`)

    response = {
      post: req.post,
      _links: this.#linkBuilder.build()
    }

    res.json(response)
  }

  async findAll(req, res, next) {
    try {
      const hostUrl = `${req.protocol}://${req.get('host')}`
      const page = parseInt(req.query.page) || 1
      const perPage = parseInt(req.query.per_page) || 20

      const posts = await this.#service.get(page, perPage)

      this.#linkBuilder.addSelfLink(`${hostUrl}${req.baseUrl}`)
      this.#linkBuilder.addArticleLinks(`${hostUrl}${req.baseUrl}`, posts)

      if (page > 1) {
        this.#linkBuilder.addPrevPageLink(`${hostUrl}${req.baseUrl}/?page=${page - 1}&per_page=${perPage}}`)
      }

      if (page < await this.#service.getTotalNumberOfPages(perPage)) {
        this.#linkBuilder.addNextPageLink(`${hostUrl}${req.baseUrl}/?page=${page + 1}&per_page=${perPage}`)
      }

      if (req.user) {
        this.#linkBuilder.addCreateArticleLink(`${hostUrl}${req.baseUrl}/`)
      } else {
        this.#linkBuilder.addRegisterUserLink(`${hostUrl}${req.baseUrl}/users/register`)
        this.#linkBuilder.addLoginUserLink(`${hostUrl}${req.baseUrl}/users/login`)
      }

      const response = {
        posts,
        _links: this.#linkBuilder.build()
      }

      res
        .json(response)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const post = await this.#service.insert({
        authorID: req.user.id,
        title: req.body.title,
        text: req.body.text
      })

      this.#linkBuilder.addSelfLink(`${req.protocol}://${req.get('host')}${req.baseUrl}`)
      this.#linkBuilder.addSingleArticleLink(`${req.protocol}://${req.get('host')}${req.baseUrl}/${post.id}`)

      const response = {
        post,
        _links: this.#linkBuilder.build()
      }

      await this.#webhooksService.send(response)

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${post.id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(post)
    } catch (error) {
      const err = createError(error.name === 'ValidationError' ? 400 : 500)
      err.cause = error

      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      await this.#service.delete(req.params.id)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  async authenticate (req, res, next) {
    try {
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')

      req.user = await this.#service.authenticateJWT(authenticationScheme, token)

      next()
    } catch (error) {
      const err = createError(401)
      err.message = 'Access token invalid or not provided.'
      err.cause = error
      next(err)
    }
  }
}
