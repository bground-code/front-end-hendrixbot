import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from "ngx-toastr";
import { NluService } from '../../client/nlu.service';
import { NluData } from '../../models/nlu';
import { NluModalComponent } from "./nlu-modal.component";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatLine} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-nlu',
  templateUrl: './nlu.component.html',
  styleUrls: ['./nlu.component.scss'],
  imports: [
    CommonModule, MatCard, MatCardTitle, MatList, MatListItem, MatLine, MatButton, MatIcon
  ],
  standalone: true
})
export class NluComponent implements OnInit {
  nluData: NluData[] | undefined;
  private modalRef: MatDialogRef<any> | null = null;

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
        this.toastr.error('Erro ao carregar os dados NLU. Por favor, tente novamente.', 'Erro');
        console.error('Error fetching NLU data:', error);
      }
    });
  }

  deleteIntent(id: number): void {
    this.nluService.deleteIntent(id).subscribe(
      () => {
        this.toastr.success('Intent excluído com sucesso!');
        this.fetchNluData();
      },
      error => {
        this.toastr.error('Erro ao excluir intent. Por favor, tente novamente.', 'Erro');
        console.error('Error deleting intent:', error);
      }
    );
  }

  openModal(): void {
    if (this.modalRef) {
      return; // Previne a abertura de múltiplos modais
    }

    this.modalRef = this.dialog.open(NluModalComponent, {
      width: '400px',
      position: { top: '-20%', left: '50%' },
      panelClass: 'custom-modal2-class'
    });

    this.modalRef.afterClosed().subscribe(result => {
      this.modalRef = null;
      if (result) {
        this.fetchNluData();
      }
    });
  }


  editNlu(data: NluData): void {
    if (this.modalRef) {
      return;
    }
    this.modalRef = this.dialog.open(NluModalComponent, {
      width: '400px',
      data: data  // Passa os dados para o modal
    });

    this.modalRef.afterClosed().subscribe(result => {
      this.modalRef = null;
      if (result) {
        this.fetchNluData();
      }
    });
  }
}
