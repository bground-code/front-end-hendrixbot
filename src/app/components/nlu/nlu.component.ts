import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from "ngx-toastr";
import { NluService } from '../../client/nlu.service';
import { NluData } from '../../models/nlu';
import { CommonModule } from "@angular/common";
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatList, MatListItem } from "@angular/material/list";
import { MatLine } from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faTrash, faPlusCircle, faMessage, faReply } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-nlu',
  templateUrl: './nlu.component.html',
  imports: [
    CommonModule, MatCard, MatCardTitle, MatList, MatListItem, MatLine, MatButton, MatIcon, RouterLink, RouterLinkActive, FormsModule, FaIconComponent
  ],
  standalone: true,
  styleUrls: ['./nlu.component.scss']
})
export class NluComponent implements OnInit {
  nluData: NluData[] | undefined;
  selectedData: NluData | null = null;
  creatingNewData: boolean = false;
  newData: { intentText: string, texts: string[] } = { intentText: '', texts: [''] };
  private modalRef: MatDialogRef<any> | null = null;

  icons = {
    faTrash,
    faPlusCircle,
    faMessage,
    faReply
  };

  constructor(
    private nluService: NluService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchNluData();
  }

  fetchNluData() {
    this.nluService.getNluData().subscribe({
      next: (data) => {
        this.nluData = data;
      },
      error: (error) => {
        console.error('Error fetching NLU data:', error);
        this.toastr.error('Erro ao carregar os dados NLU. Por favor, tente novamente.', 'Erro');
      }
    });
  }

  toggleCreateNewData() {
    this.creatingNewData = !this.creatingNewData;
    if (this.creatingNewData) {
      this.selectedData = null;
      this.newData = { intentText: '', texts: [''] };
    }
  }

  openModal(): void {
    this.toggleCreateNewData();
  }

  handleSubmitNewData() {
    if (!this.newData.intentText || this.newData.texts.some(text => !text.trim())) {
      this.toastr.error('Por favor, preencha todos os campos.', 'Erro');
      return;
    }

    if (this.selectedData) {
      const updatedNluData = {
        ...this.selectedData,
        intentText: this.newData.intentText,
        texts: this.newData.texts
      };
      this.nluService.atualizarNlu(updatedNluData).subscribe(
        () => {
          this.toastr.success('Pergunta atualizada com sucesso!');
          this.fetchNluData();
          this.creatingNewData = false;
          this.selectedData = null;
        },
        error => {
          console.error('Erro ao atualizar a pergunta:', error);
          this.toastr.error('Erro ao atualizar a pergunta. Por favor, tente novamente.', 'Erro');
        }
      );
    } else {
      const newNluData = {
        intentText: this.newData.intentText,
        texts: this.newData.texts
      };
      this.nluService.saveNluData(newNluData).subscribe(
        () => {
          this.toastr.success('Nova pergunta NLU criada com sucesso!');
          this.fetchNluData();
          this.creatingNewData = false;
          this.newData = { intentText: '', texts: [''] };
        },
        error => {
          console.error('Erro ao salvar a nova pergunta NLU:', error);
          this.toastr.error('Erro ao salvar nova pergunta. Por favor, tente novamente.', 'Erro');
        }
      );
    }
  }

  deleteData(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que o evento de clique no item seja disparado
    this.nluService.deleteIntent(id).subscribe(
      () => {
        this.toastr.success('Pergunta excluída com sucesso!');
        this.fetchNluData();
      },
      error => {
        this.toastr.error('Erro ao excluir a pergunta. Por favor, tente novamente.', 'Erro');
        console.error('Error deleting data:', error);
      }
    );
  }

  selectData(index: number) {
    if (this.nluData && index < this.nluData.length) {
      this.selectedData = this.nluData[index];
      this.newData.intentText = this.selectedData.intentText;
      // Assegurar que uma nova referência para o array é criada
      this.newData.texts = [...this.selectedData.texts];
      this.creatingNewData = false;
    }
  }

  addResponseBubble() {
    this.newData.texts = [...this.newData.texts, ''];
  }

  removeResponseBubble(index: number) {
    if (this.newData.texts.length > 1) {
      this.newData.texts.splice(index, 1);
      this.newData.texts = [...this.newData.texts];
    } else {
      this.toastr.error('Deve haver pelo menos um texto.');
    }
  }

  trackByText(index: number, text: string): any {
    return index;
  }
}
