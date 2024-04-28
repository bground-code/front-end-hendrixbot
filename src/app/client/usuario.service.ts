import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  url = 'http://hendrixbot.com.br:8081';
  constructor(private htpp: HttpClient) {}

  postLogar(usuario: any): Observable<any> {
    return this.htpp.post<any>(`${this.url}/auth/login`, usuario);
  }
}
