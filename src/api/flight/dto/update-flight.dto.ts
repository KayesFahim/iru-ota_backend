import { PartialType } from '@nestjs/mapped-types';
import { FlightSearchModel } from './flight-search.dto';

export class UpdateFlightDto extends PartialType(FlightSearchModel) {}
