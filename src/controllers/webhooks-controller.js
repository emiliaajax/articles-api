/**
 * Module for WebhooksController.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

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
}
