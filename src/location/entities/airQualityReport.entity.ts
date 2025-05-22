import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('air_quality_report')
export class AirQualityReport {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'date' })
  date: Date;
}
