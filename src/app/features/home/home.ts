import { Component, inject, OnInit, computed } from '@angular/core';
import { PeliculasService } from '../../core/services/peliculas.service';
import { RouterLink } from '@angular/router';


@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private peliculasService = inject(PeliculasService);

  peliculas = this.peliculasService.peliculas;
  loading = this.peliculasService.loading;
  searchQuery = this.peliculasService.searchQuery;

 /*peliculasFiltradas = computed(() => {
      const query = this.searchQuery().toLowerCase().trim();
      if (!query) return this.peliculas();

      return this.peliculas().filter(p =>
        p.titulo.toLowerCase().includes(query) || p.generos.some(g => g.toLowerCase().includes(query))
      );
  });*/

  peliculasFiltradas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (query) {
      return this.peliculas().filter(p => 
        p.titulo.toLowerCase().includes(query) || 
        p.generos.some(g => g.toLowerCase().includes(query))
      );
    }

    return this.peliculas().slice(0, 3);
  });

  ngOnInit(){
    this.peliculasService.loadPeliculas();
  }
}
