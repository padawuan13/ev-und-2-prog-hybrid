import { Routes } from '@angular/router';
import { InicioPage } from './inicio/inicio.page';
import { GestionCitasPage } from './gestion-citas/gestion-citas.page';
import { ConfiguracionesPage } from './configuraciones/configuraciones.page';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioPage },
  { path: 'gestion-citas', component: GestionCitasPage },
  { path: 'configuraciones', component: ConfiguracionesPage },
];
