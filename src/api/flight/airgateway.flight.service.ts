import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FlightSearchModel } from './dto/flight-search.dto';
import * as dotenv from "dotenv";
dotenv.config()
@Injectable()
export class AirGateWayService {


    async airSearch(createFlightDto  : FlightSearchModel){
        let data = JSON.stringify({
        "postman_help": {
            "method": "AirShopping",
            "type": "simple_flight"
        },
        "metadata": {
            "country": "DE",
            "currency": "EUR",
            "locale": "de_DE"
        },
        "originDestinations": [
            {
            "departure": {
                "airportCode": "LHR",
                "date": "2024-03-02",
                "terminalName": ""
            },
            "arrival": {
                "airportCode": "JFK",
                "terminalName": "",
                "time": ""
            }
            }
        ],
        "preferences": {
            "cabin": [
            "7"
            ],
            "nonStop": false
        },
        "travelers": {
            "adt": 1,
            "chd": 1,
            "inf": 1
        }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://proxy.airgateway.net/v1.2/AirShopping',
            headers: { 
              'AG-Consumer': 'AGW', 
              'AG-Providers': '*', 
              'Authorization': 'c7b4251c4a42d160e8c9f003e4034b64', 
              'AG-Trace': 'true', 
              'AG-Session-ID': '9ab802bd-2f31-195a-83ef-04dd4e6734a8', 
              'AG-Request-ID': 'be750df9-314f-c1db-3786-e54b01b07b87', 
              'NDC-Method': 'AirShopping', 
              'AG-Per-Provider-Limit': '20', 
              'AG-No-Cache': 'true', 
              'AG-Request-Timeout': '1000', 
              'Content-Type': 'application/json'
            },
            data : data
          };


        try{
            const response = await axios.request(config);
            console.log(response.data);
            return response.data;

        }catch(err){
            console.log(err);
        }


    }

}