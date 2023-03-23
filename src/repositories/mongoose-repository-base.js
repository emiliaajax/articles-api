import mongoose from 'mongoose'

export class MongooseRepositoryBase {
  #model
  #allowedModelPropertyNames

  /**
   * Initializes a new instance.
   *
   * @param {mongoose.Model} model - A Mongoose model.
   */
  constructor (model) {
    this.#model = model
  }

  async get (filter = null, projection = null, options = null) {
    return this.#model
      .find(filter, projection, options)
      .exec()
  }

  async getById (id, projection, options) {
    return this.#model
      .findById(id, projection, options)
      .exec()
  }

  async insert (data) {
    this.#ensureValidPropertyNames()
    return this.#model.create(data)
  }

  async delete (id, options) {
    return this.#model
      .findByIdAndDelete(id, options)
      .exec()
  }

  async update (id, updateData, options) {
    this.#ensureValidPropertyNames()
    return this.#model
      .findByIdAndUpdate(id, data, {
        ...options,
        new: true,
        runValidators: true
      })
      .exec()
  }

  get allowedModelPropertyNames () {
    // Lazy loading of the property names.
    if (!this.#allowedModelPropertyNames) {
      const disallowedPropertyNames = ['_id', '__v', 'createdAt', 'updatedAt', 'id']
      this.#allowedModelPropertyNames = Object.freeze(
        Object.keys(this.#model.schema.tree)
          .filter(key => !disallowedPropertyNames.includes(key))
      )
    }

    return this.#allowedModelPropertyNames
  }

  #ensureValidPropertyNames (data) {
    for (const key of Object.keys(data)) {
      if (!this.allowedModelPropertyNames.includes(key)) {
        // Fake it a bit to be able to treat this error as
        // a kind of a Mongoose validation error!
        const error = new Error(`'${key} is not a valid property name.`)
        error.name = 'ValidationError'
        throw error
      }
    }
  }
}