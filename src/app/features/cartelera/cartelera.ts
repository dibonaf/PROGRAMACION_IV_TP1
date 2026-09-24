import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculasService } from '../../core/services/peliculas.service';

@Component({
  selector: 'app-cartelera',
  imports: [RouterLink],
  templateUrl: './cartelera.html',
  styleUrl: './cartelera.css'
})
export class Cartelera implements OnInit {
  private peliculasService = inject(PeliculasService);
  
  peliculas = this.peliculasService.peliculas;
  searchQuery = this.peliculasService.searchQuery;
  loading = this.peliculasService.loading;
  
  peliculasFiltradas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.peliculas();

    return this.peliculas().filter(p => 
      p.titulo.toLowerCase().includes(query) || 
      p.generos.some(g => g.toLowerCase().includes(query))
    );
  });

  ngOnInit() {
    this.peliculasService.loadPeliculas();
  }
}