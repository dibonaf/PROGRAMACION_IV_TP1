import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mis-entradas',
  imports: [RouterLink, DatePipe],
  templateUrl: './mis-entradas.html',
  styleUrl: './mis-entradas.css'
})
export class MisEntradas {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  entradas = signal<any[]>([]);
  cargando = signal(true);

  constructor() {
    effect(() => {
      const usuario = this.authService.currentUser();
      if (usuario?.email) {
        this.cargarHistorial(usuario.email);
      } else {
        this.cargando.set(false);
      }
    });
  }
  

  async cargarHistorial(email: string) {
    this.cargando.set(true);
    try {
      console.log('1. Buscando entradas en la DB para el email:', email);
      const data = await this.supabaseService.obtenerMisEntradas(email);
      console.log('2. Respuesta de Supabase:', data);
      
      this.entradas.set(data || []);
    } catch (error) {
      console.error('Error al conectar con Supabase:', error);
    } finally {
      this.cargando.set(false);
    }
  }
}