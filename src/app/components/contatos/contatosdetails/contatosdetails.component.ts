import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Contato } from '../../../models/contato';
import { ActivatedRoute, Router } from '@angular/router';
import { ContatoService } from '../../../services/contato.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contatosdetails',
  standalone: true,
  imports: [MdbFormsModule,FormsModule],
  templateUrl: './contatosdetails.component.html',
  styleUrl: './contatosdetails.component.scss'
})
export class ContatosdetailsComponent {

  @Input("contato") contato: Contato = new Contato();
  @Output("retorno") retorno = new EventEmitter<any>();

  routerParam = inject(ActivatedRoute);
  router = inject(Router);

  contatoService = inject(ContatoService);

  constructor() {
    let id = this.routerParam.snapshot.params['id'];
    if(id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.contatoService.findById(id).subscribe({
      next: contatoBack => {
        this.contato = contatoBack;
      },
      error: erro => {
        Swal.fire({
          title: 'Ocorreu um erro',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
  }

  save() {
    if(this.contato.id > 0) {

      this.contatoService.update(this.contato, this.contato.id).subscribe({
        next: mensagem => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.router.navigate(['admin/contatos'], { state: { contatoEditado: this.contato } });
          this.retorno.emit(this.contato);
        },
        error: erro => {
          Swal.fire({
            title: 'Ocorreu um erro',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      });

    } else {

      this.contatoService.save(this.contato).subscribe({
        next: mensagem => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.router.navigate(['admin/contatos'], { state: { contatoNovo: this.contato } });
          this.retorno.emit(this.contato);
        },
        error: erro => {
          Swal.fire({
            title: 'Ocorreu um erro',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      });
    }

  }
}
