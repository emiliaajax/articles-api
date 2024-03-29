/**
 * Module for UsersService.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { MongooseServiceBase } from './mongoose-service-base.js'
import { UserRepository } from '../repositories/user-repository.js'
import jwt from 'jsonwebtoken'

/**
 * Encapsulates a service.
 */
export class UsersService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {UserRepository} [repository=new UserRepository()] Instanse from a class with the same capabilities as a UserRepository.
   */
  constructor (repository = new UserRepository()) {
    super(repository)
  }

  /**
   * Authenticates a user and generates a JWT access token.
   *
   * @param {string} email The user email.
   * @param {string} password The user password.
   * @returns {Promise<string>} A JWT for the authenticated user.
   */
  async authenticate (email, password) {
    const user = await this._repository.authenticate(email, password)

    const payload = {
      sub: user.id,
      username: user.username,
    }

    const accessToken = this.#generateAccessToken(payload)

    return accessToken
  }

  /**
   * Generates a JWT.
   *
   * @param {object} payload The payload to include in the token.
   * @returns {string} A JWT access token.
   */
  #generateAccessToken (payload) {
    return jwt.sign(payload, Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii'), {
      algorithm: 'RS256',
      expiresIn: process.env.PRIVATE_KEY_LIFE
    })
  }
}
