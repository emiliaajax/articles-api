/**
 * Module for UsersController.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { UsersService } from '../services/users-service.js'
import { LinkBuilder } from '../util/link-builder.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {
  /**
   * The users service.
   */
  #usersService
  /**
   * The articles service.
   */
  #articlesService
  /**
   * The link builder.
   */
  #linkBuilder
  /**
   * The users endpoint.
   */
  #usersEndpoint
  /**
   * The articles endpoint.
   */
  #articlesEndpoint

  /**
   * Initializes a new instance.
   *
   * @param {UsersService} usersService Instanse from a class with the same capabilities as a UsersService.
   * @param {LinkBuilder} linkBuilder Instanse from a class with the same capabilites as LinkBuilder.
   * @param {string} endpoint The endpoint to the users.
   */
  constructor (usersService, articlesService, linkBuilder, usersEndpoint, articlesEndpoint) {
    this.#usersService = usersService
    this.#articlesService = articlesService
    this.#linkBuilder = linkBuilder
    this.#usersEndpoint = usersEndpoint
    this.#articlesEndpoint = articlesEndpoint
  }

  /**
   * Add user matching id to the request object.
   *
   * @param {object} req The Express request object.
   * @param {object} res The Express response object.
   * @param {Function} next Express next middleware function.
   * @param {string} id The id for the user to load.
   */
  async loadUser(req, res, next, id) {
    try {
      const user = await this.#usersService.getById(id)

      if (!user) {
        next(createError(404, 'Not found!'))
        return
      }

      req.user = user

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a user and links to related resources.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async find(req, res, next) {
    this.#linkBuilder.addSelfLink(`${this.#usersEndpoint}${req.url}`, 'GET')

    const response = {
      user: req.user,
      _links: this.#linkBuilder.build()
    }

    res.json(response)
  }

  /**
   * Finds resources for a specific user by its id.
   *
   * @param {object} req Express request object. 
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async findResources(req, res, next) {
    try {
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query['per-page']) || 20

    const articles = await this.#articlesService.get(page, perPage, { authorID: req.params.id })

    this.#linkBuilder.addSelfLink(`${this.#usersEndpoint}/${req.params.id}${this.#articlesEndpoint}`, 'GET')
    this.#linkBuilder.addArticleLinks(`${this.#articlesEndpoint}`, articles)

    if (page > 1) {
      this.#linkBuilder.addPrevPageLink(
        `${this.#usersEndpoint}${this.#articlesEndpoint}/${req.params.id}/?page=${page - 1}&per-page=${perPage}`
      )
    }

    if (page < await this.#articlesService.getTotalNumberOfPages(perPage)) {
      this.#linkBuilder.addNextPageLink(
        `${this.#usersEndpoint}${this.#articlesEndpoint}/${req.params.id}/?page=${page + 1}&per-page=${perPage}`
      )
    }

    const response = {
      articles,
      _links: this.#linkBuilder.build()
    }

    res.json(response)
    } catch (error) {
      next(err)
    }
  }

  /**
   * Sends a JSON with access token and related links on successful login.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async login(req, res, next) {
    try {
      const accessToken = await this.#usersService.authenticate(req.body.email, req.body.password)

      this.#linkBuilder.addSelfLink(`${this.#usersEndpoint}${req.route.path}`, 'POST')
      this.#linkBuilder.addAPIEntrypointLink()

      const response = {
        accessToken,
        _links: this.#linkBuilder.build()
      }

      res
        .status(201)
        .json(response)
    } catch (error) {
      const err = createError(401)
      err.cause = error
      err.message = 'Invalid email or password'
      next(err)
    }
  }

  /**
   * Sends a JSON with related links on successful registration.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async register(req, res, next) {
    try {
      await this.#usersService.insert({ 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
  
      this.#linkBuilder.addSelfLink(`${this.#usersEndpoint}${req.route.path}`, 'POST')
      this.#linkBuilder.addLoginUserLink(`${this.#usersEndpoint}/login`)

      const response = {
        _links: this.#linkBuilder.build()
      }

      res
        .status(201)
        .json(response)
    } catch (error) {
      let err = error
      if (err.code === 11000) {
        let key = Object.keys(err.keyPattern)[0]
        key = key.charAt(0).toUpperCase() + key.slice(1);
        err = createError(409)
        err.message = `${key} is already in use`
      } else if (error.name === 'ValidationError') {
        err = createError(400)
      }

      next(err)
    }
  }
}
