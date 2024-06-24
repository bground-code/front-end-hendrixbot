import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NluService } from '../../client/nlu.service';
import { NluData } from '../../models/nlu';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatLine } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nlu',
  templateUrl: './nlu.component.html',
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatList,
    MatListItem,
    MatLine,
    MatButton,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  standalone: true,
  styleUrls: ['./nlu.component.scss'],
})
export class NluComponent implements OnInit {
  nluData: NluData[] | undefined;
  selectedData: NluData | null = null;
  creatingNewData: boolean = false;
  newData: { intentText: string; texts: string[] } = {
    intentText: '',
    texts: [''],
  };

  constructor(
    private nluService: NluService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.fetchNluData();
  }

  fetchNluData() {
    this.nluService.getNluData().subscribe({
      next: (data) => {
        this.nluData = data;
        // Sort nluData alphabetically by intentText
        this.nluData.sort((a, b) => a.intentText.localeCompare(b.intentText));
      },
      error: (error) => {
        console.error('Error ao buscar perguntas:', error);
        this.toastr.error(
          'Erro ao carregar os dados NLU. Por favor, tente novamente.',
          'Erro',
        );
      },
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
    if (
      !this.newData.intentText ||
      this.newData.texts.some((text) => !text.trim())
    ) {
      this.toastr.error('Por favor, preencha todos os campos.', 'Erro');
      return;
    }

    if (this.selectedData) {
      const updatedNluData = {
        ...this.selectedData,
        intentText: this.newData.intentText,
        texts: this.newData.texts,
      };
      this.nluService.atualizarNlu(updatedNluData).subscribe(
        () => {
          this.fetchNluData();
          this.creatingNewData = false;
          this.selectedData = null;
          this.toastr.success('Pergunta atualizada com sucesso!');
        },
        (error) => {
          const errorMessage =
            error.error?.message ||
            'Erro ao excluir a pergunta. Por favor, tente novamente.';
          this.toastr.info(errorMessage, 'Erro');
          console.error('Error updating data:', error);
        },
      );
    } else {
      const newNluData = {
        intentText: this.newData.intentText,
        texts: this.newData.texts,
      };
      this.nluService.saveNluData(newNluData).subscribe(
        () => {
          this.toastr.success('Nova pergunta criada com sucesso!');
          this.fetchNluData();
          this.creatingNewData = false;
          this.newData = { intentText: '', texts: [''] };
        },
        (error) => {
          const errorMessage =
            error.error?.message ||
            'Erro ao salvar a pergunta. Por favor, tente novamente.';
          console.error('Error saving data:', error);
        },
      );
    }
  }

  deleteData(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.nluService.deleteIntent(id).subscribe(
      () => {
        this.toastr.success('Pergunta excluída com sucesso!');
        this.fetchNluData();
      },
      (error) => {
        const errorMessage =
          error.error?.message ||
          'Erro ao excluir a pergunta. Por favor, tente novamente.';
        this.toastr.info(errorMessage, 'Atenção');
        console.error('Error deleting data:', error);
      },
    );
  }

  selectData(index: number) {
    if (this.nluData && index < this.nluData.length) {
      this.selectedData = this.nluData[index];
      this.newData.intentText = this.selectedData.intentText;
      // Create a new reference for the array to trigger change detection
      this.newData.texts = [...this.selectedData.texts];
      this.creatingNewData = false;
      // Sort texts after selecting data
      this.sortTextsAlphabetically();
    }
  }

  addResponseBubble() {
    this.newData.texts = ['', ...this.newData.texts];
    // Sort texts after adding a new bubble
    this.sortTextsAlphabetically();
  }

  removeResponseBubble(index: number) {
    if (this.newData.texts.length > 1) {
      this.newData.texts.splice(index, 1);
      this.newData.texts = [...this.newData.texts];
      // Sort texts after removing a bubble
      this.sortTextsAlphabetically();
    } else {
      this.toastr.error('Deve haver pelo menos um texto.');
    }
  }

  // Function to sort texts alphabetically
  sortTextsAlphabetically() {
    this.newData.texts.sort((a, b) => a.localeCompare(b));
  }

  trackByText(index: number, text: string): any {
    return index;
  }
}
