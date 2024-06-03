import { Component, OnInit } from '@angular/core';
import { IntentsService } from '../../client/intents.service';
import { ToastrService } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatList, MatListItem } from "@angular/material/list";
import { MatLine } from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import { NluData } from '../../models/nlu';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faTrash, faPlusCircle, faMessage } from "@fortawesome/free-solid-svg-icons";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  imports: [CommonModule, MatCardTitle, MatCard, MatList, MatListItem, MatLine, MatButton, MatIcon, RouterLink, RouterLinkActive, FormsModule, FaIconComponent],
  standalone: true,
  styleUrls: ['./intents.component.scss']
})
export class IntentsComponent implements OnInit {
  responses: any[] = [];
  intents: any[] = [];
  icons = {
    faTrash,
    faPlusCircle,
    faMessage
  };

  constructor(
    private intentsService: IntentsService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchIntents();
    this.fetchResponses();
  }

  fetchIntents() {
    this.intentsService.fetchIntents().subscribe(
      data => this.intents = data,
      error => {
        console.error('Error fetching intents:', error);
        this.toastr.error('Erro ao buscar intents. Por favor, tente novamente.', 'Erro');
      }
    );
  }

  fetchResponses() {
    this.intentsService.fetchResponses().subscribe(
      data => this.responses = data,
      error => {
        console.error('Error fetching responses:', error);
        this.toastr.error('Erro ao buscar respostas. Por favor, tente novamente.', 'Erro');
      }
    );
  }

  selectedResponse: any = null;
  selectedResponseIndex: number = -1;
  selectResponse(index: number) {
    this.creatingNewResponse = true;
    this.selectedResponse = this.responses[index];
    this.selectedResponseIndex = index;

    this.newResponse = {
      name: this.selectedResponse.name,
      texts: this.selectedResponse.texts
    };
  }

  creatingNewResponse = false;
  newResponse = { name: '', texts: [''] };

  toggleCreateNewResponse() {
    this.creatingNewResponse = !this.creatingNewResponse;

    if (this.creatingNewResponse) {
      this.resetForm();
      this.selectedResponse = null;
      this.selectedResponseIndex = -1;
    }
  }

  handleSubmitNewResponse() {
    if (!this.newResponse.name || this.newResponse.texts.some(text => !text.trim())) {
      this.toastr.error('Por favor, preencha todos os campos.', 'Erro');
      return;
    }

    const formattedData = {
      id: this.selectedResponse ? this.selectedResponse.id : undefined, // Adicionamos o ID apenas se estiver editando
      name: this.newResponse.name,
      texts: this.newResponse.texts
    };

    if (this.selectedResponse) {
      this.intentsService.editarResponse(this.selectedResponse.id, formattedData).subscribe(
        () => {
          this.toastr.success('Resposta atualizada com sucesso!');
          this.fetchResponses();
          this.creatingNewResponse = false;
          this.resetForm();
        },
        error => {
          console.error('Error updating response:', error);
          this.toastr.error('Erro ao atualizar a resposta. Por favor, tente novamente.', 'Erro');
        }
      );
    } else {
      this.intentsService.createResponse(formattedData).subscribe(
        () => {
          this.toastr.success('Resposta criada com sucesso!');
          this.fetchResponses();
          this.creatingNewResponse = false;
          this.resetForm();
        },
        error => {
          console.error('Error creating new response:', error);
          this.toastr.error('Erro ao criar nova resposta. Por favor, tente novamente.', 'Erro');
        }
      );
    }
  }

  resetForm() {
    this.newResponse = { name: '', texts: [''] };
    this.selectedResponse = null;
    this.selectedResponseIndex = -1;
  }

  removeResponseBubble(index: number) {
    if (this.newResponse.texts && this.newResponse.texts.length > 1) {
      this.newResponse.texts.splice(index, 1);
    } else {
      this.toastr.error('Deve haver pelo menos uma resposta.');
    }
  }

  deleteResponse(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Evita que o evento de clique no item seja disparado
    const responseId = this.responses[index].id;
    this.intentsService.deleteResponse(responseId).subscribe(
      () => {
        this.toastr.success('Resposta excluída com sucesso!');
        this.fetchResponses();
      },
      error => {
        const errorMessage = error.error?.message || 'Erro ao excluir resposta. Por favor, tente novamente.';
        this.toastr.info(errorMessage, 'Atenção');
        console.error('Erro ao excluir resposta:', error);
      }
    );
  }

  deleteIntent(index: number): void {
    const intentId = this.intents[index].id;
    this.intentsService.deleteIntent(intentId).subscribe(
      () => {
        this.toastr.success('Intent excluído com sucesso!');
        this.fetchIntents();
      },
      error => {
        this.toastr.error('Erro ao excluir intent. Por favor, tente novamente.', 'Erro');
      }
    );
  }


  addResponseBubble() {
    if (!this.newResponse.texts) {
      this.newResponse.texts = [''];
    } else {
      this.newResponse.texts.push('');
    }
  }

  trackByText(index: number, text: string): any {
    return index;
  }
}
