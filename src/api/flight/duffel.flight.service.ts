import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Duffel } from '@duffel/api'
import { BookingModel, FlightSearchModel } from './flight.model';
import * as dotenv from "dotenv";
dotenv.config()

@Injectable()
export class DuffelService {

    async AirSearch(createFlightDto  : FlightSearchModel){
        const Slices = createFlightDto.segments;
        const AdultCount = createFlightDto.adult_count;
        const ChildCount = createFlightDto.child_count;
        const InfantCount = createFlightDto.infant_count;
        const Class = createFlightDto.cabin_class;
        const Connection  = createFlightDto.connection;

        const SliceArray = Slices.map((slics: any) => ({
            origin: slics.departure_from,
            destination: slics.arrival_to,
            departure_date: slics.departure_date
        }));

        const AllSlice = JSON.stringify(SliceArray);

        const Passengers = [];

        if (AdultCount > 0 && ChildCount > 0 && InfantCount > 0) {
        for (let i = 0; i < AdultCount; i++) {
            Passengers.push({ type: "adult" });
        }

        for (let i = 0; i < ChildCount; i++) {
            Passengers.push({ type: "child" });
        }

        for (let i = 0; i < InfantCount; i++) {
            Passengers.push({ type: "infant_without_seat" });
        }
        } else if (AdultCount > 0 && ChildCount > 0) {
        for (let i = 0; i < AdultCount; i++) {
            Passengers.push({ type: "adult" });
        }

        for (let i = 0; i < ChildCount; i++) {
            Passengers.push({ type: "child" });
        }

        for (let i = 0; i < InfantCount; i++) {
            Passengers.push({ type: "infant_without_seat" });
        }
        } else if (AdultCount > 0 && InfantCount > 0) {
        for (let i = 0; i < AdultCount; i++) {
            Passengers.push({ type: "adult" });
        }

        for (let i = 0; i < InfantCount; i++) {
            Passengers.push({ type: "infant_without_seat" });
        }
        } else if (AdultCount > 0) {
        for (let i = 0; i < AdultCount; i++) {
            Passengers.push({ type: "adult" });
        }
        }

        const Passenger = JSON.stringify(Passengers);

        const data = `{
            "data": {
                "slices": ${AllSlice},
                "passengers": ${Passenger},
                "max_connections": ${Connection},
                "cabin_class": "${Class}"
            }
        }`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.DUFFEL_OFFER_REQ,
            headers: { 
                'Accept-Encoding': 'gzip', 
                'Accept': 'application/json', 
                'Duffel-Version': 'v1', 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
              },
            data : data
          };


