'use strict'

export default {
  scheme: 'ws',
  // host: 'localhost',
  // port: 8080,
  host: 'carina.e-ducativa.com',
  port: 10080,
  io: { forceNew: false, transports: ['websocket'] }
}
