import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  currentUser = signal<User | null>(null);
<<<<<<< HEAD
  perfilUsuario = signal<any | null>(null); 
=======
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
<<<<<<< HEAD
    this.inicializarSesion();
  }

  private async inicializarSesion() {
    const { data } = await this.supabase.auth.getSession();
    this.currentUser.set(data.session?.user ?? null);
    
    if (data.session?.user) {
      await this.cargarPerfil(data.session.user.id);
    }

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentUser.set(session?.user ?? null);
      if (session?.user) {
        await this.cargarPerfil(session.user.id);
      } else {
        this.perfilUsuario.set(null);
      }
    });
  }

  private async cargarPerfil(userId: string) {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.perfilUsuario.set(data);
    }
  }

  async registrarUsuario(email: string, pass: string, datosExtra: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: pass
    });

    if (error) throw error;

    if (data.user) {
      const { error: dbError } = await this.supabase
        .from('perfiles')
        .insert({
          id: data.user.id,
          email: email,
          nombre: datosExtra.nombre,
          apellido: datosExtra.apellido,
          fecha_nacimiento: datosExtra.fecha_nacimiento,
          tipo_sangre: datosExtra.tipo_sangre,
          color_ojos: datosExtra.color_ojos,
          dias_vacaciones: datosExtra.dias_vacaciones,
          rol: 'cliente'
        });

      if (dbError) throw dbError;
    }
  }

  async iniciarSesionConEmail(email: string, pass: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
  }


=======
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932
  async loginConGitHub() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github'
    });
    if (error) console.error('Error en login:', error.message);
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) console.error('Error al cerrar sesión:', error.message);
  }
}