import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, map } from 'rxjs';

export interface MessageDTO {
  text: string;
  type: 'sent' | 'received' | 'info';
  sender?: 'user' | 'chatbot' | 'atendente';
  sessionId?: string;
  atendenteSessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatWebSocket: WebSocketSubject<any>;

  constructor() {
    this.chatWebSocket = webSocket('ws://localhost:8081/chat');
  }

  sendMessage(message: string): void {
    const sessionId = localStorage.getItem('sessionId');
    const atendenteSessionId = localStorage.getItem('atendenteSessionId');
    this.chatWebSocket.next({ text: message, type: 'sent', sender: 'user', sessionId, atendenteSessionId });
  }

  getMessages$(): Observable<MessageDTO> {
    return this.chatWebSocket.asObservable().pipe(
      map(data => {
        if (typeof data === 'object' && data.text) {
          if (data.sender === 'atendente' && data.type === 'info' && data.sessionId) {
            localStorage.setItem('atendenteSessionId', data.sessionId);
          }
          return {
            text: data.text,
            type: data.type || 'received',
            sender: data.sender || 'chatbot',
            sessionId: data.sessionId,
            atendenteSessionId: data.atendenteSessionId
          };
        }
        return { text: '', type: 'received', sender: 'chatbot', sessionId: undefined, atendenteSessionId: undefined };
      })
    );
  }
}
