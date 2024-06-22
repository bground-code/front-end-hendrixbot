import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  isSideBarChecked: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    public stateService: StateService,
    public authService: AuthService,
    private router: Router,
    private elRef: ElementRef,
  ) {}

  ngOnInit() {
    this.stateService.isSideBarChecked.subscribe((isChecked) => {
      this.isSideBarChecked = isChecked;
    });
    this.isLoggedIn = this.authService.isLogado();
  }

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
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.isSideBarChecked &&
      !this.elRef.nativeElement.contains(event.target)
    ) {
      this.stateService.setSideBarChecked(false); // Close the sidebar
    }
  }
}
