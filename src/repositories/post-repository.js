import { MongooseRepositoryBase } from './mongoose-repository-base.js';
import { Post } from '../models/post.js';

export class PostRepository extends MongooseRepositoryBase {
  constructor (model = Post) {
    super(model)
  }
}
