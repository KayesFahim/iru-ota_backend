import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FlightSearchModel } from './flight.model';
import * as dotenv from "dotenv";
dotenv.config()

@Injectable()
export class DuffelService {

    async airSearch(createFlightDto  : FlightSearchModel){
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
            const FlightOffers: any[] = result.data.offers || [];
            const AllFlights: any[] = [];
            if (FlightOffers.length > 0) {
                FlightOffers.forEach((FlightOffer: any) => {
                    const OfferId: string = FlightOffer.id;
                    const Emissions: string = FlightOffer.total_emissions_kg;
                    const Currency: string = FlightOffer.base_currency;
                    const Carrier: string = FlightOffer.owner.name;
                    const CarrierLogo: string = FlightOffer.owner.logo_symbol_url;
                    const BaseFare = FlightOffer.base_amount;
                    const Taxes: number = Math.ceil(FlightOffer.tax_amount);
                    const TotalFare: number = BaseFare + Taxes;
                    const PaymentType: any = FlightOffer.payment_requirements;
                    const FareRules: any = FlightOffer.conditions;
                    const Passengers: any = FlightOffer.passengers;
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
        }catch(err){
            console.log(err);
        }
    }

    // async OutBoundFare(createFlightDto  : FlightSearchModel){
    //     const Slices = createFlightDto.segments;
    //     const AdultCount = createFlightDto.adultcount;
    //     const ChildCount = createFlightDto.childcount;
    //     const InfantCount = createFlightDto.infantcount;
    //     const Class = createFlightDto.cabinclass;

    //     const SliceArray = Slices.map((slics: any) => ({
    //         origin: slics.depfrom,
    //         destination: slics.arrto,
    //         departure_date: slics.depdate
    //     }));

    //     const AllSlice = JSON.stringify(SliceArray);

    //     const Passengers = [];

    //     if (AdultCount > 0 && ChildCount > 0 && InfantCount > 0) {
    //     for (let i = 0; i < AdultCount; i++) {
    //         Passengers.push({ type: "adult" });
    //     }

    //     for (let i = 0; i < ChildCount; i++) {
    //         Passengers.push({ type: "child" });
    //     }

    //     for (let i = 0; i < InfantCount; i++) {
    //         Passengers.push({ type: "infant_without_seat" });
    //     }
    //     } else if (AdultCount > 0 && ChildCount > 0) {
    //     for (let i = 0; i < AdultCount; i++) {
    //         Passengers.push({ type: "adult" });
    //     }

    //     for (let i = 0; i < ChildCount; i++) {
    //         Passengers.push({ type: "child" });
    //     }

    //     for (let i = 0; i < InfantCount; i++) {
    //         Passengers.push({ type: "infant_without_seat" });
    //     }
    //     } else if (AdultCount > 0 && InfantCount > 0) {
    //     for (let i = 0; i < AdultCount; i++) {
    //         Passengers.push({ type: "adult" });
    //     }

    //     for (let i = 0; i < InfantCount; i++) {
    //         Passengers.push({ type: "infant_without_seat" });
    //     }
    //     } else if (AdultCount > 0) {
    //     for (let i = 0; i < AdultCount; i++) {
    //         Passengers.push({ type: "adult" });
    //     }
    //     }

    //     const Passenger = JSON.stringify(Passengers);

    //     const data = `{
    //         "data": {
    //             "slices": ${AllSlice},
    //             "passengers": ${Passenger},
    //             "max_connections": 2,
    //             "cabin_class": "${Class}"
    //         }
    //     }`;

    //     let config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: process.env.DUFFEL_PARTIAL_OFFER_REQ,
    //         headers: { 
    //             'Accept-Encoding': 'gzip', 
    //             'Accept': 'application/json', 
    //             'Duffel-Version': 'v1', 
    //             'Content-Type': 'application/json', 
    //             'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
    //           },
    //         data : data
    //       };


    //     try{
    //         const response = await axios.request(config);
            
    //         const result = response.data; 
    //         const FlightOffers: any[] = result.data.offers || [];
    //         const AllFlights: any[] = [];
    //         const OutboundId : string = result.data.id || '';
    //         if (FlightOffers.length > 0) {
    //             FlightOffers.forEach((FlightOffer: any) => {
    //                 const OfferId: string = FlightOffer.id;
    //                 const Emissions: string = FlightOffer.total_emissions_kg;
    //                 const Currency: string = FlightOffer.base_currency;
    //                 const Carrier: string = FlightOffer.owner.name;
    //                 const CarrierLogo: string = FlightOffer.owner.logo_symbol_url;
    //                 const BaseFare = FlightOffer.base_amount;
    //                 const Taxes: number = Math.ceil(FlightOffer.tax_amount);
    //                 const TotalFare: number = BaseFare + Taxes;
    //                 const PaymentType: any = FlightOffer.payment_requirements;
    //                 const FareRules: any = FlightOffer.conditions;
    //                 const Passengers: any = FlightOffer.passengers;
    //                 const AllSegmentData: any[] = FlightOffer.slices;
    //                 const CabinClass: string = AllSegmentData[0].segments[0].passengers[0].cabin_class_marketing_name;

    //                 const SegmentArray: any[] = [];

    //                 AllSegmentData.forEach((LegSegmentData: any) => {
    //                     const SegmentData: any[] = LegSegmentData.segments;

    //                     SegmentData.forEach((Segment: any) => {
    //                         const Origin: string = Segment.origin.iata_code;
    //                         const OriginAirport: string = Segment.origin.name;
    //                         const OriginCountry: string = `${Segment.origin.city_name}, ${Segment.origin.iata_country_code}`;

    //                         const Destination: string = Segment.destination.iata_code;
    //                         const DestinationAirport: string = Segment.destination.name;
    //                         const DestinationCountry: string = `${Segment.destination.city_name}, ${Segment.destination.iata_country_code}`;

    //                         const DepTime: string = Segment.departing_at;
    //                         const ArrTime: string = Segment.arriving_at;

    //                         const MarkettingCarrier: string = Segment.marketing_carrier.iata_code;
    //                         const MarkettingCarrierName: string = Segment.marketing_carrier.name;
    //                         const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

    //                         const OperatingCarrier: string = Segment.operating_carrier.iata_code;
    //                         const OperatingCarrierName: string = Segment.operating_carrier.name;
    //                         const OperatingCarrierNumber: string = Segment.operating_carrier_flight_number;

    //                         const AirCraftModel: string = Segment.aircraft?.name || '';
    //                         const Duration: number = Segment.duration;
    //                         const Baggage: any = Segment.passengers[0].baggages;

    //                         const SingleSegment: any = {
    //                             DepFrom: Origin,
    //                             DepAirport: OriginAirport,
    //                             DepCountry: OriginCountry,
    //                             DepTime: DepTime,
    //                             ArrTo: Destination,
    //                             ArrAirport: DestinationAirport,
    //                             ArrCountry: DestinationCountry,
    //                             ArrTime: ArrTime,
    //                             MarkettingCarrier: MarkettingCarrier,
    //                             MarkettingCarrierName: MarkettingCarrierName,
    //                             MarkettingCarrierNumber: MarkettingCarrierNumber,
    //                             OperatingCarrier: OperatingCarrier,
    //                             OperatingCarrierName: OperatingCarrierName,
    //                             OperatingCarrierNumber: OperatingCarrierNumber,
    //                             AircraftModel: AirCraftModel,
    //                             Duration: Duration,
    //                             Baggage: Baggage
    //                         };

    //                         SegmentArray.push(SingleSegment);
    //                     });
    //                 });

    //                 const Itenary: any = {
    //                     System : 'Duffel',
    //                     OutboundId: OutboundId,
    //                     OfferId: OfferId,
    //                     Caree: Carrier,
    //                     Emissions: Emissions,
    //                     CarrierLogo: CarrierLogo,
    //                     BaseFare: BaseFare,
    //                     Taxes: Taxes,
    //                     TotalFare: TotalFare,
    //                     Currency: Currency,
    //                     Passengers: Passengers,
    //                     InstantPayment: PaymentType.requires_instant_payment,
    //                     FareRules: FareRules,
    //                     CabinClass: CabinClass,
    //                     Segments: SegmentArray
    //                 };

    //                 AllFlights.push(Itenary);
    //             });

    //             return AllFlights;
    //         } else { 
    //             return AllFlights;
    //         }
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    // async InBoundFare(outboundId: string, offerId: string){

    //     const url = `https://api.duffel.com/air/partial_offer_requests/${outboundId}`;
    //     let config = {
    //         method: 'get',
    //         maxBodyLength: Infinity,
    //         url: url,
    //         headers: { 
    //             'Accept-Encoding': 'gzip', 
    //             'Accept': 'application/json', 
    //             'Duffel-Version': 'v1', 
    //             'Content-Type': 'application/json', 
    //             'Authorization': 'Bearer '+`${process.env.DUFFEL_TOKEN_TEST}`
    //         }
    //       };


    //       try{
    //         const response = await axios.request(config);
            
    //         const result = response.data; 
    //         const FlightOffers: any[] = result.data.offers || [];
    //         const AllFlights: any[] = [];
    //         const InboundId : string = result.data.id || '';
    //         if (FlightOffers.length > 0) {
    //             FlightOffers.forEach((FlightOffer: any) => {
    //                 const OfferId: string = FlightOffer.id;
    //                 const Emissions: string = FlightOffer.total_emissions_kg;
    //                 const Currency: string = FlightOffer.base_currency;
    //                 const Carrier: string = FlightOffer.owner.name;
    //                 const CarrierLogo: string = FlightOffer.owner.logo_symbol_url;
    //                 const BaseFare = FlightOffer.base_amount;
    //                 const Taxes: number = Math.ceil(FlightOffer.tax_amount);
    //                 const TotalFare: number = BaseFare + Taxes;
    //                 const PaymentType: any = FlightOffer.payment_requirements;
    //                 const FareRules: any = FlightOffer.conditions;
    //                 const Passengers: any = FlightOffer.passengers;
    //                 const AllSegmentData: any[] = FlightOffer.slices;
    //                 const CabinClass: string = AllSegmentData[0].segments[0].passengers[0].cabin_class_marketing_name;

    //                 const SegmentArray: any[] = [];

    //                 AllSegmentData.forEach((LegSegmentData: any) => {
    //                     const SegmentData: any[] = LegSegmentData.segments;

    //                     SegmentData.forEach((Segment: any) => {
    //                         const Origin: string = Segment.origin.iata_code;
    //                         const OriginAirport: string = Segment.origin.name;
    //                         const OriginCountry: string = `${Segment.origin.city_name}, ${Segment.origin.iata_country_code}`;

    //                         const Destination: string = Segment.destination.iata_code;
    //                         const DestinationAirport: string = Segment.destination.name;
    //                         const DestinationCountry: string = `${Segment.destination.city_name}, ${Segment.destination.iata_country_code}`;

    //                         const DepTime: string = Segment.departing_at;
    //                         const ArrTime: string = Segment.arriving_at;

    //                         const MarkettingCarrier: string = Segment.marketing_carrier.iata_code;
    //                         const MarkettingCarrierName: string = Segment.marketing_carrier.name;
    //                         const MarkettingCarrierNumber: string = Segment.marketing_carrier_flight_number;

    //                         const OperatingCarrier: string = Segment.operating_carrier.iata_code;
    //                         const OperatingCarrierName: string = Segment.operating_carrier.name;
    //                         const OperatingCarrierNumber: string = Segment.operating_carrier_flight_number;

    //                         const AirCraftModel: string = Segment.aircraft?.name || '';
    //                         const Duration: number = Segment.duration;
    //                         const Baggage: any = Segment.passengers[0].baggages;

    //                         const SingleSegment: any = {
    //                             DepFrom: Origin,
    //                             DepAirport: OriginAirport,
    //                             DepCountry: OriginCountry,
    //                             DepTime: DepTime,
    //                             ArrTo: Destination,
    //                             ArrAirport: DestinationAirport,
    //                             ArrCountry: DestinationCountry,
    //                             ArrTime: ArrTime,
    //                             MarkettingCarrier: MarkettingCarrier,
    //                             MarkettingCarrierName: MarkettingCarrierName,
    //                             MarkettingCarrierNumber: MarkettingCarrierNumber,
    //                             OperatingCarrier: OperatingCarrier,
    //                             OperatingCarrierName: OperatingCarrierName,
    //                             OperatingCarrierNumber: OperatingCarrierNumber,
    //                             AircraftModel: AirCraftModel,
    //                             Duration: Duration,
    //                             Baggage: Baggage
    //                         };

    //                         SegmentArray.push(SingleSegment);
    //                     });
    //                 });

    //                 const Itenary: any = {
    //                     InboundId: InboundId,
    //                     OfferId: OfferId,
    //                     Caree: Carrier,
    //                     Emissions: Emissions,
    //                     CarrierLogo: CarrierLogo,
    //                     BaseFare: BaseFare,
    //                     Taxes: Taxes,
    //                     TotalFare: TotalFare,
    //                     Currency: Currency,
    //                     Passengers: Passengers,
    //                     InstantPayment: PaymentType.requires_instant_payment,
    //                     FareRules: FareRules,
    //                     CabinClass: CabinClass,
    //                     Segments: SegmentArray
    //                 };

    //                 AllFlights.push(Itenary);
    //             });

    //             return AllFlights;
    //         } else { 
    //             return AllFlights;
    //         }
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    // async SelectFare(outboundId: string, inboundId: string){
    //     let config = {
    //         method: 'get',
    //         maxBodyLength: Infinity,
    //         url: 'https://api.duffel.com/air/partial_offer_requests/prq_0000AeOtXn0busbbe0BRwW/fares?selected_partial_offer[]=off_0000AeOtXnDN9QoWHa9dpr_0&selected_partial_offer[]=off_0000AeP8ddoaC67V5CznJk_1',
    //         headers: { 
    //           'Accept': 'application/json', 
    //           'Accept-Encoding': 'gzip', 
    //           'Duffel-Version': 'v1', 
    //           'Authorization': 'Bearer duffel_test_TU0YqNPxlVilWZ_SebG0ZDuFI2dEBirZxUd21xJGvIq'
    //         }
    //       };
          
    //       try{
    //         const response = await axios.request(config);

    //         return response.data;
    //       }catch(err){

    //       }
          

    // }



}