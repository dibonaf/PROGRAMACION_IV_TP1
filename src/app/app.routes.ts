import { RouterOutlet, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Detalle } from './features/detalle/detalle';
import { Cartelera } from './features/cartelera/cartelera';
import { Candy } from './features/candy/candy';
import { Reserva } from './features/reserva/reserva';



export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cartelera', component: Cartelera},
    { path: 'pelicula/:id', component: Detalle},
    { path: 'candy', component: Candy},
    { path: 'reserva/:id', component: Reserva},
    { path: '**', redirectTo: ''}
];
