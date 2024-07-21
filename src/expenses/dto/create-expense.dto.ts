import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateExpenseDto {

  @IsString()
  @MinLength(1)
  title:string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  quantity?:number;

  @IsOptional()
  @IsDateString()
  created?: string;
}
