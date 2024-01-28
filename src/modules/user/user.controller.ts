import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PagingResponseDto } from '@common/dto/paging-response.dto';
import { RolesGuard } from '@guards/role.guard';
import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UsersService } from './user.service';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private _service: UsersService) {}

  @Get()
  @ApiOkResponse()
  getUsers(@Query() options: PageOptionsDto): Promise<PagingResponseDto<UserDto>> {
    return this._service.getUsers(options);
  }

  @Get(':id')
  @ApiOkResponse()
  getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this._service.getUserById(id);
  }
}
