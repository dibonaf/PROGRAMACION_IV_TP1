import { Component, inject, input, OnInit, numberAttribute, signal } from '@angular/core';
import { PeliculasService } from '../../core/services/peliculas.service';
import { PeliculaModel } from '../../core/models/pelicula.model';
import { RouterLink } from '@angular/router';
import { FuncionesService } from '../../core/services/funciones.service';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase';
import { DatePipe } from '@angular/common';



@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-detalle',
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle implements OnInit {
  id = input.required({ transform: numberAttribute });
  
  private peliculasService = inject(PeliculasService);
  private funcionesService = inject(FuncionesService);
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  
  pelicula = signal<PeliculaModel | null>(null);
  funciones = this.funcionesService.funcionesPelicula;
  loadingFunciones = this.funcionesService.loading;
  resenas = signal<any[]>([]);
  promedio = signal<string>('0.0');
  nuevaEstrellas = signal<number>(5);
  nuevoComentario = signal<string>('');
  enviandoResena = signal(false);

  async ngOnInit() {
    const { data } = await this.peliculasService.client
      .from('peliculas')
      .select('*')
      .eq('id', this.id())
      .single();
      
    if (data) {
      this.pelicula.set(data);
      this.funcionesService.loadFuncionesPorPelicula(this.id());
      this.cargarResenas(data.id);
    }
  }

  async cargarResenas(peliculaId: number) {
    const data = await this.supabaseService.obtenerResenasPelicula(peliculaId);
    this.resenas.set(data.resenas);
    this.promedio.set(String(data.promedio));
  }

  async enviarResena() {
    const email = this.authService.currentUser()?.email;
    
    if (!email) {
      alert('¡Tenés que iniciar sesión con tu cuenta para poder calificar la película!');
      return; 
    }

    if (this.nuevoComentario().trim().length === 0) {
      alert('Por favor, escribí un comentario antes de publicar.');
      return;
    }

    const peliActual = this.pelicula();
    if (!peliActual) return;

    this.enviandoResena.set(true);
    try {
      await this.supabaseService.guardarResena(peliActual.id, email, this.nuevaEstrellas(), this.nuevoComentario());
      
      this.nuevoComentario.set('');
      this.nuevaEstrellas.set(5);
      await this.cargarResenas(peliActual.id);
      
    } catch (error) {
      alert('Hubo un error al guardar tu reseña.');
    } finally {
      this.enviandoResena.set(false);
    }
  }
}
