import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlunoService } from '../../../client/cadastro.aluno.service';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./cadastro-modal.component.scss']
})
export class CadastromodalComponent {

  constructor(
    public dialogRef: MatDialogRef<CadastromodalComponent>,
    private alunoService: AlunoService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  nome: string = '';
  email: string = '';
  cpf: string = '';
  dataNascimento: string = '';  // string para o input date
  senha: string = '';
  confirmarSenha: string = '';
  contato: string = '';
  responsavel1: string = '';
  papelUsuario: string = '';

  handleSalvar(): void {
    const alunoData = {
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
      dataNascimento: this.formatDate(this.dataNascimento),  // formatar data para LocalDate
      senha: this.senha,
      papelUsuario: this.papelUsuario,
      telefone: this.contato,
      responsavel1: this.responsavel1,
    };

    this.alunoService.cadastrarAluno(alunoData).subscribe(
      response => {
        console.log('Aluno cadastrado com sucesso:', response);
        this.toastrService.success('Cadastrado realizado com sucesso!');
        this.router.navigate(['/cadastrar-usuario']);
        this.dialogRef.close();
      },
      error => {
        console.error('Erro ao cadastrar aluno:', error);
        this.toastrService.error('Erro ao cadastrar aluno.');
      }
    );
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // formato 'yyyy-MM-dd'
  }
}
