import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  cart  = inject(CartService);
  toast = inject(ToastService);

  get categoryGradient(): string {
    const m: Record<string, string> = {
      women:   'linear-gradient(135deg,#FAF0F0,#F5E0E0)',
      men:     'linear-gradient(135deg,#F0F0F8,#E0E0F5)',
      western: 'linear-gradient(135deg,#F0F5FA,#E0EDF5)',
      kids:    'linear-gradient(135deg,#FFF8EC,#FFF0D0)'
    };
    return m[this.product.category] ?? 'linear-gradient(135deg,#FAF6EE,#F5EDD6)';
  }

  get categoryEmoji(): string {
    const m: Record<string, string> = { women: '🪷', men: '👔', western: '✨', kids: '🌟' };
    return m[this.product.category] ?? '👗';
  }

  stars() {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(this.product.rating));
  }

  addToCart() {
    this.cart.addItem(this.product);
    this.toast.success(this.product.name + ' added to cart!');
  }
}
