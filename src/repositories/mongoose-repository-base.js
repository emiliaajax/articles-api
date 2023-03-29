/**
 * Module for MongooseRepositoryBase.
 *
 * @author Mats Loock
 * @author Emilia Hansson
 * @version 2.0.1
 */

import mongoose from "mongoose"

/**
 * Encapsulates a Mongoose repository base.
 */
export class MongooseRepositoryBase {
  /**
   * The Mongoose model.
   *
   * @protected
   */
  _model

  /**
   * Allowed model property names.
   * 
   * @private
   */
  #allowedModelPropertyNames

  /**
   * Initializes a new instance.
   *
   * @param {mongoose.Model} model A Mongoose model.
   */
  constructor (model) {
    this._model = model
  }

  /**
   * Gets documents.
   *
   * @param {object} filter - Filter to apply to the query.
   * @param {object|string|string[]} [projection] - Fields to return.
   * @param {object} [options] - See Query.prototype.setOptions().
   * @example
   * // Passing options
   * await myModelRepository.get({ name: /john/i }, null, { skip: 10 }).exec()
   * @returns {Promise<object[]>} Promise resolved with the found documents.
   */
  async get (filter = null, projection = null, options = null) {
    return this._model
      .find(filter, projection, options)
      .exec()
  }

  /**
   * Gets a single document by its id.
   *
   * @param {object|number|string} id - Value of the document id to get.
   * @param {object|string|string[]} [projection] - Fields to return.
   * @param {object} [options] - See Query.prototype.setOptions().
   * @returns {Promise<object>} Promise resolved with the found document.
   */
  async getById (id, projection, options) {
    return this._model
      .findById(id, projection, options)
      .exec()
  }

  /**
   * Inserts a document into the database.
   *
   * @param {object} insertData -  The data to create a new document out of.
   * @returns {Promise<object>} Promise resolved with the new document.
   */
  async insert (data) {
    this._ensureValidPropertyNames(data)
    return this._model.create(data)
  }

  /**
   * Updates a document according to the new data.
   *
   * @param {string} id - Value of the documents id to update.
   * @param {object} data - The new data to update the existing document with.
   * @param {object} [options] - See Query.prototype.setOptions().
   * @throws {Error} If the specified data contains invalid property names.
   * @returns {Promise<object>} Promise resolved with the updated document.
   */
  async update (id, data, options) {
    this._ensureValidPropertyNames(data)
    return this._model
      .findByIdAndUpdate(id, data, {
        ...options,
        new: true,
        runValidators: true
      })
      .exec()
  }

  /**
   * Deletes a document.
   *
   * @param {string} id - Value of the documents id to delete.
   * @param {object} [options] - See Query.prototype.setOptions().
   * @returns {Promise<object>} Promise resolved with the removed document.
   */
  async delete (id, options) {
    return this._model
      .findByIdAndDelete(id, options)
      .exec()
  }

  /**
   * Gets the allowed model property names.
   *
   * @returns {string[]} The allowed model property names.
   */
  get allowedModelPropertyNames () {
    if (!this.#allowedModelPropertyNames) {
      const disallowedPropertyNames = ['_id', '__v', 'createdAt', 'updatedAt', 'id']
      this.#allowedModelPropertyNames = Object.freeze(
        Object.keys(this._model.schema.tree)
          .filter(key => !disallowedPropertyNames.includes(key))
      )
    }

    return this.#allowedModelPropertyNames
  }

  /**
   * Ensures that the specified data only contains valid property names.
   *
   * @param {object} data The data to check.
   * @throws {Error} If the specified data contains invalid property names.
   */
  _ensureValidPropertyNames (data) {
    for (const key of Object.keys(data)) {
      if (!this.allowedModelPropertyNames.includes(key)) {
        const error = new Error(`'${key} is not a valid property name.`)
        error.name = 'ValidationError'
        throw error
      }
    }
  }
}