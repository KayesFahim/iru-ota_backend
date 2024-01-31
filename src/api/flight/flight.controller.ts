import { Controller, Post, Body, Param } from '@nestjs/common';
import { FlightService } from './flight.service';
import { ApiTags } from '@nestjs/swagger';
import { DuffelService } from './duffel.flight.service';
import { FlightSearchModel } from './flight.model';

@ApiTags("Ticketing Service")
@Controller('v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService
  ) {}

  @Post('duffel')
  duffelApi(@Body() createFlightDto: FlightSearchModel) {
    return this.flightService.airSearch(createFlightDto);
  }

  @Post('duffel/outbound')
  OutBoundFare(@Body() createFlightDto: FlightSearchModel) {
    return this.flightService.OutBoundFare(createFlightDto);
  }

  @Post('duffel/inbound/:outboundId/:offerId')
  InBoundFare(
    @Param('outboundId') outboundId: string,
    @Param('offerId') offerId: string,

  ) {
    return this.flightService.InBoundFare(outboundId, offerId);
  }

  @Post('duffel/select/fare/:outboundId/:inboundId')
  SeelectFare(
    @Param('outboundId') outboundId: string,
    @Param('inboundId') inboundId: string,
  ) {
    return this.flightService.SelectFare(outboundId, inboundId);
  }

}
