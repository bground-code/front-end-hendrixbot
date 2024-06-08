import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { StateService } from 'src/app/shared/state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private stateService: StateService, private router: Router) {} // Injetar Router

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.stateService.setSideBarChecked(isChecked);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']); // Redirecionar para a página de login
  }
}
