import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('report_pollutant')
export class ReportPollutant {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint' })
  airQualityReportId: bigint;

  @Column({ type: 'bigint' })
  pollutantId: bigint;

  @Column({ type: 'varchar', length: 10 })
  concentration: string;
}
