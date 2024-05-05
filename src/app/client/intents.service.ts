import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendUrl } from "../../config";

class updatedData {
}

@Injectable({
  providedIn: 'root'
})
export class IntentsService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) {}

  fetchResponses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rasa/response`);
  }

  createResponse(newResponse: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rasa/response`, newResponse);
  }

  deleteResponse(responseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rasa/response/${responseId}`);
  }

  fetchIntents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rasa/intents`);
  }

  createIntent(intentData: { name: string }) {
    return this.http.post(`${this.apiUrl}/rasa/intents`, intentData);
  }

  deleteIntent(intentId: any) {
    return this.http.delete(`${this.apiUrl}/rasa/intents/${intentId}`);
  }

  editarResponse(id: number, updatedData: updatedData): Observable<any> {
    return this.http.put(`${this.apiUrl}/rasa/response/${id}`, updatedData);
  }
}
