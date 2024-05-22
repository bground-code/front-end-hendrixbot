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
export class AtendimentoWebSocketService {
  private wsUrl = 'ws://localhost:8081/atendimento';
  private webSocket: WebSocketSubject<any>;

  constructor() {
    this.webSocket = webSocket(this.wsUrl);
  }

  sendMessage(message: string, sessionId: string | undefined): void {
    this.webSocket.next({ text: message, type: 'sent', sender: 'atendente', sessionId });
  }

  getMessages$(): Observable<MessageDTO> {
    return this.webSocket.asObservable().pipe(
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

  assumeConversation(sessionId: string): void {
    this.webSocket.next({ text: sessionId, type: 'assume', sessionId });
  }

  getActiveSessions$(): Observable<string[]> {
    return this.webSocket.asObservable().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      })
    );
  }
}
