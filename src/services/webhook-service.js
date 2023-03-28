import { WebhookRepository } from "../repositories/webhook-repository";
import { MongooseServiceBase } from "./mongoose-service-base";

export class WebhooksService extends MongooseServiceBase {
  constructor (repository = new WebhookRepository()) {
    super(repository)
  }

  async insert(url) {
    try {
      const validUrl = new URL(url)

      this._repository.insert({ url })
    } catch (error) {
      throw new Error('Invalid url')
    }
  }
}
