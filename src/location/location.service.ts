import { Injectable } from '@nestjs/common';
import { Location } from './entities';
import {
  CurrentLocationAirQualityDto,
  currentLocationAirHistoryDto,
  LocationDetailsDto,
  AirQualityReportDto,
} from './dto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class LocationService {
  constructor(private dataSource: DataSource) {}

  /**
   * Retrieves the latest air quality report for a specific location by name.
   * @param name - The name of the location.
   * @returns A promise that resolves to the latest air quality report for the location.
   */
  async getLatestLocationReport(
    name: string,
  ): Promise<CurrentLocationAirQualityDto> {
    // Query for the latest air quality report for the given location name
    const result: CurrentLocationAirQualityDto | undefined =
      await this.dataSource
        .createQueryBuilder(Location, 'l')

        // Select the location
        .select(
          'json_build_object(' +
            "'id'," +
            'l.id,' +
            "'name'," +
            'l.name,' +
            "'city'," +
            'l.city,' +
            "'state'," +
            'l.state,' +
            "'cep'," +
            'l.cep,' +
            "'lat'," +
            'l.lat,' +
            "'long'," +
            'l.long' +
            ')',
          'location',
        )

        // Select the latest air quality report and pollutants as airQualityReport
        .addSelect(
          'json_build_object(' +
            "'id', ar.id," +
            "'date', ar.date," +
            "'generalSeverity', ar.generalSeverity," +
            "'pollutants'," +
            'json_agg(' +
            'json_build_object(' +
            "'id', rp.id," +
            "'name', p.name," +
            "'concentration', rp.concentration," +
            "'severity', rp.severity" +
            ')' +
            ')' +
            ')',
          'airQualityReport',
        )

        // Join the necessary tables to get the latest report
        .innerJoin('air_quality_sensor', 's', 's.locationId = l.id')
        .innerJoin('air_quality_report', 'ar', 'ar.sensorId = s.id')
        .innerJoin('report_pollutant', 'rp', 'rp.airQualityReportId = ar.id')
        .innerJoin('pollutant', 'p', 'p.id = rp.pollutantId')

        // Filter by the location name
        .where('l.name LIKE :name', { name: `${name}%` })

        // Group by the location and report fields to ensure we get the latest report
        .groupBy(
          'l.id, l.name, l.city, l.state, l.lat, l.long, ar.id, ar.date, ar."generalSeverity"',
        )

        // Order by the report date in descending order to get the latest report
        .orderBy('ar.date', 'DESC')

        // Limit to the latest report
        .getRawOne();

    // If no results are found, return an empty DTO
    if (!result) return new CurrentLocationAirQualityDto();

    // THIS IS ABSOLUTELY TEMPORARY
    // TODO: REMOVE THIS
    // result[0].recommendations = [
    //   'Evite atividades ao ar livre durante o pico de poluição.',
    //   'Use máscara se necessário.',
    //   'Mantenha janelas fechadas para evitar a entrada de poluentes.',
    // ];

    // Convert the result to the DTO
    const dto: CurrentLocationAirQualityDto = plainToInstance(
      CurrentLocationAirQualityDto,
      result,
    );

    // Validate the DTO
    await validateOrReject(dto);

    // Return the data
    return dto;
  }

  /**
   * Retrieves the air quality report history for a specific location.
   * @param id - The ID of the location.
   * @returns A promise that resolves to the air quality report history for the location.
   */
  async getLocationReportHistory(
    id: bigint,
  ): Promise<currentLocationAirHistoryDto> {
    // Query for reports related to the location
    const result: currentLocationAirHistoryDto | undefined =
      await this.dataSource
        .createQueryBuilder(Location, 'l')

        // Aggregate the location report data
        .select('json_agg(report)', 'reports')

        // From where to aggregate the location reports
        .from(
          (subQuery) =>
            subQuery

              // Select the reports
              .select(
                'json_build_object(' +
                  "'id', ar.id," +
                  "'date', ar.date," +
                  "'generalSeverity', ar.generalSeverity," +
                  "'pollutants'," +
                  'json_agg(' +
                  'json_build_object(' +
                  "'id', rp.id," +
                  "'name', p.name," +
                  "'concentration', rp.concentration," +
                  "'severity', rp.severity" +
                  ')' +
                  ')' +
                  ')',
                'report',
              )

              // From the location table
              .from('location', 'l')

              // Join the necessary tables to assemble the reports
              .innerJoin('air_quality_sensor', 's', 's.locationId = l.id')
              .innerJoin('air_quality_report', 'ar', 'ar.sensorId = s.id')
              .innerJoin(
                'report_pollutant',
                'rp',
                'rp.airQualityReportId = ar.id',
              )
              .innerJoin('pollutant', 'p', 'p.id = rp.pollutantId')

              // Filter by the location ID
              .where('l.id = :id', { id })

              // Group by the location and report fields to ensure we get the reports
              .groupBy(
                'l.id, l.name, l.city, l.state, l.lat, l.long, ar.id, ar.date, ar."generalSeverity"',
              )

              // Order by the report date in descending order to get the latest reports
              .orderBy('ar.date', 'DESC')

              // Offset to start after the latest report
              .offset(1)

              // Limit to the latest 7 reports
              .limit(7),
          'report',
        )
        .getRawOne();

    // Return an empty DTO if no results are found
    if (!result) return new currentLocationAirHistoryDto();

    // Convert the result to the DTO
    const dto: currentLocationAirHistoryDto = plainToInstance(
      currentLocationAirHistoryDto,
      result,
    );

    // Validate the DTO
    await validateOrReject(dto);

    // Return the data
    return dto;
  }

  /**
   * Retrieves detailed information about a specific location, including its
   * current air quality and history.
   * @param id - The ID of the location.
   * @returns A promise that resolves to the details of the specified location.
   */
  async getLocationDetails(id: number): Promise<LocationDetailsDto> {
    // Query for the data related to the location
    const currentLocationAirHistory: currentLocationAirHistoryDto | undefined =
      await this.dataSource
        .createQueryBuilder(Location, 'l')

        // Aggregate the location report data
        .select('json_agg(report)', 'reports')

        // From where to aggregate the location reports
        .from(
          (subQuery) =>
            subQuery

              // Select the reports
              .select(
                'json_build_object(' +
                  "'id', ar.id," +
                  "'date', ar.date," +
                  "'generalSeverity', ar.generalSeverity," +
                  "'pollutants'," +
                  'json_agg(' +
                  'json_build_object(' +
                  "'id', rp.id," +
                  "'name', p.name," +
                  "'concentration', rp.concentration," +
                  "'severity', rp.severity" +
                  ')' +
                  ')' +
                  ')',
                'report',
              )

              // From the location table
              .from('location', 'l')

              // Join the necessary tables to assemble the reports
              .innerJoin('air_quality_sensor', 's', 's.locationId = l.id')
              .innerJoin('air_quality_report', 'ar', 'ar.sensorId = s.id')
              .innerJoin(
                'report_pollutant',
                'rp',
                'rp.airQualityReportId = ar.id',
              )
              .innerJoin('pollutant', 'p', 'p.id = rp.pollutantId')

              // Filter by the location ID
              .where('l.id = :id', { id })

              // Group by the location and report fields to ensure we get the reports
              .groupBy(
                'l.id, l.name, l.city, l.state, l.lat, l.long, ar.id, ar.date, ar."generalSeverity"',
              )

              // Order by the report date in descending order to get the latest reports
              .orderBy('ar.date', 'DESC')

              // Offset to start after the latest report
              .offset(1)

              // Limit to the latest 7 reports
              .limit(7),
          'report',
        )
        .getRawOne();

    const CurrentLocationAirQuality: CurrentLocationAirQualityDto | undefined =
      await this.dataSource
        .createQueryBuilder(Location, 'l')

        // Select the location
        .select(
          'json_build_object(' +
            "'id'," +
            'l.id,' +
            "'name'," +
            'l.name,' +
            "'city'," +
            'l.city,' +
            "'state'," +
            'l.state,' +
            "'cep'," +
            'l.cep,' +
            "'lat'," +
            'l.lat,' +
            "'long'," +
            'l.long' +
            ')',
          'location',
        )

        // Select the latest air quality report and pollutants as airQualityReport
        .addSelect(
          'json_build_object(' +
            "'id', ar.id," +
            "'date', ar.date," +
            "'generalSeverity', ar.generalSeverity," +
            "'pollutants'," +
            'json_agg(' +
            'json_build_object(' +
            "'id', rp.id," +
            "'name', p.name," +
            "'concentration', rp.concentration," +
            "'severity', rp.severity" +
            ')' +
            ')' +
            ')',
          'airQualityReport',
        )

        // Join the necessary tables to get the latest report
        .innerJoin('air_quality_sensor', 's', 's.locationId = l.id')
        .innerJoin('air_quality_report', 'ar', 'ar.sensorId = s.id')
        .innerJoin('report_pollutant', 'rp', 'rp.airQualityReportId = ar.id')
        .innerJoin('pollutant', 'p', 'p.id = rp.pollutantId')

        // Filter by the location id
        .where('l.id = :id', { id })

        // Group by the location and report fields to ensure we get the latest report
        .groupBy(
          'l.id, l.name, l.city, l.state, l.lat, l.long, ar.id, ar.date, ar."generalSeverity"',
        )

        // Order by the report date in descending order to get the latest report
        .orderBy('ar.date', 'DESC')

        // Limit to the latest report
        .getRawOne();

    let airQualityHistory: AirQualityReportDto[] | undefined;

    if (currentLocationAirHistory) {
      airQualityHistory = currentLocationAirHistory.reports;
    }
    // Convert the result to the DTO
    const locationDetails: LocationDetailsDto = plainToInstance(
      LocationDetailsDto,
      {
        airQualityHistory,
        ...CurrentLocationAirQuality,
      },
    );

    // Validate the DTO
    await validateOrReject(locationDetails);

    // Return the data
    return locationDetails;
  }
}
