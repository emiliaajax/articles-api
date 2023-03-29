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
   * The link builder.
   */
  #linkBuilder
  /**
   * The users endpoint.
   */
  #endpoint

  /**
   * Initializes a new instance.
   *
   * @param {UsersService} usersService Instanse from a class with the same capabilities as a UsersService.
   * @param {LinkBuilder} linkBuilder Instanse from a class with the same capabilites as LinkBuilder.
   * @param {string} endpoint The endpoint to the users.
   */
  constructor (usersService, linkBuilder, endpoint) {
    this.#usersService = usersService
    this.#linkBuilder = linkBuilder
    this.#endpoint = endpoint
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

      this.#linkBuilder.addSelfLink(`${this.#endpoint}${req.route.path}`, 'POST')
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
      await this.#usersService.insert({ email: req.body.email, password: req.body.password })
  
      this.#linkBuilder.addSelfLink(`${this.#endpoint}${req.route.path}`, 'POST')
      this.#linkBuilder.addLoginUserLink(`${this.#endpoint}/login`)

      const response = {
        _links: this.#linkBuilder.build()
      }

      res
        .status(201)
        .json(response)
    } catch (error) {
      let err = error
      if (err.code === 11000) {
        err = createError(409)
        err.message = 'Email is already in use'
      } else if (error.name === 'ValidationError') {
        err = createError(400)
      }

      next(err)
    }
  }
}
