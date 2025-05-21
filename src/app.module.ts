import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'respiradb',
      port: 5432,
      username: 'postgres',
      password: 'respira1234',
      database: 'respira',
      entities: [],
      synchronize: true, // Set to false in production
      logging: true, // Enable logging for debugging
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // You can use the dataSource here if needed
  }
}
