import { MongooseRepositoryBase } from '../repositories/mongoose-repository-base.js'

/**
 * Encapsulates a Mongoose service base.
 */
export class MongooseServiceBase {
  /**
   * The repository.
   * 
   * @protected
   */
  _repository

  /**
   * Initializes a new instance.
   *
   * @param {MongooseRepositoryBase} repository Instance from a class inherited from MongooseRepositoryBase.
   */
  constructor (repository) {
    this._repository = repository
  }

  /**
   * Returns all documents.
   * 
   * @returns {Promise<Array<Object>>} A promise resolved with all documents.
   */
  async get () {
    return this._repository.get()
  }

  /**
   * Returns a single document by id.
   * 
   * @param {string} id The document id.
   * @returns {Promise<Object} - A promise resolved with the document.
   */
  async getById (id) {
    return this._repository.getById(id)
  }

  /**
   * Updates a document.
   *
   * @param {string} id The document id.
   * @param {object} data The new data to update the document with.
   * @returns {Promise<object>} Promise resolved with the updated document.
   */
  async update (id, data) {
    return this._repository.update(id, data)
  }

  /**
   * Inserts a new document.
   *
   * @param {object} data The data to insert.
   * @returns {Promise<object>} Promise resolved with the created document.
   */
  async insert (data) {
    return this._repository.insert(data)
  }

  /**
   * Deletes a document.
   *
   * @param {string} id The document id.
   * @returns {Promise<object>} Promise resolved with the removed document.
   */
  async delete (id) {
    return this._repository.delete()
  }
}