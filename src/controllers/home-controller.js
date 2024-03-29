/**
 * Module for HomeController.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { LinkBuilder } from '../util/link-builder.js'

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * The link builder.
   */
  #linkBuilder
  /**
   * The articles endpoint.
   */
  #articlesEndpoint
  /**
   * The users endpoint.
   */
  #usersEndpoint

  /**
   * Initializes a new instance.
   *
   * @param {LinkBuilder} linkBuilder A link builder instantiated from a class with the same capabilites as LinkBuilder.
   * @param {string} articlesEndpoint The endpoint to the articles.
   * @param {string} usersEndpoint The endpoint to the users.
   */
  constructor(linkBuilder, articlesEndpoint, usersEndpoint) {
    this.#linkBuilder = linkBuilder
    this.#articlesEndpoint = articlesEndpoint
    this.#usersEndpoint = usersEndpoint
  }

  /**
   * API entrypoint.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  index (req, res, next) {
    try {
      this.#linkBuilder.addSelfLink('', 'GET')
      this.#linkBuilder.addArticlesPageLink(this.#articlesEndpoint)
      this.#linkBuilder.addCreateArticleLink(this.#articlesEndpoint)
      this.#linkBuilder.addRegisterUserLink(`${this.#usersEndpoint}/register`)
      this.#linkBuilder.addLoginUserLink(`${this.#usersEndpoint}/login`)

      const response = {
        _links: this.#linkBuilder.build()
      }

      res
        .json(response)
    } catch (error) {
      next(error)
    }
  }
}
