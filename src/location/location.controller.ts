import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities';
import { CurrentLocationAirQualityDto } from './dto';

@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('/current-location-air-quality')
  getLatestLocationReport(
    @Query('name') name: string,
  ): Promise<CurrentLocationAirQualityDto | null> {
    return this.locationService.getLatestLocationReport(name);
  }

  @Get('/current-location-air-history/:id')
  getLocationHistory(@Param('id') id: bigint): Promise<Location | null> {
    return this.locationService.getLocationById(id);
  }
}
