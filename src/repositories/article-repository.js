/**
 * Module for ArticleRepository.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { ArticleModel } from '../models/article-model.js'

/**
 * Encapsulates a repository.
 */
export class ArticleRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {ArticleModel} [model=ArticleModel] A class with the same capabilities as ArticleModel.
   */
  constructor (model = ArticleModel) {
    super(model)
  }

  /**
   * Counts the filtered documents.
   *
   * @param {object} filter The filter to apply to the query.
   * @returns {Promise<number>} A Promise that resolves with the documents count.
   */
  async count(filter) {
    return await this._model.countDocuments(filter)
  }
}
