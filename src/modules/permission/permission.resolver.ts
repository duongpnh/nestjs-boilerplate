import { HttpStatus } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ScopesService } from './permission.service';

@Resolver()
export class ScopesResolver {
  constructor(private _service: ScopesService) {}

  @Mutation(() => Int)
  async createScope(@Args('payload') payload: CreatePermissionDto): Promise<HttpStatus> {
    return this._service.createScope(payload);
  }
}
