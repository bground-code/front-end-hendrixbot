import {Component, EventEmitter, Output} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IntentsService } from '../../client/intents.service';
import { ToastrService } from 'ngx-toastr';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormField,

  ],
  styleUrls: ['./cadastro-modal.component.scss']
})
export class CadastromodalComponent {

  name: string = '';
  texts: string[] = [''];
  @Output() responseCreated = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<CadastromodalComponent>,
    private intentsService: IntentsService,
    private toastr: ToastrService
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }

  handleSalvar(): void {
    const responseData = {
      name: this.name,
      texts: this.texts.filter(text => text.trim() !== '')
    };

    this.intentsService.createResponse(responseData).subscribe(
      () => {
        this.toastr.success('Resposta criada com sucesso!');
        this.responseCreated.emit(true);
        this.dialogRef.close();
      },
      (error: any) => {
        console.error('Erro ao criar nova resposta:', error);
        this.toastr.error('Erro ao criar nova resposta. Por favor, tente novamente.', 'Erro');
        this.responseCreated.emit(false);
      }
    );
  }


  addText(): void {
    this.texts.push('');
  }

  trackByTexts(index: number, item: string): number {
    return index;
  }

  removeText(index: number): void {
    this.texts.splice(index, 1);
  }
}
