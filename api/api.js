/* global process, require */

import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import instagram from 'instagram-node'

import { secret, instagramId, instagramSecret, instagramToken  } from './config'
import { Server } from 'http'
import router from './router'


async function bootstrap () {
  try {
    console.log(chalk.yellow("⌛ Bootstrapping express server..."))

    let app = express()
    let server = Server(app)

    let port = process.env.PORT || 5000

    app.set(`superSecret`, secret)

    app.use(cors())

    app.use(bodyParser.json({ limit: `50mb` }))
    app.use(bodyParser.urlencoded({ limit: `50mb`, extended: true }))

    // Add intentional latency to all responses to simulate real life
    if (process.env.NODE_ENV !== `production`)
      app.use((req, res, next) => { setTimeout(next, 640) })

    let ig = instagram.instagram({})
    ig.use({ client_id: instagramId, client_secret: instagramSecret, access_token: instagramToken })

    app.use(`/api`, router({ app, ig }))

    server.listen(port, () => {
      console.log(chalk.white(`☆ listening on localhost:${port}`))
      console.log(chalk.green("✅ Server started at " + new Date(Date.now())))
    })
  }
  catch (err) {
    console.log(err)
  }
}

bootstrap()
