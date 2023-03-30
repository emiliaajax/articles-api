/**
 * Module for WebhooksController.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import createError from 'http-errors'
import { WebhooksService } from '../services/webhooks-service.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * The webhooks service.
   */
  #webhooksService

  /**
   * Initializes a new instance.
   * 
   * @param {WebhooksService} webhooksService Instanse from a class with the same capabilities as a WebhooksService.
   */
  constructor(webhooksService) {
    this.#webhooksService = webhooksService
  }

  /**
   * Registers a webhook.
   * 
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async register(req, res, next) {
    try {
      await this.#webhooksService.insert(req.body.url)

      res
        .status(201)
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

      req.user = this.#webhooksService.authenticateJWT(authenticationScheme, token)

      next()
    } catch (error) {
      const err = createError(401)
      err.message = 'Access token invalid or not provided.'
      err.cause = error
      next(err)
    }
  }
}
