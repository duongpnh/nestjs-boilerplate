import { HttpStatus } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './role.service';

@Resolver()
export class RolesResolver {
  constructor(private _service: RolesService) {}

  @Mutation(() => Int)
  async createRole(@Args('payload') payload: CreateRoleDto): Promise<HttpStatus> {
    return this._service.createRole(payload);
  }
}
