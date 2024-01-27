import { Controller, Post, Body } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightSearchModel } from './dto/flight-search.dto';
import { ApiTags } from '@nestjs/swagger';
import { DuffelService } from './duffel.flight.service';
import { AirGateWayService } from './airgateway.flight.service';

@ApiTags("Ticketing Service")
@Controller('v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly duffelService: DuffelService,
    private readonly airgatewayservice: AirGateWayService) {}

  @Post('duffel')
  duffelApi(@Body() createFlightDto: FlightSearchModel) {
    return this.duffelService.airSearch(createFlightDto);
  }

  @Post('airgateway')
  airGateway(@Body() createFlightDto: FlightSearchModel) {
    return this.airgatewayservice.airSearch(createFlightDto);
  }

}
