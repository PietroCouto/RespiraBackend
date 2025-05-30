import { ValidateNested } from 'class-validator';
import { LocationDto, AirQualityReportDto } from '.';
import { Type } from 'class-transformer';

export class CurrentLocationAirQualityDto {
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ValidateNested()
  @Type(() => AirQualityReportDto)
  airQualityReport?: AirQualityReportDto;

  recommendations?: string[];
}
