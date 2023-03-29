import { HomeController } from '../controllers/home-controller.js'
import { PostsController } from '../controllers/posts-controller.js'
import { UsersController } from '../controllers/users-controller.js'
import { WebhooksController } from '../controllers/webhooks-controller.js'
import { PostModel } from '../models/post-model.js'
import { UserModel } from '../models/user-model.js'
import { WebhookModel } from '../models/webhook-model.js'
import { PostRepository } from '../repositories/post-repository.js'
import { UserRepository } from '../repositories/user-repository.js'
import { WebhookRepository } from '../repositories/webhook-repository.js'
import { PostsService } from '../services/posts-service.js'
import { UsersService } from '../services/users-service.js'
import { WebhooksService } from '../services/webhooks-service.js'
import { IoCContainer } from '../util/ioc-container.js'
import { LinkBuilder } from '../util/link-builder.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)
iocContainer.register('BaseURL', process.env.BASE_URL)
iocContainer.register('ArticlesEndpoint', '/articles')
iocContainer.register('UsersEndpoint', '/users')

iocContainer.register('LinkBuilder', LinkBuilder, {
  dependencies: [
    'BaseURL'
  ]
})

iocContainer.register('PostModelType', PostModel, { type: true })
iocContainer.register('UserModelType', UserModel, { type: true })
iocContainer.register('WebhookModelType', WebhookModel, { type: true })

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

iocContainer.register('WebhookRepositorySingleton', WebhookRepository, {
  dependencies: [
    'WebhookModelType'
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

iocContainer.register('WebhooksServiceSingleton', WebhooksService, {
  dependencies: [
    'WebhookRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('HomeController', HomeController, {
  dependencies: [
    'LinkBuilder'
  ]
})

iocContainer.register('PostsController', PostsController, {
  dependencies: [
    'PostsServiceSingleton',
    'WebhooksServiceSingleton',
    'LinkBuilder',
    'ArticlesEndpoint'
  ]
})

iocContainer.register('UsersController', UsersController, {
  dependencies: [
    'UsersServiceSingleton',
    'LinkBuilder',
    'UsersEndpoint'
  ]
})

iocContainer.register('WebhooksController', WebhooksController, {
  dependencies: [
    'WebhooksServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
