import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-validacion-qr',
  templateUrl: './validacion-qr.html',
  styleUrl: './validacion-qr.css'
})
export class ValidacionQr {
  private supabaseService = inject(SupabaseService);

  codigoEntrada = signal('');
  procesando = signal(false);
  mensaje = signal<{ texto: string, tipo: 'exito' | 'error' | null }>({ texto: '', tipo: null });

  onInputCodigo(event: Event) {
    const input = event.target as HTMLInputElement;
    this.codigoEntrada.set(input.value);
  }

  async verificarEntrada(event: Event) {
    event.preventDefault();
    if (!this.codigoEntrada().trim()) return;

    this.procesando.set(true);
    this.mensaje.set({ texto: '', tipo: null });

    try {
      await this.supabaseService.validarEntrada(this.codigoEntrada());
      this.mensaje.set({ 
        texto: '¡Entrada validada con éxito! El cliente puede ingresar.', 
        tipo: 'exito' 
      });
      this.codigoEntrada.set('');
    } catch (error: any) {
      this.mensaje.set({ texto: error.message, tipo: 'error' });
    } finally {
      this.procesando.set(false);
    }
  }
}