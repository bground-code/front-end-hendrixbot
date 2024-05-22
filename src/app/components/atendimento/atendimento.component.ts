import { Component, OnInit } from '@angular/core';
import { AtendimentoWebSocketService, MessageDTO } from '../../client/atendimentowebsocketservice';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.scss']
})
export class AtendimentoComponent implements OnInit {
  activeSessions: string[] = [];
  messages: MessageDTO[] = [];
  currentMessage: string = '';
  sessionId: string | undefined;
  humanAssumed: boolean = false;

  constructor(private atendimentoService: AtendimentoWebSocketService) {}

  ngOnInit(): void {
    this.subscribeToActiveSessions();
    this.subscribeToMessages();

    const savedMessages = localStorage.getItem('atendimentoMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }

    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      this.sessionId = savedSessionId;
    }
  }

  subscribeToActiveSessions(): void {
    this.atendimentoService.getActiveSessions$().subscribe(sessions => {
      this.activeSessions = sessions;
    });
  }

  assumeConversation(sessionId: string | undefined): void {
    if (sessionId) {
      this.sessionId = sessionId;
      this.humanAssumed = true;
      this.atendimentoService.assumeConversation(sessionId);
      this.messages = [];
      this.subscribeToMessages();
      this.atendimentoService.sendMessage("Você está sendo redirecionado para um atendimento humano.", sessionId);
      localStorage.setItem('sessionId', sessionId);
    } else {
      console.error('sessionId is undefined');
    }
  }

  sendMessage(): void {
    if (this.currentMessage.trim() && this.sessionId) {
      const message: MessageDTO = { text: this.currentMessage, type: 'sent', sender: 'atendente', sessionId: this.sessionId };
      this.atendimentoService.sendMessage(this.currentMessage, this.sessionId);
      this.messages.push(message);
      this.currentMessage = '';
      localStorage.setItem('atendimentoMessages', JSON.stringify(this.messages));
    }
  }

  private subscribeToMessages(): void {
    this.atendimentoService.getMessages$().subscribe(message => {
      if (this.sessionId && message.sessionId === this.sessionId && message.text) {
        if (message.sender !== 'atendente') {
          this.messages.push(message);
          localStorage.setItem('atendimentoMessages', JSON.stringify(this.messages));
        }
      }
    });
  }
}
