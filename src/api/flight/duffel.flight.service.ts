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
        const Class = (createFlightDto.cabin_class === 'Any') ? '' : createFlightDto.cabin_class;
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
            //return result;
            return await this.DuffelParserSearch(result);
            
        }catch(err){
            console.log(err);
        }
    }

    async AirPrice(OfferId: string){

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.DUFFEL_SINGLE_OFFER}`+`/${OfferId}?return_available_services=true`,
            headers: { 
                'Accept-Encoding': 'gzip', 
                'Accept': 'application/json', 
                'Duffel-Version': 'v1', 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
              }
        };


        try{
            const response = await axios.request(config);
            const result= response.data; 
            return await this.DuffelParserAirPrice(result);
            
        }catch(err){
            console.log(err);
        }

    }

    async AirBooking(createBookingDto : BookingModel){

        const Passenger = createBookingDto.passengers;
        const OfferId = createBookingDto.offer_id;

        const data = {
            "data": {
              "type": "hold",
              "selected_offers": [OfferId],
              "passengers": Passenger
            }
        };

        //return data;

        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.DUFFEL_CREATE_ORDER,
            headers: { 
                'Accept-Encoding': 'gzip', 
                'Accept': 'application/json', 
                'Duffel-Version': 'v1', 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
              },
            data : data
        };

        const response = await axios.request(config);
        return response.data;

    }

    async AirGetBooking(OrderId: string){
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.DUFFEL_CREATE_ORDER}/${OrderId}`,
            headers: { 
                'Accept-Encoding': 'gzip', 
                'Accept': 'application/json', 
                'Duffel-Version': 'v1', 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
            },
        };


        try{
            const response = await axios.request(config);
            const result= response.data; 
            //return result;
            return await this.DuffelParserSearch(result);
            
        }catch(err){
            console.log(err);
        }

    }

    async AirExtraService(OrderId: string){
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.DUFFEL_CREATE_ORDER}/${OrderId}/available_services`,
            headers: { 
                'Accept-Encoding': 'gzip', 
                'Accept': 'application/json', 
                'Duffel-Version': 'v1', 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
            },
        };


        try{
            const response = await axios.request(config);
            const result= response.data; 
            return result;
            // return await this.DuffelParserSearch(result);
            
        }catch(err){
            console.log(err);
        }

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
                const CarrierLogo: string = FlightOffer.owner.logo_lockup_url;
                const BaseFare : string = FlightOffer.base_amount;
                const Taxes: string = FlightOffer.tax_amount;
                const TotalFare: string = FlightOffer.total_amount;
                const PaymentType: any = FlightOffer.payment_requirements;
                const FareRules: any[] = FlightOffer.conditions;
                const Passengers: any[] = FlightOffer.passengers;
                const AllSegmentData: any[] = FlightOffer.slices;
                const CabinClass: string = AllSegmentData[0].segments[0].passengers[0].cabin_class_marketing_name;

                const FareBrandName: string =  AllSegmentData[0].fare_brand_name;
                const Conditions: string = AllSegmentData[0].conditions;
                const SegmentArray: any[] = [];

                let i=0;
                AllSegmentData.forEach((LegSegmentData: any) => {
                    i++;
                    const SingleLeg = {
                        //"fare_brand_name": AllSegmentData[i-1].fare_brand_name,
                        "total_duration": AllSegmentData[i-1].duration,
                        //"conditions": AllSegmentData[i-1].conditions,
                    };
                    const SegmentData: any[] = LegSegmentData.segments;
                    const AllSegments: any[] = [];
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
                        const MarkettingLogo: string = Segment.marketing_carrier.logo_symbol_url;
                        const MarkettingCarrierName: string = Segment.marketing_carrier.name;
                        const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

                        const OperatingCarrier: string = Segment.operating_carrier.iata_code;
                        const OperatingCarrierLogo: string = Segment.operating_carrier.logo_symbol_url;
                        const OperatingCarrierName: string = Segment.operating_carrier.name;
                        const OperatingCarrierNumber: string = Segment.operating_carrier_flight_number;

                        const AirCraftModel: string = Segment.aircraft?.name || '';
                        const Duration: number = Segment.duration;
                        const Baggage: any = Segment.passengers[0].baggages;
                        const Amenities: any = Segment.passengers[0].cabin.amenities;

                        const SingleSegment: any = {
                            departure_from: Origin,
                            departure_airport: OriginAirport,
                            departure_country: OriginCountry,
                            departure_time: DepTime,
                            arrival_to: Destination,
                            arrival_airport: DestinationAirport,
                            arrival_country: DestinationCountry,
                            arrival_time: ArrTime,
                            marketting_carrier: MarkettingCarrier,
                            marketting_carrier_logo:MarkettingLogo,
                            marketting_carrier_name: MarkettingCarrierName,
                            marketting_carrier_number: MarkettingCarrierNumber,
                            operating_carrier: OperatingCarrier,
                            operating_carrier_logo: OperatingCarrierLogo,
                            operating_carrier_name: OperatingCarrierName,
                            operating_carrier_number: OperatingCarrierNumber,
                            aircraft_model: AirCraftModel,
                            duration: Duration,
                            baggage: Baggage,
                            amenities: Amenities
                        };

                        AllSegments.push(SingleSegment);
                    });

                    SingleLeg['segment_data'] = AllSegments;
                    SegmentArray.push(SingleLeg);
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
                    fare_brand_name: FareBrandName,
                    conditions: Conditions,
                    segments: SegmentArray
                };

                const foundFlight = AllFlights.find(flight => flight.carrier === Carrier 
                    && flight.fare_brand_name === FareBrandName);

                if (!foundFlight) {
                    AllFlights.push(Itenary);                 
                }
            });

            return AllFlights;
        } else {
            return AllFlights;
        }

    }

    async DuffelParserAirPrice(result : any){

        const FlightOffer = result.data || [];
        const OfferId: string = FlightOffer.offer_id;
        const Emissions: string = FlightOffer.total_emissions_kg;
        const Currency: string = FlightOffer.base_currency;
        const Carrier: string = FlightOffer.owner.name;
        const CarrierLogo: string = FlightOffer.owner.logo_lockup_url;
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
                const MarkettingCarrierLogo: string = Segment.marketing_carrier.logo_symbol_url;
                const MarkettingCarrierName: string = Segment.marketing_carrier.name;
                const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

                const OperatingCarrier: string = Segment.operating_carrier.iata_code;
                const OperatingCarrierLogo: string = Segment.operating_carrier.logo_symbol_url;
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
                    marketting_carrier_logo: MarkettingCarrierLogo,
                    marketting_carrier_name: MarkettingCarrierName,
                    marketting_carrier_number: MarkettingCarrierNumber,
                    operating_carrier: OperatingCarrier,
                    operating_carrier_logo: OperatingCarrierLogo,
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

