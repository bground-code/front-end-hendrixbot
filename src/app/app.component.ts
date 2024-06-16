import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Usuario } from './models/usuario';
import { UsuarioService } from './client/usuario.service';
import { StateService } from './client/state.service';
import { faGear, faHome, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Hendrix-Bot';
  usuario = new Usuario();
  showSidebarHeader: boolean = true;
  isSideBarChecked = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private stateService: StateService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isLoginPage = event.url.includes('/login');
        this.showSidebarHeader = !isLoginPage;
      }
    });
  }

  ngOnInit() {
    this.stateService.isSideBarChecked$.subscribe((isChecked) => {
      this.isSideBarChecked = isChecked;
    });
  }

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
  logout() {
    localStorage.clear();
  }
}
