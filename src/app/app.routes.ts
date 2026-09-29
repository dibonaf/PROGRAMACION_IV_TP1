import { RouterOutlet, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Detalle } from './features/detalle/detalle';
import { Cartelera } from './features/cartelera/cartelera';
import { Candy } from './features/candy/candy';
import { Reserva } from './features/reserva/reserva';
import { Checkout } from './features/checkout/checkout';
import { Horarios } from './features/horarios/horarios';
import { Login } from './features/login/login';
import { roleGuard } from './core/guards/role.guard';
import { adminGuard } from './core/guards/admin-guard';
import { ValidacionQr } from './features/validacion-qr/validacion-qr';
import { MisEntradas } from './features/mis-entradas/mis-entradas';
import { Preventas } from './features/preventas/preventas';




export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cartelera', component: Cartelera},
    { path: 'pelicula/:id', component: Detalle},
    { path: 'candy', component: Candy},
    { path: 'reserva/:id', component: Reserva},
    { path: 'checkout', component: Checkout},
    { path: 'horarios/:id', component: Horarios},
    { path: 'login', component: Login},
    { path: 'validacion-qr', component: ValidacionQr, canActivate: [roleGuard] },
    { path: 'admin-panel', loadComponent: () => import('./features/admin-panel/admin-panel').then(m => m.AdminPanel), canActivate: [adminGuard] },
    { path: 'mis-entradas', component: MisEntradas },
    { path: 'preventas', component: Preventas},
    { path: '**', redirectTo: ''}
];
