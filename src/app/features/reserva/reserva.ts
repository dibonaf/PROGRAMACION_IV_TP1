/*import { Component, OnInit, signal } from "@angular/core";
import { LowerCasePipe } from "@angular/common";

type TipoButaca = 'ESTANDAR' | 'ACCESIBLE' | 'VIP';
type EstadoButaca = 'LIBRE' | 'OCUPADA' | 'SELECCIONADA';

export interface Butaca {
  id: string;
  fila: string;
  numero: number;
  tipo: TipoButaca;
  estado: EstadoButaca;
  precio: number;
}

interface FilaCine{
  letra: string;
  bloqueIzq: Butaca[];
  bloqueCen: Butaca[];
  bloqueDer: Butaca[];
}

@Component({
  imports: [LowerCasePipe],
  selector: 'app-reserva',
  templateUrl: './reserva.html',
  styleUrl: './reserva.css'
})
export class Reserva implements OnInit {
  filasCine = signal<FilaCine[]>([]);
  butacasSeleccionadas = signal<Butaca[]>([]);
  
  precioBase = 3500;
  precioVip = 5500;

  ngOnInit() {
    this.generarMapaButacas();
  }
  private generarMapaButacas() {
    const abecedario = 'ABCDEFGHIJKLMNOPQRST'.split('');
    const mapa: FilaCine[] = [];

    abecedario.forEach(letra => {
      const esAccesible = letra === 'J' || letra === 'K';
      const esVip = letra === 'R' || letra === 'S' || letra === 'T';
      
      const tipo: TipoButaca = esAccesible ? 'ACCESIBLE' : (esVip ? 'VIP' : 'ESTANDAR');
      const precio = esVip ? this.precioVip : this.precioBase;

      const cantIzq = esAccesible ? 2 : 4;
      const cantCen = esAccesible ? 10 : 20;
      const cantDer = esAccesible ? 2 : 4;

      let numActual = 1;

      const armarBloque = (cantidad: number): Butaca[] => {
        const bloque: Butaca[] = [];
        for (let i = 0; i < cantidad; i++) {
          bloque.push({
            id: `${letra}-${numActual}`,
            fila: letra,
            numero: numActual,
            tipo: tipo,
            estado: 'LIBRE',
            precio: precio
          });
          numActual++;
        }
        return bloque;
      };

      mapa.push({
        letra,
        bloqueIzq: armarBloque(cantIzq),
        bloqueCen: armarBloque(cantCen),
        bloqueDer: armarBloque(cantDer)
      });
    });

    this.filasCine.set(mapa);
  }

  toggleButaca(butaca: Butaca) {
    if (butaca.estado === 'OCUPADA') return;

    if (butaca.estado === 'LIBRE') {
      butaca.estado = 'SELECCIONADA';
      this.butacasSeleccionadas.update(b => [...b, butaca]);
    } else {
      butaca.estado = 'LIBRE';
      this.butacasSeleccionadas.update(b => b.filter(item => item.id !== butaca.id));
    }
  }
}*/

import { Component, OnInit, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

type TipoButaca = 'ESTANDAR' | 'ACCESIBLE' | 'VIP' | 'ESPACIO';
type EstadoButaca = 'LIBRE' | 'OCUPADA' | 'SELECCIONADA';

export interface Butaca {
  id: string;
  fila: string;
  numero: number;
  tipo: TipoButaca;
  estado: EstadoButaca;
  precio: number;
}

interface FilaCine {
  letra: string;
  bloqueIzq: Butaca[];
  bloqueCen: Butaca[];
  bloqueDer: Butaca[];
}

@Component({
  selector: 'app-reserva',
  imports: [LowerCasePipe],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css'
})
export class Reserva implements OnInit {
  filasCine = signal<FilaCine[]>([]);
  butacasSeleccionadas = signal<Butaca[]>([]);
  
  precioBase = 3500;
  precioVip = 5500;

  ngOnInit() {
    this.generarMapaButacas();
  }

  private generarMapaButacas() {
    const abecedario = 'ABCDEFGHIJKLMNOPQRST'.split('');
    const mapa: FilaCine[] = [];

    abecedario.forEach(letra => {
      const esAccesible = letra === 'J' || letra === 'K';
      const esVip = letra === 'R' || letra === 'S' || letra === 'T';
      
      const tipo: TipoButaca = esAccesible ? 'ACCESIBLE' : (esVip ? 'VIP' : 'ESTANDAR');
      const precio = esVip ? this.precioVip : this.precioBase;

      let numActual = 1;

      const armarBloque = (cantidadFisica: number, bloqueIdx: number): Butaca[] => {
        const bloque: Butaca[] = [];
        for (let i = 0; i < cantidadFisica; i++) {
          let esEspacioVacio = false;
          
          if (esAccesible) {
            const esIndicePar = i % 2 === 0;
            if (letra === 'J' && !esIndicePar) esEspacioVacio = true;
            if (letra === 'K' && esIndicePar) esEspacioVacio = true;
          }

          if (esEspacioVacio) {
            bloque.push({
              id: `ESP-${letra}-${i}-${bloqueIdx}`,
              fila: letra,
              numero: 0,
              tipo: 'ESPACIO',
              estado: 'LIBRE',
              precio: 0
            });
          } else {
            bloque.push({
              id: `${letra}-${numActual}`,
              fila: letra,
              numero: numActual,
              tipo: tipo,
              estado: 'LIBRE',
              precio: precio
            });
            numActual++;
          }
        }
        return bloque;
      };

      mapa.push({
        letra,
        bloqueIzq: armarBloque(4, 1),
        bloqueCen: armarBloque(20, 2),
        bloqueDer: armarBloque(4, 3)
      });
    });

    this.filasCine.set(mapa);
  }

  toggleButaca(butaca: Butaca) {
    if (butaca.tipo === 'ESPACIO' || butaca.estado === 'OCUPADA') return;

    if (butaca.estado === 'LIBRE') {
      butaca.estado = 'SELECCIONADA';
      this.butacasSeleccionadas.update(b => [...b, butaca]);
    } else {
      butaca.estado = 'LIBRE';
      this.butacasSeleccionadas.update(b => b.filter(item => item.id !== butaca.id));
    }
  }
}