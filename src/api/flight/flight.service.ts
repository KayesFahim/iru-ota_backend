import { Injectable } from '@nestjs/common';
import { FlightSearchModel } from './flight.model';
import { DuffelService } from './duffel.flight.service';

@Injectable()
export class FlightService {

  constructor(
    private readonly duffelService: DuffelService
  ){}
  async airSearch(createFlightDto: FlightSearchModel) {
    const FlightData = await this.duffelService.airSearch(createFlightDto);
    return FlightData;
  }

  // async OutBoundFare(createFlightDto: FlightSearchModel) {
  //   const FlightData = await this.duffelService.OutBoundFare(createFlightDto);
  //   return FlightData;
  // }

  // async InBoundFare(outboundId : string, offerId : string){
  //   const FlightData = await this.duffelService.InBoundFare(outboundId, offerId);
  //   return FlightData;
  // }

  // async SelectFare(outboundId : string, inboundId : string) {
  //   const FlightData = await this.duffelService.SelectFare(outboundId, inboundId);
  //   return FlightData;
  // }

}
