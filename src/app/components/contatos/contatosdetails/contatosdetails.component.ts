import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contato } from '../../../models/contato';
import { ActivatedRoute, Router } from '@angular/router';
import { ContatoService } from '../../../services/contato.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

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

    const contatoData = this.contatoForm.value;
    contatoData.ativo = contatoData.ativo ? 's' : 'n';

    if (contatoData.id > 0) {
      this.contatoService.update(contatoData, contatoData.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.router.navigate(['admin/contatos'], { state: { contatoEditado: contatoData } });
          this.retorno.emit(contatoData);
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
      this.contatoService.save(contatoData).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.router.navigate(['admin/contatos'], { state: { contatoNovo: contatoData } });
          this.retorno.emit(contatoData);
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
  }
}
