import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario/cadastro-usuario.component';
import { IntentsComponent } from './components/intents/intents.component';
import { StoryComponent } from './components/story/story.component';
import { NluComponent } from './components/nlu/nlu.component';
import { ChatComponent } from './components/chat/chat.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { VisualizarConversaComponent } from './components/historico/visualizar.component';
import { AtendimentoComponent } from './components/atendimento/atendimento.component';

const routes: Routes = [
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'intents', component: IntentsComponent },
  { path: 'historia', component: StoryComponent },
  { path: 'nlu', component: NluComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'historico', component: HistoricoComponent },
  {
    path: 'visualizar-conversa/:sessionId',
    component: VisualizarConversaComponent,
  },
  { path: 'atendimento', component: AtendimentoComponent },

  {
    path: '',
    component: ChatComponent,
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
