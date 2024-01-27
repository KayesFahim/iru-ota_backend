import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { AirGateWayService } from './airgateway.flight.service';
import { DuffelService } from './duffel.flight.service';

@Module({
  controllers: [FlightController],
  providers: [FlightService, AirGateWayService, DuffelService],
})
export class FlightModule {}
