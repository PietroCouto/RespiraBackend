import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  CurrentLocationAirQualityDto,
  currentLocationAirHistoryDto,
} from './dto';

@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('/current-location-air-quality')
  getLatestLocationReport(
    @Query('name') name: string,
  ): Promise<CurrentLocationAirQualityDto> {
    return this.locationService.getLatestLocationReport(name);
  }

  @Get('/current-location-air-history')
  getLocationHistory(
    @Query('id') id: bigint,
  ): Promise<currentLocationAirHistoryDto> {
    return this.locationService.getLocationReportHistory(id);
  }
}
