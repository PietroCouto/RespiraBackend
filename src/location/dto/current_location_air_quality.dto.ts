import { IsArray, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { LocationDto, AirQualityReportDto } from '../dto';
import { Type } from 'class-transformer';

export class CurrentLocationAirQualityDto {
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => AirQualityReportDto)
  airQualityReport: AirQualityReportDto;

  @IsArray()
  recommendations: string[];
}
