import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { PostModel } from '../models/post-model.js'

export class PostRepository extends MongooseRepositoryBase {
  constructor (model = PostModel) {
    super(model)
  }

  async count(filter) {
    return await this._model.countDocuments(filter)
  }
}
