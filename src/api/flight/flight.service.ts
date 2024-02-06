import { Injectable } from '@nestjs/common';
import { AirPriceModel, BookingModel, FlightSearchModel } from './flight.model';
import { DuffelService } from './duffel.flight.service';

@Injectable()
export class FlightService {

  constructor(
    private readonly duffelService: DuffelService
  ){}
  async AirSearch(createFlightDto: FlightSearchModel) {
    const FlightData = await this.duffelService.AirSearch(createFlightDto);
    return FlightData;
  }

  async AirPrice(airPriceDto : AirPriceModel) {
    const Supplier =  airPriceDto.suppiler;
    if(Supplier == 'Duffel'){
      return await this.duffelService.AirPrice(airPriceDto.offer_id);
    }else{
      throw new Error('Invalid Supplier');
    }
  }

  async AirBooking(createBookingDto : BookingModel) {
    return await this.duffelService.AirBooking(createBookingDto);
  }                                                                                                                                                                                                           

}
