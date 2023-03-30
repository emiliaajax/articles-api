/**
 * Module for ArticlesController.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { ArticlesService } from '../services/articles-service.js'
import { WebhooksService } from '../services/webhooks-service.js'
import { LinkBuilder } from '../util/link-builder.js'

/**
 * Encapsulates a controller.
 */
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
  #articlesEndpoint
  /**
   * The users endpoint
   */
  #usersEndpoint

  /**
   * Initializes a new instance.
   *
   * @param {ArticlesService} articlesService Instanse from a class with the same capabilities as a ArticlesService.
   * @param {WebhooksService} webhooksService Instanse from a class with the same capabilities as a WebhooksService.
   * @param {LinkBuilder} linkBuilder Instanse from a class with the same capabilites as LinkBuilder.
   * @param {string} articlesEndpoint The endpoint to the articles.
   * @param {string} usersEndpoint The endpoint to the users.
   */
  constructor(articlesService, webhooksService, linkBuilder = new LinkBuilder(process.env.BASE_URL), articlesEndpoint, usersEndpoint) {
    this.#articlesService = articlesService
    this.#webhooksService = webhooksService
    this.#linkBuilder = linkBuilder
    this.#articlesEndpoint = articlesEndpoint
    this.#usersEndpoint = usersEndpoint
  }

  /**
   * Authorizes the user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async authorize (req, res, next) {
    if (req.user.id !== req.article.authorID) {
      next(createError(403))
    }
    next()
  }

  /**
   * Add article matching id to the request object.
   *
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   * @param {Function} next Express next middleware function.
   * @param {string} id The id for the article to load.
   */
  async loadArticle(req, res, next, id) {
    try {
      const article = await this.#articlesService.getById(id)

      if (!article) {
        next(createError(404, 'Not found!'))
        return
      }

      req.article = article

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
    this.#linkBuilder.addSelfLink(`${this.#articlesEndpoint}${req.url}`, 'GET')
    this.#linkBuilder.addUpdateArticleLink(`${this.#articlesEndpoint}${req.url}`)
    this.#linkBuilder.addDeleteArticleLink(`${this.#articlesEndpoint}${req.url}`)
    this.#linkBuilder.addAuthorLink(`${this.#usersEndpoint}/${req.article.authorID}${this.#articlesEndpoint}`)

    const response = {
      article: req.article,
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
      const perPage = parseInt(req.query['per-page']) || 20

      const articles = await this.#articlesService.get(page, perPage)

      this.#linkBuilder.addSelfLink(`${this.#articlesEndpoint}`, 'GET')
      this.#linkBuilder.addArticleLinks(`${this.#articlesEndpoint}`, articles)

      if (page > 1) {
        this.#linkBuilder.addPrevPageLink(`${this.#articlesEndpoint}/?page=${page - 1}&per-page=${perPage}`)
      }

      if (page < await this.#articlesService.getTotalNumberOfPages(perPage)) {
        this.#linkBuilder.addNextPageLink(`${this.#articlesEndpoint}/?page=${page + 1}&per-page=${perPage}`)
      }

      const response = {
        articles,
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
   * Sends a webhook article created event.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async create(req, res, next) {
    try {
      const article = await this.#articlesService.insert({
        authorID: req.user.id,
        title: req.body.title,
        category: req.body.category,
        text: req.body.text
      })

      this.#linkBuilder.addSelfLink(`${this.#articlesEndpoint}`, 'POST')

      this.#linkBuilder.addGetArticleLink(`${this.#articlesEndpoint}/${article.id}`)
      this.#linkBuilder.addUpdateArticleLink(`${this.#articlesEndpoint}/${article.id}`)
      this.#linkBuilder.addDeleteArticleLink(`${this.#articlesEndpoint}/${article.id}`)

      const response = {
        article,
        _links: this.#linkBuilder.build()
      }

      await this.#webhooksService.send(response, 'article-created')

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${article.id}`
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

    this.#linkBuilder.addSelfLink(`${this.#articlesEndpoint}/${req.params.id}`, 'PUT')

    this.#linkBuilder.addGetArticleLink(`${this.#articlesEndpoint}/${req.params.id}`)
    this.#linkBuilder.addUpdateArticleLink(`${this.#articlesEndpoint}/${req.params.id}`)
    this.#linkBuilder.addDeleteArticleLink(`${this.#articlesEndpoint}/${req.params.id}`)

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

      req.user = this.#articlesService.authenticateJWT(authenticationScheme, token)

      next()
    } catch (error) {
      const err = createError(401)
      err.message = 'Access token invalid or not provided.'
      err.cause = error
      next(err)
    }
  }
}
