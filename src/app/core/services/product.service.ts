import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, ProductFilter, PagedResult } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _loading = signal(false);
  readonly loading  = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    if (filter.category)  params = params.set('category', filter.category);
    if (filter.minPrice)  params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice)  params = params.set('maxPrice', filter.maxPrice);
    if (filter.inStock)   params = params.set('inStock', filter.inStock);
    if (filter.sortBy)    params = params.set('sortBy', filter.sortBy);
    if (filter.search)    params = params.set('search', filter.search);
    if (filter.page)      params = params.set('page', filter.page);
    if (filter.pageSize)  params = params.set('pageSize', filter.pageSize ?? 12);

    this._loading.set(true);
    return this.http.get<PagedResult<Product>>(`${environment.apiUrl}/products`, { params }).pipe(
      tap(() => this._loading.set(false))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/featured`);
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/category/${category}`);
  }

  // Admin only
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }
}
