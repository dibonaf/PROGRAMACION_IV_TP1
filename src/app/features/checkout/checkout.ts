import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { SupabaseService } from '../../core/services/supabase';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  private carritoService = inject(CarritoService);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  butacas = this.carritoService.butacasSeleccionadas;
  candy = this.carritoService.itemsCandy;
  compraFinalizada = signal(false);
  procesandoPago = signal(false);
  
  usuarioActual = computed(() => this.authService.currentUser());
  perfilUsuario = this.authService.perfilUsuario;
  emailAnonimo = signal('');
  
  puntosUsuario = computed(() => this.perfilUsuario()?.puntos || 0);
  
  puntosAplicados = signal<number>(0);

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
    const totalConCupon = this.cuponAplicado() ? total * 0.8 : total;
    return Math.max(0, totalConCupon - this.puntosAplicados()); // Math.max evita que el total quede negativo
  });
  
  aplicarCupon(codigo: string) {
    if (codigo.toUpperCase() === 'UTN2026') {
      this.cuponAplicado.set(true);
    } else {
      alert('Cupón inválido. Pista: probá con UTNxxx');
    }
  }

  usarPuntos() {
    const disponibles = this.puntosUsuario();
    const costoActual = this.totalFinal() + this.puntosAplicados(); 
    const aDescontar = Math.min(disponibles, costoActual);
    this.puntosAplicados.set(aDescontar);
  }

  quitarPuntos() {
    this.puntosAplicados.set(0);
  }

  async finalizarCompra() {
    this.procesandoPago.set(true);
    const emailComprador = this.usuarioActual()?.email || this.emailAnonimo();

    if (!emailComprador) {
      alert('Por favor, ingresá un correo electrónico.');
      this.procesandoPago.set(false);
      return;
    }

    try {
      const nuevaVenta = {
        funcion_id: this.carritoService.funcionId(),
        email_cliente: emailComprador,
        total: this.totalFinal(),
        detalle_butacas: this.butacas(), 
        detalle_candy: this.candy(),
        estado_qr: 'valido'
      };

      await this.supabaseService.registrarVenta(nuevaVenta);
      
      const emailLogueado = this.usuarioActual()?.email;
      if (emailLogueado) {
        try {
          const puntosActuales = await this.supabaseService.obtenerPuntosUsuario(emailLogueado);
          const saldoTrasDescuento = puntosActuales - this.puntosAplicados();
          const nuevoSaldoFinal = saldoTrasDescuento + this.totalFinal();
          
          await this.supabaseService.actualizarPuntosUsuario(emailLogueado, nuevoSaldoFinal);
        } catch (error) {
          console.error('Falló la suma de puntos', error);
        }
      }

      this.compraFinalizada.set(true);
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el pago.');
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
    setTimeout(async () => { await this.finalizarCompra(); }, 2000);
  }
}