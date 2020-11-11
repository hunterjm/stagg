import { Test, TestingModule } from '@nestjs/testing'
import { CallOfDutyAccountController } from './controller'

describe('Oauth Controller', () => {
  let controller: CallOfDutyAccountController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallOfDutyAccountController],
    }).compile()

    controller = module.get<CallOfDutyAccountController>(CallOfDutyAccountController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
