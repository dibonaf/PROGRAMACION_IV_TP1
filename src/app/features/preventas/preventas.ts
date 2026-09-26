import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

@Component({
  selector: 'app-preventas',
  imports: [RouterLink],
  templateUrl: './preventas.html',
  styleUrl: './preventas.css'
})
export class Preventas implements OnInit {
  private supabaseService = inject(SupabaseService);
  
  preventas = signal<any[]>([]);
  cargando = signal(true);

  async ngOnInit() {
    await this.cargarPreventas();
  }

  async cargarPreventas() {
    try {
      const data = await this.supabaseService.getPreventas();
      this.preventas.set(data || []);
    } catch (error) {
      console.error('Error al cargar preventas:', error);
    } finally {
      this.cargando.set(false);
    }
  }
}