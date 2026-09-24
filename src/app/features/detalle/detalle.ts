import { Component, inject, input, OnInit, numberAttribute, signal } from '@angular/core';
import { PeliculasService } from '../../core/services/peliculas.service';
import { PeliculaModel } from '../../core/models/pelicula.model';
import { RouterLink } from '@angular/router';
import { FuncionesService } from '../../core/services/funciones.service';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle',
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit {
  id = input.required({ transform: numberAttribute });
  
  private peliculasService = inject(PeliculasService);
  private funcionesService = inject(FuncionesService);
  
  pelicula = signal<PeliculaModel | null>(null);
  funciones = this.funcionesService.funcionesPelicula;
  loadingFunciones = this.funcionesService.loading;

  async ngOnInit() {
    const { data } = await this.peliculasService.client
      .from('peliculas')
      .select('*')
      .eq('id', this.id())
      .single();
      
    if (data) {
      this.pelicula.set(data);
      this.funcionesService.loadFuncionesPorPelicula(this.id());
    }
  }
}