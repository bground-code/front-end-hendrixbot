import { Component, OnInit } from '@angular/core';
import { IntentsService } from '../../client/intents.service';
import { ToastrService } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatList, MatListItem } from "@angular/material/list";
import { MatLine } from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CadastroModalIntentsComponent } from "./cadastro-modal-intents.component";
import { NluData } from '../../models/nlu';
import {CadastromodalComponent} from "./cadastromodal.component";

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  imports: [CommonModule, MatCardTitle, MatCard, MatList, MatListItem, MatLine, MatButton, MatIcon],
  standalone: true,
  styleUrls: ['./intents.component.scss']
})
export class IntentsComponent implements OnInit {
  responses: any[] = [];
  intents: any[] = [];
  private dialogRef: MatDialogRef<CadastroModalIntentsComponent> | null = null;
  private dialogRefE: MatDialogRef<CadastromodalComponent> | null = null;


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


  handleSubmitNewResponse(responseData: any) {
    const formattedData = {
      name: responseData.name,
      responses: responseData.texts.map((text: any) => ({ text }))
    };

    this.intentsService.createResponse(formattedData).subscribe(
      () => {
        this.toastr.success('Resposta criada com sucesso!');
        this.fetchResponses();
      },
      error => {
        console.error('Error creating new response:', error);
        this.toastr.error('Erro ao criar nova resposta. Por favor, tente novamente.', 'Erro');
      }
    );
  }

  deleteResponse(index: number): void {
    const responseId = this.responses[index].id;
    this.intentsService.deleteResponse(responseId).subscribe(
      () => {
        this.toastr.success('Resposta excluída com sucesso!');
        this.fetchResponses();
      },
      error => {
        this.toastr.error('Erro ao excluir resposta. Por favor, tente novamente.', 'Erro');
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

  openIntentModal(): void {
    if (this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(CadastroModalIntentsComponent, {
      width: '400px',
      position: { top: '-20%', left: '50%' },
      panelClass: 'custom-modal-class'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
      if (result === true) {
        this.fetchIntents();
      }
    });
  }

  openModal(): void {
    if (this.dialogRefE) {
      return;
    }

    this.dialogRefE = this.dialog.open(CadastromodalComponent, {
      width: '400px',
      position: { top: '-20%', left: '50%' },
      panelClass: 'custom-modal2-class'
    });

    this.dialogRefE.afterClosed().subscribe(result => {
      this.dialogRefE = null;
      if (result === true) {
        this.fetchIntents();
      }
    });
  }

}
