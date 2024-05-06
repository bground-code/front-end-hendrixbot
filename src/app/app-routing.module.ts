import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario/cadastro-usuario.component';
import { IntentsComponent } from './components/intents/intents.component';
import { StoryComponent } from './components/story/story.component';
import { NluComponent } from './components/nlu/nlu.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'intents', component: IntentsComponent },
  { path: 'historia', component: StoryComponent },
  { path: 'nlu', component: NluComponent },
  { path: 'chat', component: ChatComponent },

  {
    path: '',
    component: HomeComponent,
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
