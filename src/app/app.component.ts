import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './client/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'projeto-login-simples';
  constructor(private usuarioService: UsuarioService) {}
  usuario = new Usuario();

  ngOnInit(): void {}

  login() {
    console.log(this.usuario);
    this.usuarioService.postLogar(this.usuario).subscribe({
      next: (data) => {
        console.log('sucesso no login: ' + data);
      },
      error: (error) => {
        console.log('erro no login:' + error.error);
      },
    });
    console.log(this.usuario);
  }
}
