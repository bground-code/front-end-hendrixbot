import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import {backendUrl} from "../../config";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${backendUrl}`;

  constructor(private htpp: HttpClient) {}

  postLogar(usuario: any): Observable<any> {
    return this.htpp.post<any>(`${this.apiUrl}/auth/login`, usuario);
  }
}
