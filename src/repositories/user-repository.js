/**
 * Module for UserRepository.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { UserModel } from '../models/user-model.js'
import bcrypt from 'bcryptjs'

/**
 * Encapsulates a repository.
 */
export class UserRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {UserModel} [model=UserModel] A class with the same capabilities as UserModel.
   */
  constructor (model = UserModel) {
    super(model)
  }

  /**
   * Authenticates a user.
   *
   * @param {string} email User email.
   * @param {string} password User password.
   * @returns {Promise<UserModel>} A promise that resolves with the authenticated user.
   */
  async authenticate (email, password) {
    return this._model.authenticate(email, password)
  }

  /**
   * Inserts a new user.
   *
   * @param {object} data The user data.
   * @returns {Promise<UserModel>} A promise resolved with the created user.
   * @throws {Error} If the data contains invalid property names.
   * @override
   */
  async insert (data) {
    this._ensureValidPropertyNames(data)

    const user = await this._model.create(data)

    user.password = await bcrypt.hash(user.password, 10)

    user.save()
  }
}
