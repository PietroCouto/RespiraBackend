import { IsArray, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { AirQualityReportDto } from '../dto';
import { Type } from 'class-transformer';

export class currentLocationAirHistoryDto {
  @IsNotEmptyObject()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirQualityReportDto)
  reports: AirQualityReportDto[];
}
