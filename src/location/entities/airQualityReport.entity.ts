import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { AirQualitySensor } from './airQualitySensor.entity';

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('air_quality_report')
export class AirQualityReport {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => AirQualitySensor)
  @JoinColumn({ name: 'sensorId' })
  sensorId: bigint;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.LOW,
  })
  generalSeverity: Severity;
}
