import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { AirQualityReport, Pollutant } from '.';
import { Severity } from './airQualityReport.entity';

@Entity('report_pollutant')
export class ReportPollutant {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => AirQualityReport)
  @JoinColumn({ name: 'airQualityReportId' })
  airQualityReportId: AirQualityReport;

  @ManyToOne(() => Pollutant)
  @JoinColumn({ name: 'pollutantId' })
  pollutantId: number;

  @Column({ type: 'varchar', length: 10 })
  concentration: string;

  @Column({ type: 'enum', enum: Severity, default: 'LOW' })
  severity: Severity;
}
