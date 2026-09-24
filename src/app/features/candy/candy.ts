<<<<<<< HEAD
import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CandyService } from '../../core/services/candy.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoCandyModel } from '../../core/models/producto-candy.model';
=======
import { Component, inject, OnInit } from '@angular/core';
import { CandyService } from '../../core/services/candy.service';
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932


@Component({
  selector: 'app-candy',
  styleUrl: './candy.css',
  templateUrl: './candy.html',
})
export class Candy implements OnInit{
  private candyService = inject(CandyService);
<<<<<<< HEAD
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  
  productos = this.candyService.productos;
  loading = this.candyService.loading;
  itemsEnCarrito= this.carritoService.itemsCandy;
=======
  
  productos = this.candyService.productos;
  loading = this.candyService.loading;
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932

  ngOnInit() {
    this.candyService.loadProductos();    
  }
<<<<<<< HEAD

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
=======
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932
}
