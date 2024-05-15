import { Component, OnInit, ViewChild } from '@angular/core';
import { AlunoService } from '../../../client/cadastro.aluno.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastromodalComponent } from './cadastromodal.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { ToastrService } from "ngx-toastr";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginator,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatButton,
    MatTable,
    MatRowDef,
    MatHeaderRowDef,
  ],
  styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent implements OnInit {
  nome: string = '';
  email: string = '';
  cpf: string = '';
  dataNascimento: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  contato: string = '';
  responsavel1: string = '';
  papelUsuario: string = '';
  alunos: any[] = [];
  totalElements: number = 0;
  page = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns: string[] = ['nome', 'email', 'cpf', 'dataNascimento', 'contato', 'responsavel1', 'papelUsuario', 'acoes'];

  constructor(
    private alunoService: AlunoService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.buscarAlunos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleSalvar(): void {
    const alunoData = {
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
      dataNascimento: this.dataNascimento,
      senha: this.senha,
      confirmarSenha: this.confirmarSenha,
      contato: this.contato,
      responsavel1: this.responsavel1,
      papelUsuario: this.papelUsuario
    };

    this.alunoService.cadastrarAluno(alunoData).subscribe(
      response => {
        console.log('Aluno cadastrado com sucesso:', response);
        this.buscarAlunos();
        this.toastrService.success('Aluno cadastrado com sucesso!');
      },
      error => {
        console.error('Erro ao cadastrar aluno:', error);
      }
    );
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CadastromodalComponent, {
      width: '1000px',
      position: { top: '-45%', left: '30%', transform: 'translate(-50%, -50%)' } as any
    });

    dialogRef.afterClosed().subscribe(() => {
      this.buscarAlunos();
    });
  }

  buscarAlunos(): void {
    this.alunoService.buscarAlunos(this.page, this.pageSize).subscribe(
      (response: any) => {
        this.alunos = response.content;
        this.totalElements = response.totalElements;
        this.dataSource.data = this.alunos;
        console.log(this.alunos);
      },
      error => {
        console.error('Erro ao buscar alunos:', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarAlunos();
  }

  excluirAluno(id: number): void {
    this.alunoService.excluirAluno(id).subscribe(
      () => {
        console.log(`Aluno com ID ${id} excluído com sucesso.`);
        this.toastrService.success(`Aluno com ID ${id} excluído com sucesso.`);
        this.buscarAlunos();
      },
      error => {
        console.error(`Erro ao excluir aluno com ID ${id}:`, error);
      }
    );
  }
}
