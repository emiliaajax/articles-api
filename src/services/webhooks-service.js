/**
 * Module for WebhooksService.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import axios from 'axios'
import { WebhookRepository } from '../repositories/webhook-repository.js'
import { MongooseServiceBase } from './mongoose-service-base.js'
import jwt from 'jsonwebtoken'

/**
 * Encapsulates a service.
 */
export class WebhooksService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebhookRepository} [repository=new WebhookRepository()] Instanse from a class with the same capabilities as a WebhookRepository.
   */
  constructor(repository = new WebhookRepository()) {
    super(repository)
  }

  /**
   * Inserts a new webhook url.
   *
   * @param {string} data The webhook url.
   * @throws {Error} If the URL is invalid.
   */
  async insert(data) {
    try {
      const validUrl = new URL(data)

      await this._repository.insert({ url: validUrl.href })
    } catch (error) {
      throw new Error('Invalid url')
    }
  }


  /**
   * Sends data to all registered webhooks.
   *
   * @param {object} data The data to send to the webhooks.
   * @throws {Error} If any webhook fails to receive the data.
   */
  async send(data) {
    const hooks = await this._repository.get()

    await Promise.all(hooks.map(async (hook) => {
      try {
        await axios.post(hook.url, data)
      } catch (error) {
        throw new Error('Failed to send event to webhook')
      }
    }))
  }

  /**
   * Authenticates a JWT and returns the payload.
   *
   * @param {string} authenticationScheme The authentication scheme used to sign the token.
   * @param {string} token The JWT to authenticate.
   * @returns {Object} The payload of the JWT.
   * @throws {Error} If the authentication scheme is invalid or the JWT signature cannot be verified.
   */
  authenticateJWT(authenticationScheme, token) {
    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme')
    }

    const payload = jwt.verify(token,
      Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('ascii'),
      {
        algorithms: 'RS256'
      }
    )

    return {
      id: payload.sub,
      username: payload.username
    }
  }
}
