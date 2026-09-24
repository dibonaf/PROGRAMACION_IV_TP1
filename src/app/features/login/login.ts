import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { form, required, email, minLength, FormRoot, FormField } from '@angular/forms/signals';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  modoRegistro = signal(false);
  procesando = signal(false);
  mensajeError = signal('');

  draftLogin = signal({ email: '', password: '' });
  
  loginForm = form(this.draftLogin, f => [
    required(f.email, { message: 'El email es obligatorio' }),
    email(f.email, { message: 'Formato inválido' }),
    required(f.password, { message: 'La contraseña es obligatoria' })
  ]);

  draftRegistro = signal({
    email: '', password: '', nombre: '', apellido: '',
    fecha_nacimiento: '', tipo_sangre: '', color_ojos: '', dias_vacaciones: 0
  });
  
  registroForm = form(this.draftRegistro, f => [
    required(f.email, { message: 'El email es obligatorio' }),
    email(f.email, { message: 'Formato inválido' }),
    required(f.password, { message: 'Obligatoria' }),
    minLength(f.password, 6, { message: 'Mínimo 6 caracteres' }),
    required(f.nombre, { message: 'Requerido' }),
    required(f.apellido, { message: 'Requerido' }),
    required(f.fecha_nacimiento, { message: 'Requerida' })
  ]);

  toggleModo() {
    this.modoRegistro.update(v => !v);
    this.mensajeError.set('');
  }

  async ejecutarAccion(event: Event) {
    event.preventDefault();
    this.procesando.set(true);
    this.mensajeError.set('');
    
    try {
      if (this.modoRegistro()) {
        const data = this.draftRegistro();
        await this.authService.registrarUsuario(data.email, data.password, data);
      } else {
        const data = this.draftLogin();
        await this.authService.iniciarSesionConEmail(data.email, data.password);
      }
      this.router.navigate(['/']);
    } catch (error: any) {
      this.mensajeError.set(error.message || 'Ocurrió un error con la autenticación.');
    } finally {
      this.procesando.set(false);
    }
  }

  async loginGitHub() {
    await this.authService.loginConGitHub();
  }
}