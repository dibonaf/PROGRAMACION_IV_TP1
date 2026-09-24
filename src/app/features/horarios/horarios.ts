import { Component, inject, input, numberAttribute, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FuncionesService } from '../../core/services/funciones.service';
import { SupabaseService } from '../../core/services/supabase';


@Component({
  selector: 'app-horarios',
  imports: [RouterLink],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css'
})
export class Horarios implements OnInit {
  id = input.required({ transform: numberAttribute });
  
  private supabaseService = inject(SupabaseService);
  
  funciones = signal<any[]>([]); 
  loading = signal(true);

  async ngOnInit() {
    await this.cargarHorarios();
  }

  private async cargarHorarios() {
    try {
      const data = await this.supabaseService.getFuncionesPorPelicula(this.id());
      this.funciones.set(data);
    } catch (error) {
      console.error('Falló la carga de horarios', error);
    } finally {
      this.loading.set(false);
    }
  }
}