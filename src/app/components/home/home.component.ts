import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../client/auth.service';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLogado()) {
      this.router.navigate(['login']);
      this.toastr.error('Acesso negado!');
    }
  }
  toggleMenu() {
    document.querySelector('body')?.classList.toggle('collapsedMenu');
  }
}
