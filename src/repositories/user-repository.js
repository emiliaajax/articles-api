import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { UserModel } from '../models/user-model.js'

export class UserRepository extends MongooseRepositoryBase {
  constructor (model = UserModel) {
    super(model)
  }
}
