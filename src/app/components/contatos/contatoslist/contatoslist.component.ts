import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ContatosdetailsComponent } from '../contatosdetails/contatosdetails.component';
import { Contato } from '../../../models/contato';
import { ContatoService } from '../../../services/contato.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contatoslist',
  standalone: true,
  imports: [RouterLink,MdbModalModule,ContatosdetailsComponent],
  templateUrl: './contatoslist.component.html',
  styleUrl: './contatoslist.component.scss'
})
export class ContatoslistComponent {

  contatoLista: Contato[] = [];
  contatoEdit: Contato = new Contato();

  modalService = inject(MdbModalService);
  @ViewChild("modalContatoDetalhe") modalContatoDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  contatoService = inject(ContatoService);

  constructor() {
    this.findAll();

    let contatoNovo = history.state.contatoNovo;
    let contatoEditado = history.state.contatoEditado;

    if(contatoNovo != null) {
      this.contatoLista.push(contatoNovo);
    }

    if(contatoEditado != null) {
      let indice = this.contatoLista.findIndex(x => {return x.id == contatoEditado.id});
      this.contatoLista[indice] = contatoEditado;
    }

  }

  findAll() {

    this.contatoService.findAll().subscribe({
      next: listaBack => { // quando back retornar o correto
        this.contatoLista = listaBack;
      },
      error: erro => { // quando ocorrer qualquer erro
        Swal.fire({
          title: 'Ocorreu um erro',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });

  }

  deleteById(contato: Contato) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir este registro?',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {

        this.contatoService.delete(contato.id).subscribe({
          next: mensagem => { // quando back retornar o correto
            Swal.fire({
              title: mensagem,
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.findAll();
          },
          error: err => { // quando ocorrer qualquer erro
            Swal.fire({
              title: 'Ocorreu um erro',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        });
      }
    });
  }

  new() {
    this.contatoEdit = new Contato();
    this.modalRef = this.modalService.open(this.modalContatoDetalhe);
  }

  edit(contato: Contato) {
    this.contatoEdit = { ...contato};  // clonando para evidar referencia de objeto
    this.modalRef = this.modalService.open(this.modalContatoDetalhe);
  }

  retornoDetalhe(contato: Contato) {
    this.findAll();
    this.modalRef.close();
  }
}
