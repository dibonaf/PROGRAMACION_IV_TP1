import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { PeliculasService } from '../../core/services/peliculas.service';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';



@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private peliculasService = inject(PeliculasService);
  private supabaseService = inject(SupabaseService);

  peliculas = this.peliculasService.peliculas;
  loading = this.peliculasService.loading;
  searchQuery = this.peliculasService.searchQuery;
  top3 = signal<any[]>([]);

  peliculasFiltradas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (query) {
      return this.peliculas().filter(p => 
        p.titulo.toLowerCase().includes(query) || 
        p.generos?.some((g: string) => g.toLowerCase().includes(query))
      );
    }

    return this.top3();
  });

  async ngOnInit() {
    this.peliculasService.loadPeliculas();
    await this.cargarTop3Reales();
  }

  private async cargarTop3Reales() {
    try {
      const topVentas = await this.supabaseService.obtenerTop3Peliculas();
      this.top3.set(topVentas);
    } catch (error) {
      console.error('Error calculando el Top 3 de ventas:', error);
      this.top3.set(this.peliculas().slice(0, 3));
    }
  }
}