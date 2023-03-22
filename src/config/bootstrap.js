import { IoCContainer } from '../util/IoCContainer.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

export const container = Object.freeze(iocContainer)
