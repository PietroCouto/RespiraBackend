import { Module } from '@nestjs/common';
import {
  Location,
  AirQualityReport,
  AirQualitySensor,
  Pollutant,
  ReportPollutant,
} from './entities';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      AirQualityReport,
      AirQualitySensor,
      Pollutant,
      ReportPollutant,
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
