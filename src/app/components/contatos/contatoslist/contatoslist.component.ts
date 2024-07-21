import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ContatosdetailsComponent } from '../contatosdetails/contatosdetails.component';
import { Contato } from '../../../models/contato';
import { ContatoService } from '../../../services/contato.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contatoslist',
  standalone: true,
  imports: [RouterLink, MdbModalModule, ContatosdetailsComponent, CommonModule, FormsModule],
  templateUrl: './contatoslist.component.html',
  styleUrls: ['./contatoslist.component.scss']
})
export class ContatoslistComponent {
  contatoLista: Contato[] = [];
  contatosFiltrados: Contato[] = [];
  contatoEdit: Contato | null = null;
  filtraBusca: string = '';

  modalService = inject(MdbModalService);
  @ViewChild('modalContatoDetalhe') modalContatoDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  contatoService = inject(ContatoService);

  constructor() {
    this.findAll();

    const contatoNovo = history.state.contatoNovo;
    const contatoEditado = history.state.contatoEditado;

    if (contatoNovo != null) {
      this.contatoLista.push(contatoNovo);
    }

    if (contatoEditado != null) {
      const indice = this.contatoLista.findIndex((x) => x.id === contatoEditado.id);
      if (indice !== -1) {
        this.contatoLista[indice] = contatoEditado;
      }
    }
  }

  findAll() {
    this.contatoService.findAll().subscribe({
      next: (listaBack) => {
        this.contatoLista = listaBack;
        this.ordenaContatos();
        this.contatosFiltrados = listaBack;
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

  deleteById(contato: Contato) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir este registro?',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contatoService.delete(contato.id).subscribe({
          next: (mensagem) => {
            Swal.fire({
              title: mensagem,
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.findAll();
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
    });
  }

  new() {
    this.contatoEdit = new Contato();
    this.modalRef = this.modalService.open(this.modalContatoDetalhe);
  }

  edit(contato: Contato) {
    this.contatoEdit = { ...contato };
    this.modalRef = this.modalService.open(this.modalContatoDetalhe);
  }

  trackById(index: number, item: Contato): number {
    return item.id;
  }

  retornoDetalhe() {
    this.findAll();
    this.modalRef.close();
  }

  search() {
    if (this.filtraBusca.trim() === '') {
      this.contatosFiltrados = this.contatoLista;
    } else {
      this.contatosFiltrados = this.contatoLista.filter(contato =>
        contato.nome.toLowerCase().includes(this.filtraBusca.toLowerCase()) ||
        contato.email.toLowerCase().includes(this.filtraBusca.toLowerCase())
      );
    }
    this.ordenaContatosFiltrados();
  }

  ordenaContatos() {
    this.contatoLista.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  ordenaContatosFiltrados() {
    this.contatosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  }
}
