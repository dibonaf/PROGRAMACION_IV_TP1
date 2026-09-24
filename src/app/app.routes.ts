import { RouterOutlet, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Detalle } from './features/detalle/detalle';
import { Cartelera } from './features/cartelera/cartelera';
import { Candy } from './features/candy/candy';
import { Reserva } from './features/reserva/reserva';
<<<<<<< HEAD
import { Checkout } from './features/checkout/checkout';
import { Horarios } from './features/horarios/horarios';
import { Login } from './features/login/login';
import { roleGuard } from './core/guards/role.guard';
import { ValidacionQr } from './features/validacion-qr/validacion-qr';


=======
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932



export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cartelera', component: Cartelera},
    { path: 'pelicula/:id', component: Detalle},
    { path: 'candy', component: Candy},
    { path: 'reserva/:id', component: Reserva},
<<<<<<< HEAD
    { path: 'checkout', component: Checkout},
    { path: 'horarios/:id', component: Horarios},
    { path: 'login', component: Login},
    { path: 'validacion-qr', component: ValidacionQr, canActivate: [roleGuard] },
=======
>>>>>>> dd353f88c2568e632f65da6739f2cef512c25932
    { path: '**', redirectTo: ''}
];
