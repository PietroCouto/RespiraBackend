import { ValidateNested, IsArray, IsOptional } from 'class-validator';
import { LocationDto, AirQualityReportDto } from '.';
import { Type } from 'class-transformer';

export class CurrentLocationAirQualityDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AirQualityReportDto)
  airQualityReport?: AirQualityReportDto;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  recommendations?: string[];
}
