import createError from 'http-errors'

export class PostsController {
  #service

  constructor(service) {
    this.#service = service
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
    res.json(req.post)
  }

  async findAll(req, res, next) {
    try {
      const posts = await this.#service.get(req.query.page, req.query.per_page)

      const postLinks = posts.map((post) => ({
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${post.id}`,
        rel: 'post',
        method: 'GET'
      }))

      const response = {
        posts,
        links: {
          self: {
            href: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
            rel: 'self',
            method: 'GET'
          },
          posts: postLinks
        }
      }

      if (req.query.page > 1) {
        response.links.prevPage = {
          href: `${req.protocol}://${req.get('host')}${req.baseUrl}/?page=${parseInt(req.query.page) - 1}&per_page=${req.query.per_page || 20}`,
          rel: 'previous',
          method: 'GET'
        }
      }

      if (parseInt(req.query.page) < parseInt(Math.ceil(await this.#service.countTotalPosts() / (req.query.per_page || 20)))) {
        response.links.nextPage = {
          href: `${req.protocol}://${req.get('host')}${req.baseUrl}/?page=${parseInt(req.query.page) + 1}&per_page=${req.query.per_page || 20}`,
          rel: 'next',
          method: 'GET'
        }
      }

      if (req.user) {
        response.links.createPost = {
          href: `${req.protocol}://${req.get('host')}${req.baseUrl}/`,
          rel: 'create',
          method: 'POST'
        }
      } else {
        response.links.register = {
          href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/register`,
          rel: 'register',
          method: 'POST'
        }

        response.links.login = {
          href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/login`,
          rel: 'login',
          method: 'POST'
        }
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

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${post._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json(post)
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400
        : 500
      )
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

  authenticate (req, res, next) {
    try {
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')

      req.user = this.#service.authenticateJWT(authenticationScheme, token)

      next()
    } catch (error) {
      const err = createError(401)
      err.message = 'Access token invalid or not provided.'
      err.cause = error
      next(err)
    }
  }
}
