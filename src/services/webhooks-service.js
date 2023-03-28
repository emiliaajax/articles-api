import { WebhookRepository } from '../repositories/webhook-repository.js'
import { MongooseServiceBase } from './mongoose-service-base.js'

export class WebhooksService extends MongooseServiceBase {
  constructor (repository = new WebhookRepository()) {
    super(repository)
  }

  async insert(data) {
    try {
      const validUrl = new URL(data)

      await this._repository.insert({ url: validUrl.href })
    } catch (error) {
      throw new Error('Invalid url')
    }
  }
}
