/**
 * Module for ArticlesService.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './mongoose-service-base.js'
import { ArticleRepository } from '../repositories/article-repository.js'
import jwt from 'jsonwebtoken'

/**
 * Encapsulates a service.
 */
export class ArticlesService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {ArticleRepository} [repository=new ArticleRepository()] Instanse from a class with the same capabilities as a ArticleRepository.
   */
  constructor (repository = new ArticleRepository()) {
    super(repository)
  }

  /**
   * Returns a paginated list of articles.
   *
   * @param {number} page The page number.
   * @param {number} perPage The number of articles per page.
   * @returns {Promise<object>} A Promise resolved with all articles.
   * @override
   */
  async get (page, perPage, filter = {}) {
    if (perPage > 100) {
      perPage = 100
    }

    const projection = {}
    const options = {
      limit: perPage,
      skip: (page - 1) * perPage
    }

    return this._repository.get(filter, projection, options)
  }

  /**
   * Returns the total number of pages based on a given filter and the number of articles per page.
   *
   * @param {number} perPage The number of articles per page.
   * @param {object} filter The filter to apply to the query.
   * @returns {Promise<number>} A Promise resolved with the total number of pages.
   */
  async getTotalNumberOfPages(perPage, filter) {
    const totalNumberOfPosts = await this._repository.count(filter)

    return Math.ceil(totalNumberOfPosts / perPage)
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
