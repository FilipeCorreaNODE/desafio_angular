import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { ContatoslistComponent } from './components/contatos/contatoslist/contatoslist.component';
import { ContatosdetailsComponent } from './components/contatos/contatosdetails/contatosdetails.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: 'full'},
  {path: "login", component: LoginComponent},

  {path: "admin",
    component: PrincipalComponent,
    canActivate: [authGuard],
    children: [
    {path: "contatos", component: ContatoslistComponent },
    {path: "contatos/new", component: ContatosdetailsComponent },
    {path: "contatos/edit/:id", component: ContatosdetailsComponent },
  ]}
];
