import { Component, OnInit, ViewChild } from '@angular/core';
import { AlunoService } from '../../../client/cadastro.aluno.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroModalComponent } from './CadastroModalComponent';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from "ngx-toastr"; // Importe o ToastrService

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatPaginator,
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
  responsavel: string = '';
  papelUsuario: string = '';
  alunos: any[] = [];
  totalElements: number = 0;
  page = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource: MatTableDataSource<any> | undefined;
  displayedColumns: string[] = ['nome', 'email', 'cpf', 'dataNascimento', 'acoes'];

  constructor(
    private alunoService: AlunoService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.alunos);
    this.buscarAlunos();
  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
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
      responsavel: this.responsavel,
      papelUsuario: this.papelUsuario
    };

    this.alunoService.cadastrarAluno(alunoData).subscribe(
      response => {
        console.log('Aluno cadastrado com sucesso:', response);
        this.buscarAlunos();
      },
      error => {
        console.error('Erro ao cadastrar aluno:', error);
      }
    );
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CadastroModalComponent, {
      width: '400px',
      position: { top: '-30%', left: '50%', transform: 'translate(-50%, -50%)' } as any
    });
  }

  buscarAlunos(): void {
    this.alunoService.buscarAlunos(this.page, this.pageSize).subscribe(
      (response: any) => {
        this.alunos = response.content;
        this.totalElements = response.totalElements;
        if (this.dataSource) {
          this.dataSource.data = this.alunos;
        }
        console.log(this.alunos);
      },
      error => {
        console.error('Erro ao buscar alunos:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarAlunos();
  }

  excluirAluno(id: number): void {
    this.alunoService.excluirAluno(id).subscribe(
      () => {
        console.log(`Aluno com ID ${id} excluído com sucesso.`);
        this.toastrService.success(`Aluno com ID ${id} excluído com sucesso.`);
        this.buscarAlunos(); // Atualizar a lista após a exclusão
      },
      error => {
        console.error(`Erro ao excluir aluno com ID ${id}:`, error);
      }
    );
  }
}
