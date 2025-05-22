import { Module } from '@nestjs/common';
import { Location } from './location.entity'; // Adjust the import path as necessary
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Location])], // Add your entities here
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
