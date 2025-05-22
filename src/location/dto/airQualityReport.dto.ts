import { IsNumber, IsDate, IsEnum, IsArray } from 'class-validator';
import { Severity } from '../entities/airQualityReport.entity';
import { PollutantDto } from './pollutant.dto';

export class AirQualityReportDto {
  @IsNumber()
  id: bigint;

  @IsDate()
  date: Date;

  @IsEnum(Severity)
  generalSeverity: Severity;

  @IsArray()
  pollutants: PollutantDto[];
}
