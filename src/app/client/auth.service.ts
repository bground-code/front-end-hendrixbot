import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLogado() {
    const dadosUsuario = localStorage.getItem('dadosUsuario');
    if (dadosUsuario) {
      const usuario = JSON.parse(dadosUsuario);
      const token = usuario.tokenDto?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
        return true;
      }
    }
    return false;
  }
}
