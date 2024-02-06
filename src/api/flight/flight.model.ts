import { IsInt, IsPositive, IsString, Length, ArrayMinSize, IsDateString, ArrayMaxSize, ValidateNested, IsEmail, IsArray, IsOptional, IsNotEmpty, MaxLength, maxLength, IsPhoneNumber, IsDate } from 'class-validator';
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

export class PassengerData{
    @ApiProperty({default: '+8801685370450'})
    @IsPhoneNumber()
    @MaxLength(15)
    phone_number: string

    @ApiProperty({default: 'abc@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({default: '1998-01-01'})
    @IsString()
    @IsNotEmpty()
    born_on: string

    @ApiProperty({default: 'mr'})
    @IsNotEmpty()
    @IsString()
    title: any

    @ApiProperty({default: 'm'})
    @IsNotEmpty()
    @IsString()
    @MaxLength(1)
    gender: any

    @ApiProperty({default: 'kayes'})
    @IsNotEmpty()
    @IsString()
    family_name: string

    @ApiProperty({default: 'zain'})
    @IsNotEmpty()
    @IsString()
    given_name: string

    @ApiProperty({default: 'pas_0000AebmLHzpETHC6wHYJ8'})
    @IsNotEmpty()
    @IsString()
    id: string
}

export class BookingModel{

  @ApiProperty({ default: 'Duffel' })
  @IsNotEmpty()
  @IsString()
  supplier : string

  @ApiProperty({ default: 'off_00009htYpSCXrwaB9DnUm0'})
  @IsNotEmpty()
  @IsString()
  offer_id : string

  @ApiProperty({ type: [PassengerData] })
  @ArrayMinSize(1)
  @ArrayMaxSize(9)
  passengers: PassengerData[]


}