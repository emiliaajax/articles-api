import { PostsController } from '../controllers/posts-controller.js'
import { UsersController } from '../controllers/users-controller.js'
import { PostModel } from '../models/post-model.js'
import { UserModel } from '../models/user-model.js'
import { PostRepository } from '../repositories/post-repository.js'
import { UserRepository } from '../repositories/user-repository.js'
import { PostsService } from '../services/posts-service.js'
import { UsersService } from '../services/users-service.js'
import { IoCContainer } from '../util/IoCContainer.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('PostModelType', PostModel, { type: true })
iocContainer.register('UserModelType', UserModel, { type: true })

iocContainer.register('PostRepositorySingleton', PostRepository, {
  dependencies: [
    'PostModelType'
  ],
  singleton: true
})

iocContainer.register('UserRepositorySingleton', UserRepository, {
  dependencies: [
    'UserModelType'
  ],
  singleton: true
})

iocContainer.register('PostsServiceSingleton', PostsService, {
  dependencies: [
    'PostRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('UsersServiceSingleton', UsersService, {
  dependencies: [
    'UserRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('PostsController', PostsController, {
  dependencies: [
    'PostsServiceSingleton'
  ]
})

iocContainer.register('UsersController', UsersController, {
  dependencies: [
    'UsersServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
