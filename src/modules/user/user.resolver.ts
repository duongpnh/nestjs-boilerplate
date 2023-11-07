import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PagingResponseDto } from '@common/dto/paging-response.dto';
import { Public } from '@decorators/public.decorator';
import { RolesGuard } from '@guards/role.guard';
import { UserPage } from './dto/user-page.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './user.service';

@UseGuards(RolesGuard)
@Resolver()
export class UsersResolver {
  constructor(private _service: UsersService) {}

  @Query(() => UserPage)
  getUsers(@Args('queryParams') queryParams: PageOptionsDto): Promise<PagingResponseDto<UserDto>> {
    return this._service.getUsers(queryParams);
  }

  @Public()
  @Query(() => UserPage)
  getUsersWithoutToken(@Args('queryParams') queryParams: PageOptionsDto): Promise<PagingResponseDto<UserDto>> {
    return this._service.getUsers(queryParams);
  }
}
