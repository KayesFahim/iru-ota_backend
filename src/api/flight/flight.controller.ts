import { Controller, Post, Body, Param, Get } from '@nestjs/common';
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

  @Post('price/check')
  AirPrice(@Body() airPriceDto : AirPriceModel){
    return this.flightService.AirPrice(airPriceDto);
  }

  @Post('booking/create')
  AirBooking(@Body() createBookingDto: BookingModel) {
    return this.flightService.AirBooking(createBookingDto);
  }

  @Get('booking/:order_id')
  AirGetBooking(
    @Param('order_id') OrderId: string) {
    return this.flightService.AirGetBooking(OrderId);
  }

  @Get('booking/services/:order_id')
  AirExtraService(
    @Param('order_id') OrderId: string) {
    return this.flightService.AirExtraService(OrderId);
  }
  
}
