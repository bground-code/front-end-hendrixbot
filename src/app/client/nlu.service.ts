import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {backendUrl} from "../../config";
import { NluData} from "../models/nlu";
import {catchError, tap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NluService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getNluData(): Observable<NluData[]> {
    return this.http.get<NluData[]>(`${this.apiUrl}/nlu`);
  }

  saveNluData(nluData: { texts: string[]; intentText: string }): Observable<NluData> {
    return this.http.post<NluData>(`${this.apiUrl}/nlu`, nluData).pipe(
      catchError(error => {
        this.toastr.error('Erro ao salvar NLU');
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

  atualizarNlu(nluData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/nlu`, nluData).pipe(
      tap(() => {
        this.toastr.success('Story updated successfully');
      }),
      catchError(error => {
        this.toastr.error('Error updating story');
        throw error;
      })
    );
  }
  deleteIntent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/nlu/${id}`);
  }
}
