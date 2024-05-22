import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, map } from 'rxjs';

export interface MessageDTO {
  text: string;
  type: 'sent' | 'received' | 'info';
  sender?: 'user' | 'chatbot' | 'atendente';
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatWebSocket: WebSocketSubject<any>;

  constructor() {
    this.chatWebSocket = webSocket('ws://hendrixbot.com.br:8081/chat');
  }

  sendMessage(message: string, humanAssumed: boolean): void {
    const sessionId = localStorage.getItem('sessionId');
    const sender = humanAssumed ? 'atendente' : 'user';
    this.chatWebSocket.next({ text: message, type: 'sent', sender, sessionId });
  }

  getMessages$(): Observable<MessageDTO> {
    return this.chatWebSocket.asObservable().pipe(
      map(data => {
        if (typeof data === 'object' && data.text) {
          return {
            text: data.text,
            type: data.type || 'received',
            sender: data.sender || 'user',
            sessionId: data.sessionId
          };
        }
        return { text: '', type: 'received', sender: 'user', sessionId: undefined };
      })
    );
  }
}
