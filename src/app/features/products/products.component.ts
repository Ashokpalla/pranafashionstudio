import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory, ProductFilter } from '../../core/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  route          = inject(ActivatedRoute);

  products   = signal<Product[]>([]);
  filterOpen = signal(false);

  activeCategory: ProductCategory | '' = '';
  sortBy      = 'newest';
  minPrice    = 0;
  maxPrice    = 0;
  inStockOnly = false;

  categories = [
    { slug: 'women'   as ProductCategory, name: "Women's Ethnic" },
    { slug: 'men'     as ProductCategory, name: "Men's Wear"      },
    { slug: 'western' as ProductCategory, name: 'Western Wear'    },
    { slug: 'kids'    as ProductCategory, name: 'Kids Wear'       }
  ];

  pageTitle = computed(() => {
    const found = this.categories.find(c => c.slug === this.activeCategory);
    return found ? found.name : 'All Collections';
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.activeCategory = params['category'];
      this.applyFilter();
    });
  }

  applyFilter() {
    const filter: ProductFilter = {
      category: this.activeCategory || undefined,
      sortBy: this.sortBy as any,
      inStock: this.inStockOnly || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined
    };
    this.productService.getProducts(filter).subscribe({
      next:  r  => this.products.set(r.items),
      error: () => this.products.set([])
    });
  }

  resetFilters() {
    this.activeCategory = '';
    this.sortBy = 'newest';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.inStockOnly = false;
    this.applyFilter();
    this.filterOpen.set(false);
  }
}
