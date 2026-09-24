import { Injectable, signal,inject } from "@angular/core";
import { SupabaseService } from "./supabase";
import { PeliculaModel } from "../models/pelicula.model";

@Injectable({
    providedIn: 'root'
})
export class PeliculasService {
    private supabase= inject(SupabaseService).client;

    private _peliculas = signal<PeliculaModel[]>([]);
    private _loading = signal<boolean>(false);

    searchQuery = signal<string>('');
    peliculas = this._peliculas.asReadonly();
    loading = this._loading.asReadonly();

    async loadPeliculas() {
        this._loading.set(true);

        const {data, error } = await this.supabase
        .from('peliculas')
        .select('*');

        console.log('Respuesta Supabase', data, error);

        if (error) {
            console.error('Error cargando películas:', error);
        } else if (data) {
            this._peliculas.set(data);
        }

        this._loading.set(false);        
    }

    get client() {
        return this.supabase;
    }
}