import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlunoService } from '../../../client/cadastro.aluno.service'; // Importe o AlunoService
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms"; // Importe o Router

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./cadastro-modal.component.scss']
})
export class CadastroModalComponent {

  // Injete o AlunoService e o Router no construtor
  constructor(
    public dialogRef: MatDialogRef<CadastroModalComponent>,
    private alunoService: AlunoService,
    private router: Router
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  nome: string = '';
  email: string = '';
  cpf: string = '';
  dataNascimento: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  contato: string = '';
  responsavel: string = '';
  papelUsuario: string = '';

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
        this.router.navigate(['/cadastrar-usuario']); // Navegação após salvar
      },
      error => {
        console.error('Erro ao cadastrar aluno:', error);
        // Implemente a lógica de tratamento de erro aqui
      }
    );
  }
}
