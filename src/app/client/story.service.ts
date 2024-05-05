import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {backendUrl} from "../../config";

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  loadStories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stories`).pipe(
      tap(() => {}),
      catchError(error => {
        this.toastr.error('Erro ao buscar Diálogos');
        throw error;
      })
    );
  }

  createStory(storyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stories`, storyData).pipe(
      tap(() => {
        this.toastr.success('Diálogo criado com sucesso');
      }),
      catchError(error => {
        this.toastr.error('Erro ao criar Diálogo');
        throw error;
      })
    );
  }

  updateStory(storyId: number, storyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/stories/${storyId}`, storyData).pipe(
      tap(() => {
        this.toastr.success('Diálogo atualizado com sucesso');
      }),
      catchError(error => {
        this.toastr.error('Erro ao atualizar Diálogo');
        throw error;
      })
    );
  }

  deleteStory(storyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/stories/${storyId}`).pipe(
      tap(() => {
        this.toastr.success('Diálogo excluido com sucesso');
      }),
      catchError(error => {
        this.toastr.error('Erro ao excluir Diálogo');
        throw error;
      })
    );
  }

  fetchIntents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rasa/intents`).pipe(
      catchError(error => {
        this.toastr.error('Error fetching intents');
        throw error;
      })
    );
  }

  fetchActions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rasa/response`).pipe(
      catchError(error => {
        this.toastr.error('Error fetching actions');
        throw error;
      })
    );
  }
}
