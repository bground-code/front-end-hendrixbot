import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NluService } from '../../client/nlu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { NluModalComponent } from "./nlu-modal.component";
import {CadastroModalIntentsComponent} from "../intents/cadastro-modal-intents.component";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CadastromodalComponent} from "../cadastro-usuario/cadastro-usuario/cadastromodal.component";
import {NLUData} from "../../models/nlu";

@Component({
  selector: 'app-nlu',
  standalone: true,
  imports: [CommonModule, MatCardTitle, MatCard, MatList, MatListItem, MatLine, MatButton, MatIcon],

  templateUrl: './nlu.component.html',
  styleUrls: ['./nlu.component.scss']
})
export class NluComponent implements OnInit {
  protected id: number | undefined ;
  intentText: string = '';
  texts: string[] = [];
  nluData: NLUData[] = [];

  constructor(
    private nluService: NluService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchNluData();
  }

  private fetchNluData() {
    this.nluService.getNluData().subscribe({
      next: (data) => {
        this.nluData = data;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar os dados NLU. Por favor, tente novamente.', 'Erro');
        console.error('Error fetching NLU data:', error);
      }
    });
  }

  deleteIntent(id: number | undefined): void {
    this.nluService.deleteIntent(id).subscribe(
      () => {
        this.toastr.success('Intent excluído com sucesso!');
        this.fetchNluData();
      },
      error => {
        this.toastr.error('Erro ao excluir intent. Por favor, tente novamente.', 'Erro');
      }
    );
  }
  openModal(): void {
    const dialogRef = this.dialog.open(NluModalComponent, {
      width: '400px',
      position: { top: '-30%', left: '50%', transform: 'translate(-50%, -50%)' } as any
    });
  }


}
