import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from './models/usuario';
import { UsuarioService } from './client/usuario.service';
import { faGear, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Hendrix-Bot';
  usuario = new Usuario();
  showSidebar: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('/login');
      }
    });
  }

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

  protected readonly faUser = faUser;
  protected readonly faGear = faGear;
  protected readonly faHome = faHome;

  toggleMenu() {}
}
