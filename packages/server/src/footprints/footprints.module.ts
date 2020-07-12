import { Module } from '@nestjs/common';
import { FootprintsService } from './footprints.service';
import { FootprintsResolver } from './footprints.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FootprintSchema } from './footprints.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Footprint', schema: FootprintSchema }]),
    UsersModule,
  ],
  providers: [FootprintsService, FootprintsResolver],
})
export class FootprintsModule {}
