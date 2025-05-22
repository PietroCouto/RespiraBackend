import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';

@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('/current-location-air-quality')
  getLocation(@Query('name') name: string): Promise<Location | null> {
    return this.locationService.getLocationByName(name);
  }

  @Get(' /current-location-air-history/:id')
  getLocationHistory(@Param('id') id: number): Promise<Location | null> {
    return this.locationService.getLocationById(id);
  }
}
