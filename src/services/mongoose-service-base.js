import { MongooseRepositoryBase } from '../repositories/mongoose-repository-base.js'

export class MongooseServiceBase {
  _repository

  constructor (repository) {
    this._repository = repository
  }

  async get () {
    return this._repository.get()
  }

  async getById (id) {
    return this._repository.getById(id)
  }

  async update (id, data) {
    return this._repository.update(id, data)
  }

  async insert (data) {
    return this._repository.insert(data)
  }

  async delete (id) {
    return this._repository.delete()
  }
}