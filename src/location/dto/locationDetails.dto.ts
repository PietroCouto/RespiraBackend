import { ValidateNested, IsOptional } from 'class-validator';
import { LocationDto, AirQualityReportDto } from '.';
import { Type } from 'class-transformer';

export class LocationDetailsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AirQualityReportDto)
  airQualityReport?: AirQualityReportDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AirQualityReportDto)
  airQualityHistory?: AirQualityReportDto[];

  @IsOptional()
  isFavorite?: boolean;

  @IsOptional()
  recommendations?: string[];
}
