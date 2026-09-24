import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

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