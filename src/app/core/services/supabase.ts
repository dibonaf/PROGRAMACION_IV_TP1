import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get client(): SupabaseClient {
        return this.supabase;
    }

    async getFuncionesPorPelicula(peliculaId: number) {
        const { data, error } = await this.supabase
        .from('funciones')
        .select('*')
        .eq('pelicula_id', peliculaId)
        .order('fecha', { ascending: true})
        .order('hora', { ascending: true });

        if(error) {
            console.error('Error al traer las funciones:', error);
            return [];
        }
        return data;
    }

    async registrarVenta(datosVenta: any){
        const { data, error } = await this.supabase
        .from('ventas')
        .insert(datosVenta)
        .select();

        if (error) {
            console.error('Error al registrar la venta:', error);
            throw error;
        }
        
        return data;
    }

    async getButacasOcupadas(funcionId: number) {
        const { data, error } = await this.supabase
        .from('ventas')
        .select('detalle_butacas')
        .eq('funcion_id', funcionId);

        if (error) {
            console.error('Error al traer butacas ocupadas:', error);
            return [];
        }
        return data;
    }


    escucharVentasEnVivo(callback: (payload: any) => void) {
        return this.supabase
            .channel('cambios-ventas')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ventas' },
                (payload) => callback(payload)
            )
            .subscribe();
    }

    removerCanal(canal: any) {
        this.supabase.removeChannel(canal);
    }

    async validarEntrada(codigoReserva: string){
        const { data: reserva, error: searchError } = await this.supabase
        .from('ventas')
        .select('*')
        .eq('id', codigoReserva)
        .single();

        if (searchError || !reserva){
            throw new Error('No se encontró ninguna reserva con ese codigo.');
        }
        if (reserva.estado === 'UTILIZADA') {
            throw new Error('Esta entrada YA FUE UTILIZADA previamente.');
        }

        const { data, error: updateError } = await this.supabase
        .from('ventas')
        .update({ estado : 'UTILIZADA' })
        .eq('id', codigoReserva)
        .select();

        if (updateError) {
            throw new Error('Error al actualizar el estado de la entrada');
        }
        return data;
    }

    async obtenerMisEntradas(usuarioEmail: string) {
        const { data, error } = await this.supabase
        .from('ventas')
        .select('*')
        .eq('email_cliente', usuarioEmail)
        .order('created_qr', { ascending: false });

        if (error) {
            throw new Error('Error al cargar el historial de entradas.');
        }
        return data;
    }
}