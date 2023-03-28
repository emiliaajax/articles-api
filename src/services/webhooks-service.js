import axios from 'axios'
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

  async send(data) {
    const hooks = await this._repository.get()

    await Promise.all(hooks.map(async (hook) => {
      try {
        await axios.post(hook.url, data)
      } catch (error) {
        throw new Error('Failed to send event to webhook')
      }
    }))
  }
}
