import { IsArray, ValidateNested } from 'class-validator';
import { AirQualityReportDto } from '../dto';
import { Type } from 'class-transformer';

export class currentLocationAirHistoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirQualityReportDto)
  reports: AirQualityReportDto[];
}
