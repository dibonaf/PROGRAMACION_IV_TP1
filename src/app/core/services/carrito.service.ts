import { Injectable, signal } from "@angular/core";
import { Butaca } from "../../features/reserva/reserva";
import { ProductoCandyModel } from "../models/producto-candy.model";

export interface ItemCandy {
    producto: ProductoCandyModel;
    cantidad: number;
}

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    butacasSeleccionadas = signal<Butaca[]>([]);
    funcionId = signal<number | null>(null);
    itemsCandy = signal<ItemCandy[]>([]);

    guardasReservaButacas(butacas: Butaca[], idFuncion: number) {
        this.butacasSeleccionadas.set(butacas);
        this.funcionId.set(idFuncion);
    }

    agregarProducto(producto: ProductoCandyModel) {
    this.itemsCandy.update(items => {
      const itemExistente = items.find(item => item.producto.id === producto.id);
      if (itemExistente) {
        return items.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }

  obtenerCantidad (productoId: number): number {
    const item = this.itemsCandy().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  vaciarCandy() {
    this.itemsCandy.set([]);
  }

  vaciarCarritoCompleto() {
    this.butacasSeleccionadas.set([]);
    this.funcionId.set(null);
    this.itemsCandy.set([]);
  }
}