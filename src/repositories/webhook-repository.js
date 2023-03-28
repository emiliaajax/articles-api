import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { WebhookModel } from '../models/webhook-model.js'

export class WebhookRepository extends MongooseRepositoryBase {
  constructor (model = WebhookModel) {
    super(model)
  }
}
