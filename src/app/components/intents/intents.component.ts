import { Component, OnInit } from '@angular/core';
import { IntentsService } from '../../client/intents.service';
import {ToastrService} from "ngx-toastr";
import {CommonModule} from "@angular/common";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import { CadastromodalComponent } from './cadastromodal.component';
import { MatDialog } from '@angular/material/dialog';
import {MatIcon} from "@angular/material/icon";
import {CadastroModalIntentsComponent} from "./cadastro-modal-intents.component";

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

  openCreateModal: boolean = false;
  newResponse: any = { name: '', texts: [''] };

  constructor(
    private intentsService: IntentsService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchIntents();
    this.fetchResponses();  // Inicializar a busca de responses
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
      (data: any[]) => this.responses = data,
      (error: any) => {
        console.error('Error fetching responses:', error);
        this.toastr.error('Erro ao buscar respostas. Por favor, tente novamente.', 'Erro');
      }
    );
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CadastromodalComponent, {
      width: '400px',
      position: { top: '-5%', left: '50%', transform: 'translate(-50%, -50%)' } as any

    });

    dialogRef.componentInstance.responseCreated.subscribe((created: boolean) => {
      if (created) {
        this.fetchResponses();
      }
    });
  }
  handleSubmitNewResponse(responseData: any) {
    const formattedData = {
      name: responseData.name,
      responses: responseData.texts.map((text: string) => ({ text: text }))
    };

    this.intentsService.createResponse(formattedData).subscribe(
      () => {
        this.toastr.success('Resposta criada com sucesso!');
        this.fetchResponses();
      },
      (error: any) => {
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
      (error: any) => {
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
    const dialogRef = this.dialog.open(CadastroModalIntentsComponent, {
      width: '400px',
      position: { top: '-10%', left: 'calc(50% - 200px)' }  // Certifique-se de que o modal está centralizado corretamente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fetchIntents();
      }
    });
  }


}
