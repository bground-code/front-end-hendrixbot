import { Component, OnInit } from '@angular/core';
import { HistoricoService } from '../../client/historico.service';
import { Router } from '@angular/router';

// Definição da interface para refletir os dados recebidos
interface Conversa {
  userName: string;
  creationTime: string;
}

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})
export class HistoricoComponent implements OnInit {
  conversas: Conversa[] = [];
  filteredConversas: Conversa[] = [];
  searchTerm: string = '';

  constructor(
    private historicoService: HistoricoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.historicoService.getHistoricoConversas().subscribe((res: any[]) => {
      this.conversas = res.reverse().map((conversa) => {
        return {
          userName: conversa.userName ? conversa.userName : 'Lead',
          creationTime: conversa.creationTime
            ? new Date(conversa.creationTime).toLocaleString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : 'Data não disponível',
        };
      });
      this.filteredConversas = this.conversas;
    });
  }

  filterConversas(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredConversas = this.conversas;
    } else {
      this.filteredConversas = this.conversas.filter((conversa) =>
        conversa.userName.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }
  }

  trackByConversa(index: number, conversa: Conversa): string {
    return conversa.userName; // ou um identificador único
  }

  verConversa(sessionId: string) {
    this.router.navigate(['/visualizar-conversa', sessionId]);
  }
}
