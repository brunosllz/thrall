import { Module } from '@nestjs/common';

import { CreatePostUseCase } from './create-post';

//TODO: import database module
@Module({
  imports: [],
  providers: [CreatePostUseCase],
})
export class UseCasesModule {}
