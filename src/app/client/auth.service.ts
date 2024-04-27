import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLogado() {
    return localStorage.getItem('dadosUsuario');
  }
}
