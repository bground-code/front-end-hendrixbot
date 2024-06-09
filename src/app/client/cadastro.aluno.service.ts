import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendUrl } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient) {}

  cadastrarAluno(alunoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cadastrar`, alunoData);
  }

  buscarAlunos(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/cadastrar/alunos`, { params });
  }

  excluirAluno(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cadastrar/alunos/${id}`);
  }

  editarAluno(id: number, alunoData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/cadastrar/editar/${id}`,
      alunoData,
    );
  }
}
