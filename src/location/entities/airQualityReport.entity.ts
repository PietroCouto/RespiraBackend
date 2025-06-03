import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { AirQualitySensor } from './airQualitySensor.entity';

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('air_quality_report')
export class AirQualityReport {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => AirQualitySensor)
  @JoinColumn({ name: 'sensorId' })
  sensorId: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.LOW,
  })
  generalSeverity: Severity;
}
