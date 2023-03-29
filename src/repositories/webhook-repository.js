import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { WebhookModel } from '../models/webhook-model.js'

/**
 * Encapsulates a repository.
 */
export class WebhookRepository extends MongooseRepositoryBase {
  constructor (model = WebhookModel) {
    super(model)
  }
}
