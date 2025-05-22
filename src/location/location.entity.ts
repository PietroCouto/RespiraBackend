import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  cep: string;

  @Column()
  lat: number;

  @Column()
  long: number;
}
