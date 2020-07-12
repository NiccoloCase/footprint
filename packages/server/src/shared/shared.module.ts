import { Module } from '@nestjs/common';
import { DateScalar } from './graphql';

@Module({
  providers: [DateScalar],
})
export class SharedModule {}
