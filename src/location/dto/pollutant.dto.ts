import { IsNumber, IsString, IsEnum } from 'class-validator';
import { Severity } from '../entities/airQualityReport.entity';

export class PollutantDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  concentration: string;

  @IsEnum(Severity)
  generalSeverity: Severity;
}
