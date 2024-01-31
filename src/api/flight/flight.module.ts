import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { DuffelService } from './duffel.flight.service';

@Module({
  controllers: [FlightController],
  providers: [FlightService, DuffelService],
})
export class FlightModule {}
