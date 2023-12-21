import { createClient } from "redis"
import dotenv from 'dotenv'

const env = dotenv.config().parsed

export const client = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
})

export const publish = async (channel, data) => {
  await client.connect()
  await client.publish(channel, data)
  await client.disconnect()
}