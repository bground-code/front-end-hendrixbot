import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService, MessageDTO } from '../../client/chat.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor, CommonModule],
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: MessageDTO[] = [];
  newMessage = '';
  isServerThinking = false;

  private messagesSubscription: Subscription | undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messagesSubscription = this.chatService
      .getMessages$()
      .subscribe((message: MessageDTO) => {
        setTimeout(() => {
          this.messages.push(message); // Adiciona a mensagem recebida ao array após o delay
          this.isServerThinking = false; // Desativa o indicador de "digitando"
        }, 2000); // Delay simulando o servidor "digitando"
      });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const msg: MessageDTO = { text: this.newMessage, type: 'sent' };
      this.messages.push(msg);
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
      this.isServerThinking = true;
    }
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
