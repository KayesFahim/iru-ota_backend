import { Controller, Post, Body } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightSearchModel } from './dto/flight-search.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Ticketing Service")
@Controller('v1/flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  create(@Body() createFlightDto: FlightSearchModel) {
    return this.flightService.create(createFlightDto);
  }

}
