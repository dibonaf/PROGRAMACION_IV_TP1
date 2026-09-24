import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CandyService } from '../../core/services/candy.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoCandyModel } from '../../core/models/producto-candy.model';


@Component({
  selector: 'app-candy',
  styleUrl: './candy.css',
  templateUrl: './candy.html',
})
export class Candy implements OnInit{
  private candyService = inject(CandyService);
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  
  productos = this.candyService.productos;
  loading = this.candyService.loading;
  itemsEnCarrito= this.carritoService.itemsCandy;

  ngOnInit() {
    this.candyService.loadProductos();    
  }

  agregar(producto: ProductoCandyModel) {
    this.carritoService.agregarProducto(producto);
  }

  getCantidad(productoId: number): number {
    return this.carritoService.obtenerCantidad(productoId);
  }

  irAlPago() {
    this.router.navigate(['/checkout']);
  }

  limpiarCandy() {
    this.carritoService.vaciarCandy();
  }

  tieneEntradas = computed(() => this.carritoService.butacasSeleccionadas().length > 0);
}
