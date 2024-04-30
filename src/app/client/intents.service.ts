import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {backendUrl} from "../../config";

@Injectable({
  providedIn: 'root'
})
export class IntentsService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) {}

  fetchResponses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rasa/response`, );
  }

  createResponse(newResponse: any): Observable<any> {
    return this.http.post('http://localhost:8081/rasa/response', newResponse);
  }
  deleteResponse(responseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rasa/response/${responseId}`);
  }
  fetchIntents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rasa/intents`);
  }

  createIntent(intentData: { name: string }) {
    return this.http.post('http://localhost:8081/rasa/intents', intentData);

  }

  deleteIntent(intentId: any) {
    return this.http.delete(`${this.apiUrl}/rasa/intents/${intentId}`);

  }
}
