
export class MongooseRepositoryBase {
  _model
  #allowedModelPropertyNames

  constructor (model) {
    this._model = model
  }

  async get (filter = null, projection = null, options = null) {
    return this._model
      .find(filter, projection, options)
      .exec()
  }

  async getById (id, projection, options) {
    return this._model
      .findById(id, projection, options)
      .exec()
  }

  async insert (data) {
    this._ensureValidPropertyNames(data)
    return this._model.create(data)
  }

  async delete (id, options) {
    return this._model
      .findByIdAndDelete(id, options)
      .exec()
  }

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