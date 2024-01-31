import { IsInt, IsPositive, IsString, Length, ArrayMinSize, IsDateString, ArrayMaxSize, ValidateNested, IsEmail, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SegmentDto {
  @ApiProperty({ default: 'LHR' })
  @IsString()
  @Length(3, 3)
  depfrom: string;

  @ApiProperty({ default: 'JFK' })
  @IsString()
  @Length(3, 3)
  arrto: string;

  @ApiProperty( { default: '2024-03-01' })
  @IsDateString()
  depdate: string;
}

export class FlightSearchModel {
  @ApiProperty({ default: 1 })
  @IsInt()
  @IsPositive()
  adultcount: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  childcount: number;

  @ApiProperty({ default: 0 })
  @IsInt()
  infantcount: number;

//   @ApiProperty({ default: 2 })
//   @IsInt()
//   connection: number;

  @ApiProperty({ default: 'Economy' })
  @IsString()
  @Length(1, 1)
  cabinclass: string = 'economy';

  @ApiProperty({ type: [SegmentDto] })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  segments: SegmentDto[];
}