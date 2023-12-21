import { createClient } from "redis"
import fetch from 'node-fetch'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

export const client = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT
})

export const consume = async () => {
  const subscriber = client.duplicate();
  subscriber.connect();

  subscriber.on("error", (err) => {
    console.log("\n redis connection error:", err);
  });

  subscriber.on("connect", () => {
    console.log("\n redis connected.");
  });

  subscriber.on("ready", () => {
    subscriber.subscribe("laravel_database_rbtumasterdatachannel", async (data) => {
      const {filter, updateDoc, token} = JSON.parse(data)

      const response = await fetch(`http://localhost:${env.APP_PORT}/api/documents`, {
        method: 'PUT',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter,
          updateDoc
        }),
      })
      const result = await response.json()
      console.log(result)
    });

    subscriber.subscribe("rbtuorderchannel", async (data) => {
      const {id, updateDoc, token} = JSON.parse(data)
      console.log(updateDoc)
      const response = await fetch(`http://localhost:${env.APP_PORT}/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( updateDoc ),
      })
      const result = await response.json()
      console.log(result)
    });
  });
}

export const publish = async (channel, data) => {
  await client.connect()
  await client.publish(channel, data)
  await client.disconnect()
}