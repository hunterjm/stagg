import { Test, TestingModule } from '@nestjs/testing'
import { CallOfDutyOAuthController } from './controller'

describe('Oauth Controller', () => {
  let controller: CallOfDutyOAuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallOfDutyOAuthController],
    }).compile()

    controller = module.get<CallOfDutyOAuthController>(CallOfDutyOAuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
