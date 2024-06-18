import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from 'src/app/client/state.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/client/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
