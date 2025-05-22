import {
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Severity } from '../entities/airQualityReport.entity';
import { PollutantDto } from './pollutant.dto';
import { Type } from 'class-transformer';

export class AirQualityReportDto {
  @IsNumber()
  id: bigint;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(Severity)
  generalSeverity: Severity;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PollutantDto)
  pollutants: PollutantDto[];
}
