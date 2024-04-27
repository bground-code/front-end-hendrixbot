import { Component } from '@angular/core';
import { UsuarioService } from '../../client/usuario.service';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private usuarioService: UsuarioService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}
  usuario = new Usuario();

  ngOnInit(): void {}

  login() {
    console.log(this.usuario);
    this.usuarioService.postLogar(this.usuario).subscribe({
      next: (data: Usuario | any) => {
        this.toastrService.success('Bem vindo ' + data.nome);
        this.router.navigate(['/home']);
        localStorage.setItem('dadosUsuario', JSON.stringify(data));
      },
      error: (error) => {
        this.toastrService.error('Erro ao logar, tente novamente!');
      },
    });
    console.log(this.usuario);
  }
}
