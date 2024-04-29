import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IntentsService } from '../../client/intents.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-cadastro-modal-intents',
  templateUrl: './cadastro-intent-modal.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatLabel,
    MatFormField,
    MatButton,
    MatInput,
  ],
  styleUrls: ['./cadastro-intents-modal.component.scss']
})

export class CadastroModalIntentsComponent {

  name: string = '';
  @Output() intentCreated = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<CadastroModalIntentsComponent>,
    private intentsService: IntentsService,
    private toastr: ToastrService
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  handleSalvarIntents(): void {
    if (this.name.trim()) {
      this.intentsService.createIntent({ name: this.name.trim() }).subscribe(
        () => {
          this.toastr.success('Intent criado com sucesso!');
          this.intentCreated.emit(true);
          this.dialogRef.close();
        },
        error => {
          console.error('Erro ao criar novo intent:', error);
          this.toastr.error('Erro ao criar novo intent. Por favor, tente novamente.', 'Erro');
          this.intentCreated.emit(false);
        }
      );
    } else {
      this.toastr.error('O nome do intent não pode estar vazio.');
    }
  }
}
