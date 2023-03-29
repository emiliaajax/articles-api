/**
 * Module for WebhookRepository.
 *
 * @author Emilia Hansson
 * @version 1.0.0
 */

import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { WebhookModel } from '../models/webhook-model.js'

/**
 * Encapsulates a repository.
 */
export class WebhookRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebhookModel} [model=WebhookModel] A class with the same capabilities as WebhookModel.
   */
  constructor (model = WebhookModel) {
    super(model)
  }
}
