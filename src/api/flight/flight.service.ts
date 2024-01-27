import { Injectable } from '@nestjs/common';
import { FlightSearchModel } from './dto/flight-search.dto';

@Injectable()
export class FlightService {
  create(createFlightDto: FlightSearchModel) {
    return 'This action adds a new flight';
  }

}
