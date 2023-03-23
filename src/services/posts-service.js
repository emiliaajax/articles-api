import { MongooseServiceBase } from './mongoose-service-base.js'
import { PostRepository } from '../repositories/post-repository.js'

export class PostsService extends MongooseServiceBase {
  constructor (repository = new PostRepository()) {
    super(repository)
  }
}
