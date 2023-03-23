import { MongooseRepositoryBase } from '../repositories/mongoose-repository-base.js'

export class MongooseServiceBase {
  #repository

  constructor (repository) {
    this.#repository = repository
  }

  async get () {
    return this.#repository.get()
  }

  async getById (id) {
    return this.#repository.getById(id)
  }

  async update (id, data) {
    return this.#repository.update(id, data)
  }

  async insert (data) {
    return this.#repository.insert(data)
  }

  async delete (id) {
    return this.#repository.delete()
  }
}