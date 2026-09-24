import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { ProductoCandyModel } from '../models/producto-candy.model';

@Injectable({
  providedIn: 'root'
})
export class CandyService {
  private supabase = inject(SupabaseService);
  
  productos = signal<ProductoCandyModel[]>([]);
  loading = signal<boolean>(false);

  async loadProductos() {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('productos_candy')
      .select('*');
      
    if (error) {
      console.error('Error cargando candy bar:', error.message);
    } else if (data) {
      this.productos.set(data);
    }
    this.loading.set(false);
  }
}