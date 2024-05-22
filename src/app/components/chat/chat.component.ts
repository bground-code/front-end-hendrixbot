import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService, MessageDTO } from '../../client/chat.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeechRecognitionService } from '../../client/speech-recognition.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: MessageDTO[] = [];
  newMessage = '';
  isServerThinking = false;
  isListening = false;
  humanAssumed = false;

  private messagesSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private speechRecognitionService: SpeechRecognitionService
  ) {}

  ngOnInit() {
    this.messagesSubscription = this.chatService.getMessages$().subscribe((message: MessageDTO) => {
      setTimeout(() => {
        if (!this.humanAssumed || message.sender !== 'chatbot') {
          this.messages.push(message);
        }
        this.isServerThinking = false;
        if (message.type === 'info' && message.text.includes('redirecionado para um atendimento humano')) {
          this.humanAssumed = true;
        }
      }, 2000);
    });

    this.speechRecognitionService.onResult = (transcript: string) => {
      this.newMessage = transcript;
      this.sendMessage();
      this.isListening = false;
    };

    this.speechRecognitionService.onError = (error: string) => {
      console.error('Speech recognition error:', error);
      this.isListening = false;
    };

    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const msg: MessageDTO = { text: this.newMessage, type: 'sent', sender: 'user' };
      this.messages.push(msg);
      this.chatService.sendMessage(this.newMessage, this.humanAssumed);
      this.newMessage = '';
      this.isServerThinking = !this.humanAssumed;
      localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }
  }

  startListening() {
    this.isListening = true;
    this.speechRecognitionService.startListening();
  }

  stopListening() {
    this.isListening = false;
    this.speechRecognitionService.stopListening();
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
