import { Component, OnInit, OnDestroy, signal, inject, input, numberAttribute } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { SupabaseService } from '../../core/services/supabase';

type TipoButaca = 'ESTANDAR' | 'ACCESIBLE' | 'VIP' | 'ESPACIO';
type EstadoButaca = 'LIBRE' | 'OCUPADA' | 'SELECCIONADA';

export interface Butaca {
  id: string;
  fila: string;
  numero: number;
  tipo: TipoButaca;
  estado: EstadoButaca;
  precio: number;
  bloque: number;
}

export interface FilaCine {
  letra: string;
  butacas: Butaca[];  
}

@Component({
  selector: 'app-reserva',
  imports: [LowerCasePipe],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css'
})
export class Reserva implements OnInit, OnDestroy {

  id = input.required({ transform : numberAttribute});

  private carritoService = inject(CarritoService);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);

  filasCine = signal<FilaCine[]>([]);
  butacasSeleccionadas = signal<Butaca[]>([]);

  precioBase = 3500;
  precioVip = 5500;
  
  private realtimeChannel: any;

  async ngOnInit() {
    this.generarMapaButacas();
    await this.cargarButacasOcupadas();
    this.activarTiempoReal();
  }

  ngOnDestroy() {
    if (this.realtimeChannel) {
      this.supabaseService.removerCanal(this.realtimeChannel);
    }
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
              precio: 0,
              bloque: bloqueIdx
            });
          } else {
            bloque.push({
              id: `${letra}-${numActual}`,
              fila: letra,
              numero: numActual,
              tipo: tipo,
              estado: 'LIBRE',
              precio: precio,
              bloque: bloqueIdx
            });
            numActual++;
          }
        }
        return bloque;
      };

      mapa.push({
        letra,
        butacas: [
          ...armarBloque(4, 0),
          ...armarBloque(20, 1),
          ...armarBloque(4, 2)
        ]
      });
    });

    this.filasCine.set(mapa);
  }

  private async cargarButacasOcupadas() {
    const funcionId = this.carritoService.funcionId(); 
    if (!funcionId) return;

    const ventas = await this.supabaseService.getButacasOcupadas(funcionId);
    
    const idsOcupados = new Set<string>();
    ventas.forEach((venta: any) => {
      venta.detalle_butacas.forEach((b: any) => idsOcupados.add(b.id));
    });

    this.filasCine.update(filas => {
      return filas.map(fila => ({
        ...fila,
        butacas: fila.butacas.map(butaca => ({
          ...butaca,
          estado: idsOcupados.has(butaca.id) ? 'OCUPADA' : butaca.estado
        }))
      }));
    });
  }

  private activarTiempoReal() {
    const funcionId = this.carritoService.funcionId();
    if (!funcionId) return;

    this.realtimeChannel = this.supabaseService.escucharVentasEnVivo((payload) => {
      if (payload.new.funcion_id === funcionId) {
        const nuevasButacas = payload.new.detalle_butacas;
        const idsNuevos = new Set(nuevasButacas.map((b: any) => b.id));

        this.filasCine.update(filas => {
          return filas.map(fila => ({
            ...fila,
            butacas: fila.butacas.map(butaca => ({
              ...butaca,
              estado: idsNuevos.has(butaca.id) ? 'OCUPADA' : butaca.estado
            }))
          }));
        });
      }
    });
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

  estaSeleccionada(id: string): boolean {
    return this.butacasSeleccionadas().some(b => b.id === id);
  }

  continuarCompra() {
    this.carritoService.guardasReservaButacas(this.butacasSeleccionadas(), this.id());
    this.router.navigate(['/candy']);
  }
}