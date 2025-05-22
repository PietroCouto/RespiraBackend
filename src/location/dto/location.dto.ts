import { IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @IsNumber()
  id: bigint;

  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  cep: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}
