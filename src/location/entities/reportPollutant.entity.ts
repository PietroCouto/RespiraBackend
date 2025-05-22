import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { AirQualityReport, Pollutant } from './main';
import { Severity } from './airQualityReport.entity';

@Entity('report_pollutant')
export class ReportPollutant {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => AirQualityReport)
  @JoinColumn({ name: 'airQualityReportId' })
  airQualityReportId: AirQualityReport;

  @ManyToOne(() => Pollutant)
  @JoinColumn({ name: 'pollutantId' })
  pollutantId: bigint;

  @Column({ type: 'varchar', length: 10 })
  concentration: string;

  @Column({ type: 'enum', enum: Severity, default: 'LOW' })
  severity: Severity;
}
