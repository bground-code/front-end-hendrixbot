import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {backendUrl} from "../../config";
import {NLUData} from "../models/nlu";
import {catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NluService {
  private apiUrl = `${backendUrl}`;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getNluData(): Observable<NLUData[]> {
    return this.http.get<NLUData[]>(`${this.apiUrl}/nlu`);
  }

  saveNluData(newNlu: { texts: any; intentText: string }) {
    return this.http.post('http://localhost:8081/rasa/nlu', newNlu );
  }
  fetchIntents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rasa/intents`).pipe(
      catchError(error => {
        this.toastr.error('Error fetching intents');
        throw error;
      })
    );
  }
  deleteIntent(intentId: any) {
    return this.http.delete(`${this.apiUrl}/nlu/${intentId}`);

  }
}
