import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario/cadastro-usuario.component';
import { IntentsComponent } from './components/intents/intents.component';


const routes: Routes = [
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'intents', component: IntentsComponent },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
