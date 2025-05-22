import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('air_quality_report')
export class AirQualityReport {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.LOW,
  })
  generalSeverity: Severity;
}
