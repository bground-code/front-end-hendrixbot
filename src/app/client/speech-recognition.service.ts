import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  public isListening = false;

  constructor(private zone: NgZone) {
    const { webkitSpeechRecognition }: any = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.onResult(transcript);
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        this.onError(event.error);
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        this.isListening = false;
      });
    };
  }

  onResult: (transcript: string) => void = () => {};
  onError: (error: string) => void = () => {};

  startListening(): void {
    if (!this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.isListening) {
      this.recognition.stop();
    }
  }
}
