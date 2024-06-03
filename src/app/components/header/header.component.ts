import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from 'src/app/shared/state.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private stateService: StateService) {}

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.stateService.setSideBarChecked(isChecked);
  }
}
