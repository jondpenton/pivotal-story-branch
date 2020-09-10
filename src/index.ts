#! /usr/bin/env node
import { startApp } from './app'

require('dotenv').config()

async function bootstrap() {
  if (!process.env.PIVOTAL_TRACKER_TOKEN) {
    throw new Error(
      'PIVOTAL_TRACKER_TOKEN env is required. It can be found here: https://www.pivotaltracker.com/profile'
    )
  }

  const link: string = process.argv[2]

  await startApp(link)
}

bootstrap().catch((...args) => {
  console.error(...args)
  process.exit(1)
})
