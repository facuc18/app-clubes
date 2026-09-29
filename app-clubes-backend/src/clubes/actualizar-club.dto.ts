import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ActualizarClubDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number | null;
}
