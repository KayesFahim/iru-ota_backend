import { IsInt, IsPositive, IsString, Length, ArrayMinSize, IsDateString, ArrayMaxSize, ValidateNested, IsEmail, IsArray, IsOptional, IsNotEmpty, MaxLength, maxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SegmentDto {
  @ApiProperty({ default: 'LHR' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  departure_from: string;

  @ApiProperty({ default: 'JFK' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  arrival_to: string;

  @ApiProperty( { default: '2024-03-01' })
  @IsDateString()
  @IsNotEmpty()
  @IsNotEmpty()
  departure_date: string;
}

export class FlightSearchModel {
  @ApiProperty({ default: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  adult_count: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  child_count: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  @IsNotEmpty()
  infant_count: number;

  @ApiProperty({ default: 2 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  connection: number;

  @ApiProperty({ default: 'Economy' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  cabin_class: string = 'economy';

  @ApiProperty({ type: [SegmentDto] })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  segments: SegmentDto[];
}

export class AirPriceModel{

  @ApiProperty({ default: 'Duffel' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  suppiler : string

  @ApiProperty({default: 'off_00009htYpSCXrwaB9DnUm0'})
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  offer_id : string

}

export class BookingModel{

}