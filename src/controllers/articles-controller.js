import createError from 'http-errors'
import { ArticlesService } from '../services/articles-service.js'
import { WebhooksService } from '../services/webhooks-service.js'
import { LinkBuilder } from '../util/link-builder.js'

export class ArticlesController {
  /**
   * The articles service.
   */
  #articlesService
  /**
   * The webhooks service.
   */
  #webhooksService
  /**
   * The link builder.
   */
  #linkBuilder
  /**
   * The articles endpoint.
   */
  #endpoint

  /**
   * Initializes a new instance.
   *
   * @param {ArticlesService} articlesService Instanse from a class with the same capabilities as a ArticlesService.
   * @param {WebhooksService} webhooksService Instanse from a class with the same capabilities as a WebhooksService.
   * @param {LinkBuilder} linkBuilder Instansemfrom a class with the same capabilites as LinkBuilder.
   * @param {string} endpoint The endpoint to the articles.
   */
  constructor(articlesService, webhooksService, linkBuilder = new LinkBuilder(process.env.BASE_URL), endpoint) {
    this.#articlesService = articlesService
    this.#webhooksService = webhooksService
    this.#linkBuilder = linkBuilder
    this.#endpoint = endpoint
  }

  /**
   * Add article matching id to the request object.
   *
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   * @param {Function} next Express next middleware function.
   * @param {string} id The id for the article to load.
   */
  async loadPost(req, res, next, id) {
    try {
      const post = await this.#articlesService.getById(id)

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

  /**
   * Sends a JSON response containing one article and links to related resources.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async find(req, res, next) {
    this.#linkBuilder.addSelfLinkGetMethod(`${this.#endpoint}${req.url}`)
    this.#linkBuilder.addUpdateArticleLink(`${this.#endpoint}${req.url}`)
    this.#linkBuilder.addDeleteArticleLink(`${this.#endpoint}${req.url}`)

    const response = {
      post: req.post,
      _links: this.#linkBuilder.build()
    }

    res.json(response)
  }

  /**
   * Sends a JSON response containing articles for page with a specific number of articles per page 
   * and links to related resources.
   *
   * Default page is 1.
   * Default articles per page is 20.
   * Maximum articles per page is 100.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async findAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1
      const perPage = parseInt(req.query.per_page) || 20

      const posts = await this.#articlesService.get(page, perPage)

      this.#linkBuilder.addSelfLinkGetMethod(`${this.#endpoint}`)
      this.#linkBuilder.addArticleLinks(`${this.#endpoint}`, posts)

      if (page > 1) {
        this.#linkBuilder.addPrevPageLink(`${this.#endpoint}/?page=${page - 1}&per_page=${perPage}}`)
      }

      if (page < await this.#articlesService.getTotalNumberOfPages(perPage)) {
        this.#linkBuilder.addNextPageLink(`${this.#endpoint}/?page=${page + 1}&per_page=${perPage}`)
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

  /**
   * Sends a JSON response containing the newly created article and links to related resources.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async create(req, res, next) {
    try {
      const post = await this.#articlesService.insert({
        authorID: req.user.id,
        title: req.body.title,
        text: req.body.text
      })

      this.#linkBuilder.addSelfLinkPostMethod()

      this.#linkBuilder.addSingleArticleLink(`${this.#endpoint}/${post.id}`)
      this.#linkBuilder.addUpdateArticleLink(`${this.#endpoint}/${post.id}`)
      this.#linkBuilder.addDeleteArticleLink(`${this.#endpoint}/${post.id}`)

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
        .json(response)
    } catch (error) {
      const err = createError(error.name === 'ValidationError' ? 400 : 500)
      err.cause = error

      next(err)
    }
  }

  /**
   * Updates an article and sends JSON with related links.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async update(req, res, next) {
    try {
    await this.#articlesService.update(req.params.id, req.body)

    this.#linkBuilder.addSelfLinkPutMethod(`${this.#endpoint}/${req.params.id}`)
    this.#linkBuilder.addSingleArticleLink(`${this.#endpoint}/${req.params.id}`)

    const response = {
      _links: this.#linkBuilder.build()
    }

    res
      .status(201)
      .json(response)
    } catch (error) {
      const err = createError(error.name === 'ValidationError' ? 400 : 500)
      err.cause = error

      next(err)
    }
  }

  /**
   * Deletes an article.
   *
   * @param {object} req Express request object. 
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async delete(req, res, next) {
    try {
      await this.#articlesService.delete(req.params.id)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async authenticate (req, res, next) {
    try {
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')

      req.user = await this.#articlesService.authenticateJWT(authenticationScheme, token)

      next()
    } catch (error) {
      const err = createError(401)
      err.message = 'Access token invalid or not provided.'
      err.cause = error
      next(err)
    }
  }
}
