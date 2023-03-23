import { PostsController } from '../controllers/posts-controller.js'
import { PostModel } from '../models/post-model.js'
import { PostRepository } from '../repositories/post-repository.js'
import { PostsService } from '../services/posts-service.js'
import { IoCContainer } from '../util/IoCContainer.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('PostModelType', PostModel, { type: true })

iocContainer.register('PostRepositorySingleton', PostRepository, {
  dependencies: [
    'PostModelType'
  ],
  singleton: true
})

iocContainer.register('PostsServiceSingleton', PostsService, {
  dependencies: [
    'PostRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('PostsController', PostsController, {
  dependencies: [
    'PostsServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
