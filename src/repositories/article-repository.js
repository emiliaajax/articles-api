import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { ArticleModel } from '../models/article-model.js'

/**
 * Encapsulates a repository.
 */
export class ArticleRepository extends MongooseRepositoryBase {
  constructor (model = ArticleModel) {
    super(model)
  }

  async count(filter) {
    return await this._model.countDocuments(filter)
  }
}
