import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LocationModule } from './location/location.module';
import {
  Location,
  AirQualityReport,
  AirQualitySensor,
  Pollutant,
  ReportPollutant,
} from './location/entities'; // Adjust the import path as necessary

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'respiradb',
      port: 5432,
      username: 'postgres',
      password: 'respira1234',
      database: 'postgres',
      entities: [
        Location,
        AirQualityReport,
        AirQualitySensor,
        Pollutant,
        ReportPollutant,
      ],
      synchronize: true, // Set to false in production
      logging: true, // Enable logging for debugging
    }),
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // You can use the dataSource here if needed
  }
}
