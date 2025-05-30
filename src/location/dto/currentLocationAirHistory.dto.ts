import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { AirQualityReportDto } from '../dto';
import { Type } from 'class-transformer';

export class currentLocationAirHistoryDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirQualityReportDto)
  reports?: AirQualityReportDto[];
}
