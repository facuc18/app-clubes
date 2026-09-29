// IsString, IsNotEmpty, IsIn, IsArray: los mismos que ya conocías.
// ValidateIf: decorador especial que aplica las reglas de esa propiedad
//   SOLO SI la condición que le pasás da true. Sirve para casos como el
//   tuyo: "ubicacion es obligatoria, pero solo cuando formato es fisico".
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsArray,
  ValidateIf,
  IsOptional,
  IsInt,
  Min,
  ArrayMaxSize,
} from 'class-validator';

export class CrearClubDto {
  // Nombre del club: texto obligatorio.
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  // Categorías: un array donde CADA elemento tiene que ser un string.
  @IsArray()
  @ArrayMaxSize(3, { message: 'Un club puede tener como máximo 3 categorías' })
  @IsString({ each: true })
  categorias!: string[];

  // Formato: solo puede ser uno de estos dos valores exactos.
  @IsIn(['fisico', 'virtual'])
  formato!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  // Ubicación: acá está lo nuevo.
  // @ValidateIf((club) => club.formato === 'fisico') significa:
  // "aplicá las validaciones de abajo (@IsString, @IsNotEmpty) SOLO SI
  // el formato de ESTE club en particular es 'fisico'". "club" es el
  // objeto completo que está siendo validado en ese momento, por eso
  // podemos leer club.formato adentro de la función.
  // Si el formato es 'virtual', esta propiedad ni se revisa, puede
  // venir vacía o directamente no venir.
  @ValidateIf((club: CrearClubDto) => club.formato === 'fisico')
  @IsString()
  @IsNotEmpty()
  ubicacion?: string;
  // El "?" al final del nombre le dice a TypeScript que esta propiedad
  // es OPCIONAL (puede no existir), porque no siempre es obligatoria.

  @IsOptional()
  @IsString()
  ciudad?: string;

  // Horario: un array de strings, mismo patrón que categorias.
  // Por ejemplo: ["lunes 18:00 a 20:00", "miercoles 18:00 a 20:00"]
  @IsArray()
  @IsString({ each: true })
  horario!: string[];
}
