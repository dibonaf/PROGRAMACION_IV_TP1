import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeliculasService } from '../../../core/services/peliculas.service';
import { AuthService } from '../../../core/services/auth.service';



@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private peliculasService = inject(PeliculasService);
  private authService = inject(AuthService);

  usuario = this.authService.currentUser;
  perfil = this.authService.perfilUsuario;
  
  onSearch(event:Event) {
    const input = event.target as HTMLInputElement;
    this.peliculasService.searchQuery.set(input.value);
  }

  logout(){
    this.authService.logout();
  }
}
