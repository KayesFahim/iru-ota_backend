import { Controller, Post, Body, Param } from '@nestjs/common';
import { FlightService } from './flight.service';
import { ApiTags } from '@nestjs/swagger';
import { AirPriceModel, BookingModel, FlightSearchModel } from './flight.model';

@ApiTags("Ticketing Service")
@Controller('v1/flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService
  ) {}

  @Post('search')
  AirSearch(@Body() createFlightDto: FlightSearchModel) {
    return this.flightService.AirSearch(createFlightDto);
  }

  @Post('check')
  AirPrice(@Body() airPriceDto : AirPriceModel){
    return this.flightService.AirPrice(airPriceDto);
  }

  @Post('booking')
  AirBooking(@Body() createBookingDto: BookingModel) {
    return this.flightService.AirBooking(createBookingDto);
  }

}
