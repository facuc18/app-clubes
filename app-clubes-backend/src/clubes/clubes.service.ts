// Injectable: decorador que marca esta clase como "inyectable" (que Nest
//   puede crear una instancia y prestársela a otras clases, como el controller).
// NotFoundException: una clase de error ya armada por Nest, que cuando la
//   "lanzás" (throw), Nest automáticamente arma una respuesta HTTP con
//   status 404 y el mensaje que le pasaste. Ahorra tener que armar esa
//   respuesta a mano.
// Ambas vienen del paquete '@nestjs/common', que es la librería central
// de Nest con las piezas más usadas (decoradores, excepciones, etc.) —
// se instaló solo al crear el proyecto con "nest new".
import { Injectable, NotFoundException } from '@nestjs/common';

// @Injectable() no "hace" nada por sí solo en este archivo — es una
// instrucción para Nest: "cuando armes el mapa de dependencias de la app,
// contemplá que esta clase puede pedirse/inyectarse en otro lado".
// Sin este decorador, si otro archivo intenta inyectar ClubesService,
// Nest tira error porque no la reconoce como inyectable.
@Injectable()
export class ClubesService {
  // Propiedad de la clase: un array que vive en la memoria RAM del
  // proceso de Node mientras el servidor está corriendo. Se reinicia
  // (vuelve a este valor inicial) cada vez que reiniciás el servidor,
  // porque no está guardado en ningún archivo ni base de datos todavía.
  // Cada objeto del array simula lo que en el futuro sería una fila
  // de una tabla "clubes" en una base de datos real.
  clubes: any[] = [
    {
      id: 1,
      nombre: 'club1',
      categoria: ['categoria1', 'categoria2'],
      formato: 'presencial',
      ciudad: 'buenos aires',
    },
    {
      id: 2,
      nombre: 'club2',
      categoria: ['categoria2', 'categoria3'],
      formato: 'virtual',
      ciudad: 'buenos aires',
    },
  ];

  // Otra propiedad de la clase, marcada "private" (solo se puede usar
  // DENTRO de esta clase, no desde el controller ni desde afuera).
  // Sirve para saber qué número de id darle al PRÓXIMO club que se cree,
  // para que nunca se repita un id entre dos clubes.
  private siguienteId = 3;

  // ---------- READ (todos) ----------
  // Método sin parámetros. Se llama "obtenerTodos" porque su única tarea
  // es devolver el array "clubes" completo, tal como está en memoria.
  // No recibe nada porque no necesita ningún dato externo para hacer su trabajo.
  obtenerTodos(): any[] {
    return this.clubes;
    // "this" hace referencia a la instancia actual de la clase — es cómo
    // un método accede a las propiedades (this.clubes) de SU PROPIA clase.
  }

  // ---------- READ (uno solo) ----------
  // Recibe un parámetro "id" de tipo number (definido por vos al declarar
  // la función, no viene de ningún import).
  obtenerUno(id: number): any {
    // .find() es un método NATIVO de los arrays de JavaScript (no hace
    // falta importarlo de ningún lado, existe en el lenguaje mismo).
    // Recorre el array elemento por elemento, ejecuta la función que le
    // pasás por cada uno, y devuelve el PRIMER elemento donde esa función
    // dio "true". Si ninguno cumple, devuelve "undefined".
    // (c) => c.id === id es una "arrow function": una función corta que,
    // por cada club "c" del array, compara si su id coincide con el que
    // recibimos como parámetro.
    const club = this.clubes.find((c) => c.id === id);

    // Si "club" quedó undefined (no se encontró ninguno), lanzamos el
    // NotFoundException que importamos arriba. "throw" corta la ejecución
    // de la función acá mismo y Nest se encarga de convertir esto en una
    // respuesta HTTP 404 automáticamente — nosotros no armamos esa
    // respuesta a mano.
    if (!club) {
      throw new NotFoundException(`Club con id ${id} no encontrado`);
    }
    return club;
  }

  // ---------- CREATE ----------
  // Recibe "datosNuevoClub", que van a ser las propiedades del club nuevo
  // (nombre, categoria, formato, ciudad) SIN id, porque el id lo genera
  // este método, no quien hace la petición.
  crear(datosNuevoClub: any): any {
    const nuevoClub = {
      id: this.siguienteId,
      // "..." es el "spread operator", una sintaxis NATIVA de JavaScript
      // (no es un import, es parte del lenguaje). Significa "copiá acá
      // todas las propiedades de este objeto". O sea, este objeto nuevo
      // termina teniendo id + todo lo que vino en datosNuevoClub.
      ...datosNuevoClub,
    };
    this.siguienteId++; // el próximo club que se cree va a tener un id distinto

    // .push() es otro método NATIVO de arrays: agrega un elemento al
    // final del array, modificándolo directamente (no crea uno nuevo).
    this.clubes.push(nuevoClub);
    return nuevoClub;
  }

  // ---------- UPDATE ----------
  // Recibe el id de CUÁL club modificar, y los datos nuevos a aplicarle.
  actualizar(id: number, datosActualizados: any): any {
    // .findIndex() es igual a .find(), pero en vez de devolver el objeto
    // encontrado, devuelve su POSICIÓN (índice) dentro del array. Si no
    // encuentra ninguno, devuelve -1 (nunca un índice negativo real existe).
    const indice = this.clubes.findIndex((c) => c.id === id);

    if (indice === -1) {
      throw new NotFoundException(`Club con id ${id} no encontrado`);
    }

    // Reemplazamos la posición "indice" del array por un objeto nuevo que
    // combina (con spread) el club viejo y los datos actualizados. Como
    // el spread de datosActualizados va DESPUÉS, si hay una propiedad
    // repetida, gana el valor nuevo (pisa al viejo).
    this.clubes[indice] = {
      ...this.clubes[indice],
      ...datosActualizados,
    };

    return this.clubes[indice];
  }

  // ---------- DELETE ----------
  eliminar(id: number): any {
    const indice = this.clubes.findIndex((c) => c.id === id);

    if (indice === -1) {
      throw new NotFoundException(`Club con id ${id} no encontrado`);
    }

    // .splice(posicion, cantidad) es un método NATIVO de arrays que
    // ELIMINA elementos del array original (lo modifica directamente,
    // a diferencia de .find/.filter que no tocan el array), y además
    // DEVUELVE un array nuevo con los elementos que sacó.
    // Como sacamos uno solo, ese array devuelto tiene un solo elemento,
    // y lo "desestructuramos" con [clubEliminado] para sacarlo directo
    // del array de 1 elemento que nos devolvió .splice().
    const [clubEliminado] = this.clubes.splice(indice, 1);
    return clubEliminado;
  }
}