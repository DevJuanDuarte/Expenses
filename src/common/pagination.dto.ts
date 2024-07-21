import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


// 1.Se crea el pagination del dto
export class PaginationDto {

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  offset?: number;
}