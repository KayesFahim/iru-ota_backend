import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './api/flight/flight.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './api/users/users.module';

@Module({
  imports: [FlightModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
