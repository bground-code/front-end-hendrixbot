import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendUrl } from "../../config";

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) { }

  getHistoricoConversas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico/sessaoHora`);
  }

  getMensagensPorSessao(sessionId: string | undefined): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico/${sessionId}`);
  }
}
