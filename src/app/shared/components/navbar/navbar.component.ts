import { Component, inject, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  scrolled = signal(false);
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
  
  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 20); }
}
