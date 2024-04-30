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
        this.toastr.error('Error fetching stories');
        throw error;
      })
    );
  }

  createStory(storyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stories`, storyData).pipe(
      tap(() => {
        this.toastr.success('Story created successfully');
      }),
      catchError(error => {
        this.toastr.error('Error creating story');
        throw error;
      })
    );
  }

  updateStory(storyId: number, storyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/stories/${storyId}`, storyData).pipe(
      tap(() => {
        this.toastr.success('Story updated successfully');
      }),
      catchError(error => {
        this.toastr.error('Error updating story');
        throw error;
      })
    );
  }

  deleteStory(storyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/stories/${storyId}`).pipe(
      tap(() => {
        this.toastr.success('Story deleted successfully');
      }),
      catchError(error => {
        this.toastr.error('Error deleting story');
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
