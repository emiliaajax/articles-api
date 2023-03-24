import { MongooseServiceBase } from './mongoose-service-base.js'
import { UserRepository } from '../repositories/user-repository.js'

export class UsersService extends MongooseServiceBase {
  constructor (repository = new UserRepository()) {
    super(repository)
  }
}
