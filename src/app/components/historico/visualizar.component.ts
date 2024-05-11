import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoricoService } from '../../client/historico.service';
import { Subscription } from 'rxjs';

interface Mensagem {
  sessionid: string;
  dataConversa: string;
  message: string;
  tipo: 'USUARIO' | 'HENDRIX';
}


@Component({
  selector: 'app-visualizar-conversa',
  templateUrl: './visualizar-conversa.component.html',
  styleUrls: ['./visualizar-conversa.component.scss']
})
export class VisualizarConversaComponent implements OnInit, OnDestroy {
  sessionId: string | undefined;
  messages: Mensagem[] = [];  // Usando a interface Mensagem
  loading: boolean = true;
  private paramsSubscription?: Subscription;
  private messageSubscription?: Subscription;

  constructor(private historicoService: HistoricoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      if (this.sessionId) {
        this.messageSubscription = this.historicoService.getMensagensPorSessao(this.sessionId).subscribe(
          (res: Mensagem[]) => {
            this.messages = res.map(message => ({
              ...message,
              dataConversa: new Date(message.dataConversa).toLocaleString('pt-BR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
              })
            }));
            this.loading = false;
          },
          (error) => {
            console.error('Erro ao carregar mensagens:', error);
            this.loading = false;
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }

  voltarParaHistorico() {
    this.router.navigate(['/historico']);
  }
}
