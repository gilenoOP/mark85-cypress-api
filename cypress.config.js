const { defineConfig } = require("cypress");
const { connect } = require('./cypress/support/mongo')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      const db = await connect()
      on('task', {
        async removeUser(emailUser) {
          const users = db.collection('users')
          await users.deleteMany({ email: emailUser })
          return null
        },
        async removeTask(taskName, emailUser) {
          const users = db.collection('users')
          const user = users.findOne({ name: taskName, email: emailUser })
          const tasks = db.collection('tasks')
          await tasks.deleteMany({ name: taskName, email: emailUser })
          return null
        }
      })

      return config
    },
    baseUrl: process.env.BASE_URL,
    video: false,
    screenshotOnRunFailure: false,
    env: {
      amqpHost: process.env.AMQP_HOST,
      amqpQueue: process.env.AMQP_QUEUE,
      amqpToken: process.env.AMQP_TOKEN,
    }
  }
})
