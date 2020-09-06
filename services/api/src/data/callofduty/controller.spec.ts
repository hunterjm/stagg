import { Test, TestingModule } from '@nestjs/testing'
import { CallOfDutyDataController } from './controller'

describe('Oauth Controller', () => {
  let controller: CallOfDutyDataController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallOfDutyDataController],
    }).compile()

    controller = module.get<CallOfDutyDataController>(CallOfDutyDataController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
