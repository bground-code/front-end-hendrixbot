import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/client/state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  isChecked = false;

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.stateService.isSideBarChecked$.subscribe((isChecked) => {
      this.isChecked = isChecked;
    });
  }
}
