import { Test, TestingModule } from '@nestjs/testing'
import { CallOfDutyController } from './controller'

describe('Oauth Controller', () => {
  let controller: CallOfDutyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallOfDutyController],
    }).compile()

    controller = module.get<CallOfDutyController>(CallOfDutyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
