import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Public } from '@decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('/health-check')
  @ApiOkResponse()
  healthCheck(): HttpStatus {
    return HttpStatus.OK;
  }
}
