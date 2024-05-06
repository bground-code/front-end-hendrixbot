import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, map } from 'rxjs';

export interface MessageDTO {
  text: string;
  type: 'sent' | 'received';
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
    this.chatWebSocket.next({ text: message, type: 'sent' });
  }

  getMessages$(): Observable<MessageDTO> {
    return this.chatWebSocket.asObservable().pipe(
      map(data => {
        return {
          text: data.text || data[0].text,
          type: 'received'
        };
      })
    );
  }
}
