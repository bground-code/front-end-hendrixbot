import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, map } from 'rxjs';

export interface MessageDTO {
  text: string;
  type: 'sent' | 'received' | 'info' | 'assume';
  sender?: 'user' | 'chatbot' | 'atendente';
  sessionId?: string;
  atendenteSessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtendimentoWebSocketService {
  private wsUrl = 'ws://localhost:8081/atendimento';
  private webSocket: WebSocketSubject<any>;
  private sessionMapping: { [userSessionId: string]: string } = {};

  constructor() {
    this.webSocket = webSocket(this.wsUrl);
  }

  sendMessage(message: string, sessionId: string | undefined): void {
    const atendenteSessionId = localStorage.getItem('atendenteSessionId');
    this.webSocket.next({ text: message, type: 'sent', sender: 'atendente', sessionId, atendenteSessionId });
  }

  getMessages$(): Observable<MessageDTO> {
    return this.webSocket.asObservable().pipe(
      map(data => {
        if (typeof data === 'object' && data.text) {
          const atendenteSessionId = data.atendenteSessionId || localStorage.getItem('atendenteSessionId');
          if (data.sender === 'user' && data.sessionId && atendenteSessionId) {
            this.sessionMapping[data.sessionId] = atendenteSessionId;
          }
          return {
            text: data.text,
            type: data.type || 'received',
            sender: data.sender || 'user',
            sessionId: data.sessionId,
            atendenteSessionId
          };
        }
        return { text: '', type: 'received', sender: 'user', sessionId: undefined, atendenteSessionId: undefined };
      })
    );
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

  getMappedAtendenteSessionId(userSessionId: string): string | undefined {
    return this.sessionMapping[userSessionId];
  }

  assumeConversation(sessionId: string): void {
    const atendenteSessionId = localStorage.getItem('atendenteSessionId');
    this.webSocket.next({ text: sessionId, type: 'assume', sessionId, atendenteSessionId });
  }
}
