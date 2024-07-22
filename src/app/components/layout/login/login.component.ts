import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  usuario!: string;
  senha!: string;

  constructor(private authService: AuthService, private router: Router) {}

  logar() {
    if(this.usuario == 'admin' && this.senha == 'admin') {
      this.authService.login();
      this.router.navigate(['admin/contatos']);
    } else
    alert('Usuário ou senha estão incorretos!');
  }

}
