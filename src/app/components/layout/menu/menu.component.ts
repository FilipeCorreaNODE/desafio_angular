import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MdbCollapseModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {


  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout();
      this.router.navigate(['/login']);
  }

}
