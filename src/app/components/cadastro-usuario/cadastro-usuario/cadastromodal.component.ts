import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlunoService } from '../../../client/cadastro.aluno.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./cadastro-modal.component.scss'],
})
export class CadastromodalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CadastromodalComponent>,
    private alunoService: AlunoService,
    private router: Router,
    private toastrService: ToastrService,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  nome: string = '';
  email: string = '';
  cpf: string = '';
  dataNascimento: string = ''; // string para o input date
  senha: string = '';
  confirmarSenha: string = '';
  contato: string = '';
  responsavel1: string = '';
  papelUsuario: string = '';
  user: any = {};

  handleSalvar(): void {
    const alunoData = {
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
      dataNascimento: this.formatDate(this.dataNascimento), // formatar data para LocalDate
      senha: this.senha,
      papelUsuario: this.papelUsuario,
      telefone: this.contato,
      responsavel1: this.responsavel1,
    };

    if (this.user && this.user.idUsuario) {
      // Se user.idUsuario existir, estamos editando um aluno
      this.alunoService.editarAluno(this.user.idUsuario, alunoData).subscribe(
        (response) => {
          console.log('Aluno editado com sucesso:', response);
          this.toastrService.success('Aluno editado com sucesso!');
          this.dialogRef.close();
        },
        (error) => {
          console.error('Erro ao editar aluno:', error);
          this.toastrService.error('Erro ao editar aluno.');
        },
      );
    } else {
      // Se não existir, estamos cadastrando um novo aluno
      this.alunoService.cadastrarAluno(alunoData).subscribe(
        (response) => {
          console.log('Aluno cadastrado com sucesso:', response);
          this.toastrService.success('Cadastrado realizado com sucesso!');
          this.router.navigate(['/cadastrar-usuario']);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Erro ao cadastrar aluno:', error);
          this.toastrService.error('Erro ao cadastrar aluno.');
        },
      );
    }
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // formato 'yyyy-MM-dd'
  }

  ngOnInit(): void {
    if (this.data && this.data.usuario) {
      this.user = this.data.usuario;

      // Popula os campos do formulário com os dados do usuário
      this.nome = this.user.nome;
      this.email = this.user.email;
      this.cpf = this.user.cpf;
      this.dataNascimento = this.formatDate(this.user.dataNascimento);
      this.contato = this.user.contatoWhatsapp;
      this.responsavel1 = this.user.responsavel1;
      this.papelUsuario = this.user.papelUsuario;
    }
  }

  onSave(): void {
    this.handleSalvar();
  }
}
