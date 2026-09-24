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
<<<<<<< HEAD
  perfil = this.authService.perfilUsuario;
  
=======

>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932
  onSearch(event:Event) {
    const input = event.target as HTMLInputElement;
    this.peliculasService.searchQuery.set(input.value);
  }

<<<<<<< HEAD
=======
  login(){
    this.authService.loginConGitHub();
  }

>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932
  logout(){
    this.authService.logout();
  }
}
