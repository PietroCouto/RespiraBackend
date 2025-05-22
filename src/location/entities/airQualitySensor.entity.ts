import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('air_quality_sensor')
export class AirQualitySensor {
  @PrimaryColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint' })
  locationId: bigint;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'bigint' })
  lat: bigint;

  @Column({ type: 'bigint' })
  long: bigint;

  @Column({ type: 'varchar', length: 80 })
  source: string;
}
