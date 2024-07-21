import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Contato } from '../../../models/contato';
import { ActivatedRoute, Router } from '@angular/router';
import { ContatoService } from '../../../services/contato.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-contatosdetails',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contatosdetails.component.html',
  styleUrls: ['./contatosdetails.component.scss'],
})
export class ContatosdetailsComponent implements OnInit {

  @Input() contato: Contato | null = null;
  @Output() retorno = new EventEmitter<void>();

  contatoForm!: FormGroup;

  fb = inject(FormBuilder);
  routerParam = inject(ActivatedRoute);
  router = inject(Router);
  contatoService = inject(ContatoService);

  ngOnInit() {
    this.contatoForm = this.fb.group({
      id: [this.contato?.id],
      nome: [this.contato?.nome, Validators.required],
      email: [this.contato?.email, [Validators.required, Validators.email]],
      celular: [this.contato?.celular, Validators.required],
      telefone: [this.contato?.telefone, Validators.required],
      favorito: [this.contato?.favorito, [Validators.required, Validators.pattern(/^[SN]$/)]],
      ativo: [this.contato?.ativo === 's'],
    });

    const id = this.routerParam.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.contatoService.findById(id).subscribe({
      next: (contatoBack) => {
        this.contato = contatoBack;
        this.contatoForm.patchValue(this.contato);
      },
      error: () => {
        Swal.fire({
          title: 'Ocorreu um erro',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  save() {
    if (this.contatoForm.invalid) {
      return;
    }

    const contatoDadosForm = this.contatoForm.value;

    this.contatoService.existsByCelular(contatoDadosForm.celular).subscribe({
      next: (exists) => {
        if (exists && (!this.contato || this.contato.celular !== contatoDadosForm.celular)) {
          Swal.fire({
            title: 'Celular já cadastrado',
            text: 'Este número de celular já está cadastrado em outro contato.',
            icon: 'warning',
            confirmButtonText: 'Ok',
          });
          return;
        }

        contatoDadosForm.ativo = contatoDadosForm.ativo ? 's' : 'n';

        if (contatoDadosForm.id > 0) {
          this.contatoService.update(contatoDadosForm, contatoDadosForm.id).subscribe({
            next: (mensagem) => {
              Swal.fire({
                title: mensagem,
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.router.navigate(['admin/contatos'], { state: { contatoEditado: contatoDadosForm } });
              this.retorno.emit(contatoDadosForm);
            },
            error: () => {
              Swal.fire({
                title: 'Ocorreu um erro',
                icon: 'error',
                confirmButtonText: 'Ok',
              }).then(() => {
                this.retorno.emit();
              });
            },
          });
        } else {
          this.contatoService.save(contatoDadosForm).subscribe({
            next: (mensagem) => {
              Swal.fire({
                title: mensagem,
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.router.navigate(['admin/contatos'], { state: { contatoNovo: contatoDadosForm } });
              this.retorno.emit(contatoDadosForm);
            },
            error: () => {
              Swal.fire({
                title: 'Ocorreu um erro',
                icon: 'error',
                confirmButtonText: 'Ok',
              }).then(() => {
                this.retorno.emit();
              });
            },
          });
        }
      },
      error: () => {
        Swal.fire({
          title: 'Ocorreu um erro',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }
}
