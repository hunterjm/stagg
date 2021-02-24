import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import { ValidationPipe } from '@nestjs/common'
import { RootModule } from './module'
import { useConfig } from '@stagg/gcp'
import { config } from './config'
import { dbConnect } from './db'

async function bootstrap() {
  await useConfig(config)
  console.log(config)
  await dbConnect()
  console.log(
      `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
      `----------------------------------------------------------\n`+
      `| Stagg API Service\n`+
      `| http://localhost:${process.env.PORT || config.network.port.api || 8080}\n`+
      `----------------------------------------------------------${'\x1b[0m' /* reset */}`
  )
  const app = await NestFactory.create(RootModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }))
  await app.listen(process.env.PORT || config.network.port.api || 8080)
}
bootstrap()
