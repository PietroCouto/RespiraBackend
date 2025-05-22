import { IsArray, IsNotEmptyObject } from 'class-validator';
import { LocationDto, AirQualityReportDto } from '../dto';

export class CurrentLocationAirQualityDto {
  @IsNotEmptyObject()
  location: LocationDto;

  @IsNotEmptyObject()
  airQualityReport: AirQualityReportDto;

  @IsArray()
  recommendations: string[];
}
