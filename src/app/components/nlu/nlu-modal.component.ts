import {Component, EventEmitter, Output, OnInit, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NluService } from '../../client/nlu.service';
import { IntentsService } from '../../client/intents.service';
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import { CommonModule } from '@angular/common';
import { NluData } from '../../models/nlu';

interface Intent {
  name: string;
}

@Component({
  selector: 'app-nlu-modal',
  templateUrl: './nlu-modal.component.html',
  styleUrls: ['./nlu-modal.component.scss'],
  imports: [
    MatDialogContent, MatFormField, MatSelect, MatOption, FormsModule,
    MatIcon, MatInput, MatButton, MatDialogActions, MatDialogClose, CommonModule, MatIconButton
  ],
  standalone: true
})
export class NluModalComponent implements OnInit {
  @Output() nluSaved = new EventEmitter<NluData>();
  nlu: { texts: any[]; intentText: string } = { intentText: '', texts: [] };
  intents: Intent[] = [];

  constructor(
    public dialogRef: MatDialogRef<NluModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NluData,
    private nluService: NluService,
    private intentsService: IntentsService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.nlu = data;
    }
  }

  ngOnInit(): void {
    this.loadIntents();
  }


  addText(): void {
    this.nlu.texts.push('');
    this.nlu = { ...this.nlu, texts: [...this.nlu.texts] };
  }


  removeText(index: number): void {
    if (this.nlu.texts.length > 1) {
      this.nlu.texts.splice(index, 1);
    }
  }

  saveNlu(): void {
    this.nluService.saveNluData(this.nlu).subscribe({
      next: (data: NluData) => {
        this.nluSaved.emit(data);
        this.toastr.success('NLU salva com sucesso');
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error('Erro ao salvar NLU');
        console.error('Error saving NLU data:', error);
      }
    });
  }


  loadIntents(): void {
    this.intentsService.fetchIntents().subscribe({
      next: (data: Intent[]) => {
        this.intents = data;
      },
      error: () => {
        this.toastr.error('Error loading intents');
      }
    });
  }

  trackByIntent(index: number, item: Intent): string {
    return item.name;
  }
  trackByTexts(index: number, item: any): number {
    return index;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onIntentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.nlu.intentText = selectElement.value;
  }
}
