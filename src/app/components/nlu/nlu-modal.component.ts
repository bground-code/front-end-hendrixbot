import {Component, EventEmitter, Output} from '@angular/core';
import {NluService} from '../../client/nlu.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nlu-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField,
  ],
  templateUrl: './nlu-modal.component.html',
  styleUrls: ['./nlu-modal.component.scss']
})
export class NluModalComponent {
  @Output() nluSaved = new EventEmitter<any>();
  nlu = {
    intentText: '',
    texts: ['']
  };

  constructor(
    public dialogRef: MatDialogRef<NluModalComponent>,
    private nluService: NluService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  addText() {
    this.nlu.texts.push('');
  }

  removeText(index: number) {
    if (this.nlu.texts.length > 1) {
      this.nlu.texts.splice(index, 1);
    }
  }

  saveNlu() {
    const newNlu = {
      intentText: this.nlu.intentText,
      texts: this.nlu.texts
    };

    this.nluService.saveNluData(newNlu).subscribe({
      next: (data) => {
        this.nluSaved.emit(data);

      },
      error: (error) => {
        console.error('Error saving NLU data:', error);
      }
    });
  }

  trackByTexts(index: number, item: string): number {
    return index;
  }
}
