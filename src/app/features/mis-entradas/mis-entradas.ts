import { Component, inject, OnInit, signal } from '@angular/core';
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
export class MisEntradas implements OnInit {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  entradas = signal<any[]>([]);
  cargando = signal(true);

  async ngOnInit() {
    const usuario = this.authService.currentUser();
    
    if (usuario?.email) {
      try {
        const data = await this.supabaseService.obtenerMisEntradas(usuario.id);
        this.entradas.set(data || []);
      } catch (error) {
        console.error('Error cargando historial:', error);
      } finally {
        this.cargando.set(false);
      }
    } else {
      this.cargando.set(false);
    }
  }
}