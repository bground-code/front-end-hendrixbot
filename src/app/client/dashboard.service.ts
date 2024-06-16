import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { backendUrl } from "../../config";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) { }

  getTotalConversasLeads(): Observable<number> {
    return this.http.post<string[]>(`${this.apiUrl}/relatorios/conversasLeads`, {}).pipe(
      map(response => {
        const totalConversas = response.map(item => Number(item.split(',')[1]));
        return totalConversas.reduce((acc, val) => acc + val, 0);
      })
    );
  }

  getTotalConversasAlunos(): Observable<number> {
    return this.http.post<string[]>(`${this.apiUrl}/relatorios/conversasAlunos`, {}).pipe(
      map(response => {
        const totalConversas = response.map(item => Number(item.split(',')[1]));
        return totalConversas.reduce((acc, val) => acc + val, 0);
      })
    );
  }

  getTotalConversasMes(): Observable<{ total: number, leads: number, alunos: number }> {
    return this.http.post<string[]>(`${this.apiUrl}/relatorios/conversasMes`, {}).pipe(
      map(response => {
        const totalConversas = response.map(item => Number(item.split(',')[1]));
        const total = totalConversas.reduce((acc, val) => acc + val, 0);
        const leads = totalConversas.filter((_, index) => index % 2 === 0).reduce((acc, val) => acc + val, 0);
        const alunos = total - leads;
        return { total, leads, alunos };
      })
    );
  }

  getPerguntasFrequentes(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/relatorios/perguntas?page=${page}&size=${size}`);
  }
}