        try{
            const response = await axios.request(config);
            const result= response.data; 
            return await this.DuffelParserSearch(result);
            
        }catch(err){
            console.log(err);
        }
    }

    async AirPrice(OfferId: string){

        const duffel = new Duffel({token: `${process.env.DUFFEL_TOKEN_TEST}`})
          
        const data = duffel.offers.get(OfferId, {
            "return_available_services": true
        })

        return await this.DuffelParserAirPrice(data);

    }

    async AirBooking(createBookingDto : BookingModel){

    }

    async DuffelParserSearch(result : any){

        const FlightOffers = result.data.offers || [];
        const AllFlights: any[] = [];
        if (FlightOffers.length > 0) {
            FlightOffers.forEach((FlightOffer: any) => {
                const OfferId: string = FlightOffer.id;
                const Emissions: string = FlightOffer.total_emissions_kg;
                const Currency: string = FlightOffer.base_currency;
                const Carrier: string = FlightOffer.owner.name;
                const CarrierLogo: string = FlightOffer.owner.logo_symbol_url;
                const BaseFare : string = FlightOffer.base_amount;
                const Taxes: string = FlightOffer.tax_amount;
                const TotalFare: string = FlightOffer.total_amount;
                const PaymentType: any = FlightOffer.payment_requirements;
                const FareRules: any[] = FlightOffer.conditions;
                const Passengers: any[] = FlightOffer.passengers;
                const AllSegmentData: any[] = FlightOffer.slices;
                const CabinClass: string = AllSegmentData[0].segments[0].passengers[0].cabin_class_marketing_name;

                const SegmentArray: any[] = [];

                AllSegmentData.forEach((LegSegmentData: any) => {
                    const SegmentData: any[] = LegSegmentData.segments;

                    SegmentData.forEach((Segment: any) => {
                        const Origin: string = Segment.origin.iata_code;
                        const OriginAirport: string = Segment.origin.name;
                        const OriginCountry: string = `${Segment.origin.city_name}, ${Segment.origin.iata_country_code}`;

                        const Destination: string = Segment.destination.iata_code;
                        const DestinationAirport: string = Segment.destination.name;
                        const DestinationCountry: string = `${Segment.destination.city_name}, ${Segment.destination.iata_country_code}`;

                        const DepTime: string = Segment.departing_at;
                        const ArrTime: string = Segment.arriving_at;

                        const MarkettingCarrier: string = Segment.marketing_carrier.iata_code;
                        const MarkettingCarrierName: string = Segment.marketing_carrier.name;
                        const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

                        const OperatingCarrier: string = Segment.operating_carrier.iata_code;
                        const OperatingCarrierName: string = Segment.operating_carrier.name;
                        const OperatingCarrierNumber: string = Segment.operating_carrier_flight_number;

                        const AirCraftModel: string = Segment.aircraft?.name || '';
                        const Duration: number = Segment.duration;
                        const Baggage: any = Segment.passengers[0].baggages;

                        const SingleSegment: any = {
                            departure_from: Origin,
                            departure_airport: OriginAirport,
                            departure_ountry: OriginCountry,
                            departure_time: DepTime,
                            arrival_to: Destination,
                            arrival_airport: DestinationAirport,
                            arrival_country: DestinationCountry,
                            arrival_time: ArrTime,
                            marketting_carrier: MarkettingCarrier,
                            marketting_carrier_name: MarkettingCarrierName,
                            marketting_carrier_number: MarkettingCarrierNumber,
                            operating_carrier: OperatingCarrier,
                            operating_carrier_name: OperatingCarrierName,
                            operating_carrier_number: OperatingCarrierNumber,
                            aircraft_model: AirCraftModel,
                            duration: Duration,
                            baggage: Baggage
                        };

                        SegmentArray.push(SingleSegment);
                    });
                });

                const Itenary: any = {
                    supplier: 'Duffel',
                    offer_id: OfferId,
                    carrier: Carrier,
                    emissions: Emissions,
                    carrier_logo: CarrierLogo,
                    base_fare: BaseFare,
                    taxes: Taxes,
                    total_fare: TotalFare,
                    currency: Currency,
                    passengers: Passengers,
                    instant_payment: PaymentType.requires_instant_payment,
                    fare_rules: FareRules,
                    cabin_class: CabinClass,
                    segments: SegmentArray
                };

                AllFlights.push(Itenary);
            });

            return AllFlights;
        } else {
            
            return AllFlights;
        }

    }

    async DuffelParserAirPrice(result : any){

        return result.data;

        const FlightOffer = result.data || [];
        const OfferId: string = '';
        const Emissions: string = FlightOffer.total_emissions_kg;
        const Currency: string = FlightOffer.base_currency;
        const Carrier: string = FlightOffer.owner.name;
        const CarrierLogo: string = FlightOffer.owner.logo_symbol_url;
        const BaseFare : string = FlightOffer.base_amount;
        const Taxes: string = FlightOffer.tax_amount;
        const TotalFare: string = FlightOffer.total_amount;
        const PaymentType: any = FlightOffer.payment_requirements;
        const FareRules: any[] = FlightOffer.conditions;
        const Passengers: any[] = FlightOffer.passengers;
        const AllSegmentData: any[] = FlightOffer.slices;
        const CabinClass: string = AllSegmentData[0].segments[0].passengers[0].cabin_class_marketing_name;

        const SegmentArray: any[] = [];

        AllSegmentData.forEach((LegSegmentData: any) => {
            const SegmentData: any[] = LegSegmentData.segments;

            SegmentData.forEach((Segment: any) => {
                const Origin: string = Segment.origin.iata_code;
                const OriginAirport: string = Segment.origin.name;
                const OriginCountry: string = `${Segment.origin.city_name}, ${Segment.origin.iata_country_code}`;

                const Destination: string = Segment.destination.iata_code;
                const DestinationAirport: string = Segment.destination.name;
                const DestinationCountry: string = `${Segment.destination.city_name}, ${Segment.destination.iata_country_code}`;

                const DepTime: string = Segment.departing_at;
                const ArrTime: string = Segment.arriving_at;

                const MarkettingCarrier: string = Segment.marketing_carrier.iata_code;
                const MarkettingCarrierName: string = Segment.marketing_carrier.name;
                const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

                const OperatingCarrier: string = Segment.operating_carrier.iata_code;
                const OperatingCarrierName: string = Segment.operating_carrier.name;
                const OperatingCarrierNumber: string = Segment.operating_carrier_flight_number;

                const AirCraftModel: string = Segment.aircraft?.name || '';
                const Duration: number = Segment.duration;
                const Baggage: any = Segment.passengers[0].baggages;

                const SingleSegment: any = {
                    departure_from: Origin,
                    departure_airport: OriginAirport,
                    departure_ountry: OriginCountry,
                    departure_time: DepTime,
                    arrival_to: Destination,
                    arrival_airport: DestinationAirport,
                    arrival_country: DestinationCountry,
                    arrival_time: ArrTime,
                    marketting_carrier: MarkettingCarrier,
                    marketting_carrier_name: MarkettingCarrierName,
                    marketting_carrier_number: MarkettingCarrierNumber,
                    operating_carrier: OperatingCarrier,
                    operating_carrier_name: OperatingCarrierName,
                    operating_carrier_number: OperatingCarrierNumber,
                    aircraft_model: AirCraftModel,
                    duration: Duration,
                    baggage: Baggage
                };

                SegmentArray.push(SingleSegment);
            });
        });

        return {
            supplier: 'Duffel',
            offer_id: OfferId,
            carrier: Carrier,
            emissions: Emissions,
            carrier_logo: CarrierLogo,
            base_fare: BaseFare,
            taxes: Taxes,
            total_fare: TotalFare,
            currency: Currency,
            passengers: Passengers,
            instant_payment: PaymentType.requires_instant_payment,
            fare_rules: FareRules,
            cabin_class: CabinClass,
            segments: SegmentArray
        };

    }

}

