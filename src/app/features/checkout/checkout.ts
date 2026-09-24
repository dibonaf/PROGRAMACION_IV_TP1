import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { SupabaseService } from '../../core/services/supabase';



@Component({
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  private supabaseService = inject (SupabaseService);

  butacas = this.carritoService.butacasSeleccionadas;
  candy = this.carritoService.itemsCandy;
  compraFinalizada = signal(false);
  procesandoPago = signal(false);



  subtotalButacas = computed(() =>
  this.butacas().reduce((total, b) => total + b.precio, 0)
  );

  subtotalCandy = computed(() => 
    this.candy().reduce((total, item) => total + (item.producto.precio * item.cantidad), 0)
  );

  subtotal = computed(() => this.subtotalButacas() + this.subtotalCandy());

  cuponAplicado = signal(false);

  totalFinal = computed(() => {
    const total = this.subtotal();
    return this.cuponAplicado() ? total * 0.8 : total;
  });

  
  aplicarCupon(codigo: string) {
    if (codigo.toUpperCase() === 'UTN2026') {
      this.cuponAplicado.set(true);
    } else {
      alert('Cupón inválido. Pista: probá con UTNxxx');
    }
  }

  async finalizarCompra() {
    this.procesandoPago.set(true);

    try {
      const nuevaVenta = {
        funcion_id: this.carritoService.funcionId(),
        email_cliente: 'prueba1234@gmail.com', // Dato temporal hasta que conectes el Auth real
        total: this.totalFinal(),
        detalle_butacas: this.butacas(), 
        detalle_candy: this.candy(),
        estado_qr: 'valido'
      };

      await this.supabaseService.registrarVenta(nuevaVenta);
      this.compraFinalizada.set(true);
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el pago. Por favor, intentá de nuevo.');
    } finally {
      this.procesandoPago.set(false);
    }
  }

  volverAlInicio() {
    this.carritoService.vaciarCarritoCompleto();
    this.router.navigate(['/']);
  }

  simularPago() {
    this.procesandoPago.set(true);

    setTimeout(async () => {
      await this.finalizarCompra();
    }, 2000);
  }
}