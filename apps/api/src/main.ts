import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { RootModule } from './module'
import { PORT } from './config'

async function bootstrap() {
  console.log(
      `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
      `----------------------------------------------------------\n`+
      `| Stagg API Service\n`+
      `| http://localhost:${PORT}\n`+
      `----------------------------------------------------------${'\x1b[0m' /* reset */}`
  )
  const app = await NestFactory.create(RootModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
}
bootstrap()
