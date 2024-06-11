import { Component, OnInit } from '@angular/core';
import {
  AtendimentoWebSocketService,
  MessageDTO,
} from '../../client/atendimentowebsocketservice';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ChatService } from 'src/app/client/chat.service';

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [FormsModule, NgForOf, NgClass, NgIf],
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.scss'],
})
export class AtendimentoComponent implements OnInit {
  activeSessions: string[] = [];
  messages: MessageDTO[] = [];
  currentMessage: string = '';
  sessionId: string | undefined;
  atendenteSessionId: string | undefined;
  humanAssumed: boolean = false;
  isServerThinking: any;
  userName: string = '';

  constructor(private atendimentoService: AtendimentoWebSocketService) {}

  ngOnInit(): void {
    this.subscribeToActiveSessions();
    this.subscribeToMessages();
    this.userName = this.atendimentoService.getUserName();

    const savedMessages = localStorage.getItem('atendimentoMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }

    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      this.sessionId = savedSessionId;
    }

    const savedAtendenteSessionId = localStorage.getItem('atendenteSessionId');
    if (savedAtendenteSessionId) {
      this.atendenteSessionId = savedAtendenteSessionId;
    }
  }

  subscribeToActiveSessions(): void {
    this.atendimentoService.getActiveSessions$().subscribe((sessions) => {
      this.activeSessions = sessions;
    });
  }

  assumeConversation(sessionId: string | undefined): void {
    if (sessionId) {
      this.sessionId = sessionId;
      this.humanAssumed = true;
      localStorage.setItem('atendenteSessionId', sessionId);
      this.atendenteSessionId = sessionId;
      this.atendimentoService.assumeConversation(sessionId);
      this.messages = [];
      this.subscribeToMessages();
      this.atendimentoService.sendMessage(
        'Você está sendo redirecionado para um atendimento humano.',
        sessionId,
      );
      localStorage.setItem('sessionId', sessionId);
    } else {
      console.error('sessionId is undefined');
    }
  }

  sendMessage(): void {
    if (this.currentMessage.trim() && this.sessionId) {
      const message: MessageDTO = {
        text: this.currentMessage,
        type: 'sent',
        sender: 'atendente',
        sessionId: this.sessionId,
        atendenteSessionId: this.atendenteSessionId,
      };
      this.atendimentoService.sendMessage(this.currentMessage, this.sessionId);
      this.messages.push(message);
      this.currentMessage = '';
      localStorage.setItem(
        'atendimentoMessages',
        JSON.stringify(this.messages),
      );
    }
  }

  private subscribeToMessages(): void {
    this.atendimentoService.getMessages$().subscribe((message) => {
      const mappedAtendenteSessionId =
        this.atendimentoService.getMappedAtendenteSessionId(message.sessionId!);
      if (
        mappedAtendenteSessionId === this.atendenteSessionId &&
        message.text
      ) {
        this.messages.push(message);
        localStorage.setItem(
          'atendimentoMessages',
          JSON.stringify(this.messages),
        );
      }
    });
  }
}
