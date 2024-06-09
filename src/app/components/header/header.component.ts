import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from 'src/app/client/state.service';
import { AuthService } from 'src/app/client/auth.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isSideBarChecked: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    public stateService: StateService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.stateService.isSideBarChecked.subscribe((isChecked) => {
      this.isSideBarChecked = isChecked;
    });
    this.isLoggedIn = this.authService.isLogado();
  }

  // This method is called when the checkbox changes state
  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.stateService.setSideBarChecked(isChecked);
  }
  onToggleLogin() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
