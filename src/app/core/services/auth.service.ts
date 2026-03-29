import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'prana_token';
  private readonly USER_KEY  = 'prana_user';

  private _user    = signal<User | null>(this.loadUser());
  private _loading = signal(false);

  readonly user       = this._user.asReadonly();
  readonly loading    = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin    = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest) {
    this._loading.set(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap(res => { this.saveSession(res); this._loading.set(false); }),
      catchError(err => { this._loading.set(false); return throwError(() => err); })
    );
  }

  register(data: RegisterRequest) {
    this._loading.set(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(res => { this.saveSession(res); this._loading.set(false); }),
      catchError(err => { this._loading.set(false); return throwError(() => err); })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post<{ message: string; valid: boolean }>(`${environment.apiUrl}/auth/verify-otp`, { email, otp });
  }

  resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/reset-password`, { email, otp, newPassword, confirmPassword });
  }

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/change-password`, { currentPassword, newPassword, confirmPassword });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  refreshToken() {
    const token = this.getToken();
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { token });
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private loadUser(): User | null {
    try { const raw = localStorage.getItem(this.USER_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }
}
