import { Component, OnInit } from '@angular/core';
import { HistoricoService } from '../../client/historico.service';
import { Router } from '@angular/router';

// Definição da interface para refletir os dados recebidos
interface Conversa {
  sessionId: string;
  creationTime: string;
}

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss']
})
export class HistoricoComponent implements OnInit {
  conversas: Conversa[] = [];

  constructor(private historicoService: HistoricoService, private router: Router) { }

  ngOnInit(): void {
    this.historicoService.getHistoricoConversas().subscribe((res: any[]) => {
      this.conversas = res.map(conversa => ({
        sessionId: conversa.sessionId,
        creationTime: conversa.creationTime ? new Date(conversa.creationTime).toLocaleString('pt-BR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        }) : 'Data não disponível'
      }));
    });
  }

  verConversa(sessionId: string) {
    this.router.navigate(['/visualizar-conversa', sessionId]);
  }
}
