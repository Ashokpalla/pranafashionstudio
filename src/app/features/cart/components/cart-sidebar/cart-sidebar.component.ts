import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  cart  = inject(CartService);
  toast = inject(ToastService);

  getEmoji(cat: string): string {
    const m: Record<string, string> = { women:'🪷', men:'👔', western:'✨', kids:'🌟' };
    return m[cat] ?? '👗';
  }

  clearCart() {
    this.cart.clearCart();
    this.toast.info('Cart cleared.');
  }
}
