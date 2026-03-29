import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  route          = inject(ActivatedRoute);
  productService = inject(ProductService);
  cart           = inject(CartService);
  toast          = inject(ToastService);

  product       = signal<Product | null>(null);
  loading       = signal(true);
  selectedSize  = signal('');
  selectedColor = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next:  p  => { this.product.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get categoryGradient(): string {
    const m: Record<string, string> = {
      women: 'linear-gradient(135deg,#FAF0F0,#F5E0E0)',
      men:   'linear-gradient(135deg,#F0F0F8,#E0E0F5)',
      western: 'linear-gradient(135deg,#F0F5FA,#E0EDF5)',
      kids:  'linear-gradient(135deg,#FFF8EC,#FFF0D0)'
    };
    return m[this.product()?.category ?? ''] ?? 'linear-gradient(135deg,#FAF6EE,#F5EDD6)';
  }

  get categoryEmoji(): string {
    const m: Record<string, string> = { women:'🪷', men:'👔', western:'✨', kids:'🌟' };
    return m[this.product()?.category ?? ''] ?? '👗';
  }

  stars() {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(this.product()?.rating ?? 0));
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cart.addItem(p, 1, this.selectedSize() || undefined, this.selectedColor() || undefined);
    this.toast.success(p.name + ' added to cart!');
  }
}
