import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { FuncionModel } from '../models/funcion.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  private supabase = inject(SupabaseService);
  
  funcionesPelicula = signal<FuncionModel[]>([]);
  loading = signal<boolean>(false);

  async loadFuncionesPorPelicula(peliculaId: number) {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('funciones')
      .select('*')
      .eq('pelicula_id', peliculaId)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
      
    if (error) {
      console.error('Error cargando funciones:', error.message);
    } else if (data) {
      this.funcionesPelicula.set(data);
    }
    this.loading.set(false);
  }
}