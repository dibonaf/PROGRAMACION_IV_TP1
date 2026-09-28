import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculasService } from '../../../core/services/peliculas.service';
import { AuthService } from '../../../core/services/auth.service';
import { SupabaseService } from '../../../core/services/supabase';



@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private peliculasService = inject(PeliculasService);
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);

  usuario = this.authService.currentUser;
  perfil = this.authService.perfilUsuario;
  puntos = signal<number>(0);

  constructor() {
    effect(() => {
      const user = this.usuario();
      if (user?.email) {
        this.supabaseService.obtenerPuntosUsuario(user.email).then(pts => {
          this.puntos.set(pts);
        });
      } else {
        this.puntos.set(0);
      }
    });
  }
  
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.peliculasService.searchQuery.set(input.value);
  }

  logout(){
    this.authService.logout();
  }

}
