import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../../environments/environment";
import { single } from "rxjs";

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

    async obtenerMisEntradas(email: string) {
        const { data: ventas, error: ventasError } = await this.supabase
            .from('ventas')
            .select('*')
            .eq('email_cliente', email)
            .order('created_at', { ascending: false });

        if (ventasError || !ventas) {
            console.error('Error cargando las ventas base:', ventasError);
            return [];
        }

        const entradasCompletas = await Promise.all(ventas.map(async (venta) => {
            let datosFuncion = null;
            let datosPelicula = null;

            if (venta.funcion_id) {
                const { data: funcion } = await this.supabase
                    .from('funciones')
                    .select('*')
                    .eq('id', venta.funcion_id)
                    .single();
                
                datosFuncion = funcion;

                if (funcion && funcion.pelicula_id) {
                    const { data: pelicula } = await this.supabase
                        .from('peliculas')
                        .select('*')
                        .eq('id', funcion.pelicula_id)
                        .single();
                        
                    datosPelicula = pelicula;
                }
            }

            return {
                ...venta,
                funciones: {
                    fecha: datosFuncion?.fecha,
                    peliculas: datosPelicula
                }
            };
        }));

        return entradasCompletas;
    }

   async getPreventas() {
        const { data: peliculas, error } = await this.supabase
            .from('peliculas')
            .select('*');

        if (error) {
            console.error('Error cargando películas:', error);
            return [];
        }

        const hoy = new Date();
        const limite = new Date();
        limite.setDate(hoy.getDate() + 7);

        const hoyStr = hoy.toISOString().split('T')[0];
        const limiteStr = limite.toISOString().split('T')[0];

        const preventasActivas = peliculas.filter(pelicula => {
            if (!pelicula.fecha_estreno) return false;
            
            return pelicula.fecha_estreno > hoyStr && pelicula.fecha_estreno <= limiteStr;
        });

        return preventasActivas;
    }

    async obtenerTop3Peliculas() {
      const { data: peliculas } = await this.supabase.from('peliculas').select('*');
      const { data: funciones } = await this.supabase.from('funciones').select('id, pelicula_id');
      const { data: ventas, error: ventasError } = await this.supabase.from('ventas').select('funcion_id, detalle_butacas');

      if (ventasError) {
         console.error('❌ Supabase bloqueó la lectura de ventas:', ventasError);
      }
      
      console.log('✅ Cantidad de ventas recuperadas:', ventas?.length || 0);

      if (!peliculas || !funciones || !ventas) {
          return peliculas?.slice(0, 3) || [];
      }

      const ventasPorPelicula: { [peliculaId: number]: number } = {};

      ventas.forEach(venta => {
        const funcion = funciones.find(f => f.id === venta.funcion_id);
        if (funcion) {
          const cantidadEntradas = venta.detalle_butacas ? venta.detalle_butacas.length : 0;
          ventasPorPelicula[funcion.pelicula_id] = (ventasPorPelicula[funcion.pelicula_id] || 0) + cantidadEntradas;
        }
      });

      console.log('📊 Entradas vendidas por Película ID:', ventasPorPelicula);

      const top3 = [...peliculas]
        .sort((a, b) => (ventasPorPelicula[b.id] || 0) - (ventasPorPelicula[a.id] || 0))
        .slice(0, 3); 

      return top3;
    }

    async obtenerResenasPelicula(peliculaId: number) {
        const { data, error} = await this.supabase
        .from('resenas')
        .select('*')
        .eq('pelicula_id', peliculaId)
        .order('created_at', { ascending: false});

        if (error) {
            console.error('Error al obtener reseñas;', error);
            return { resenas: [], promedio: 0};            
        }

        const resenas = data || [];
        let promedio = 0;

        if (resenas.length > 0 ) {
            const suma = resenas.reduce((acc, curr) => acc + curr.estrellas, 0);
            promedio = suma / resenas.length;
        }

        return { resenas, promedio: promedio.toFixed(1) };
    }

    async guardarResena(peliculaId: number, email: string, estrellas: number, comentario: string) {
      const { error } = await this.supabase
        .from('resenas')
        .insert([
          { 
            pelicula_id: peliculaId, 
            email_usuario: email, 
            estrellas: estrellas, 
            comentario: comentario 
          }
        ]);

      if (error) {
        console.error('Error al guardar la reseña:', error);
        throw error;
      }
    }

    async obtenerPuntosUsuario(email: string) {
        const { data, error } = await this.supabase
        .from('perfiles')
        .select('puntos')
        .eq('email', email)
        single();

        if (error) {
            console.error('Error al leer puntos:', error);
            return 0;            
        }
        return (data as any)?.puntos || 0;
    }

    async actualizarPuntosUsuario(email: string, saldoActualizado: number) {
    const { error } = await this.supabase
      .from('perfiles')
      .update({ puntos: saldoActualizado })
      .eq('email', email);

    if (error) {
      console.error('Error al actualizar puntos:', error);
      throw error;
    }
  }
}