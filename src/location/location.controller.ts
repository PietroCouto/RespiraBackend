import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  CurrentLocationAirQualityDto,
  currentLocationAirHistoryDto,
} from './dto';

@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  /**
   * This endpoint retrieves the latest air quality report for a given location.
   * @param name The name of the location to get the latest air quality report for.
   * @returns A promise that resolves to the latest air quality report for the specified location.
   */
  @Get('/current-location-air-quality')
  getLatestLocationReport(
    @Query('name') name: string,
  ): Promise<CurrentLocationAirQualityDto> {
    if (!name) throw new Error('Location ID is required');

    return this.locationService.getLatestLocationReport(name);
  }

  /**
   * This endpoint retrieves the air quality history for a given location.
   * @param id The ID of the location to get the air quality history for.
   * @returns A promise that resolves to the air quality history for the specified location.
   */
  @Get('/current-location-air-history')
  getLocationHistory(
    @Query('id') id: string,
  ): Promise<currentLocationAirHistoryDto> {
    if (!id) throw new Error('Location ID is required');

    const parsedId: bigint = BigInt(id);

    return this.locationService.getLocationReportHistory(parsedId);
  }
}
