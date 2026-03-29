import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

function passwordMatch(c: AbstractControl) {
  return c.get('newPassword')?.value === c.get('confirmPassword')?.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  auth    = inject(AuthService);
  toast   = inject(ToastService);
  router  = inject(Router);
  fb      = inject(FormBuilder);

  // 3-step flow: 1=enter email+OTP, 2=enter new password, 3=success
  step      = signal(1);
  loading   = signal(false);
  errorMsg  = signal('');
  showPwd   = signal(false);
  showCpwd  = signal(false);
  countdown = signal(0);
  private timer: any;

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp:   ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d{6}$/)]]
  });

  pwdForm = this.fb.group({
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatch });

  get email()    { return this.emailForm.value.email ?? ''; }
  get otp()      { return this.emailForm.value.otp ?? ''; }
  get pwdValue() { return this.pwdForm.get('newPassword')?.value ?? ''; }

  ngOnInit() {
    // Pre-fill email if navigated from forgot-password
    const nav = window.history.state;
    if (nav?.email) this.emailForm.patchValue({ email: nav.email });
    this.startCountdown();
  }

  ngOnDestroy() { clearInterval(this.timer); }

  startCountdown(seconds = 60) {
    clearInterval(this.timer);
    this.countdown.set(seconds);
    this.timer = setInterval(() => {
      this.countdown.update(v => v > 0 ? v - 1 : 0);
      if (this.countdown() === 0) clearInterval(this.timer);
    }, 1000);
  }

  resendOtp() {
    if (this.countdown() > 0 || !this.email) return;
    this.auth.forgotPassword(this.email).subscribe({
      next: () => { this.toast.info('New OTP sent!'); this.startCountdown(); },
      error: () => this.startCountdown()
    });
  }

  verifyOtp() {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next:  () => { this.step.set(2); this.loading.set(false); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Invalid or expired OTP.'); this.loading.set(false); }
    });
  }

  resetPassword() {
    if (this.pwdForm.invalid) { this.pwdForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const { newPassword, confirmPassword } = this.pwdForm.value;
    this.auth.resetPassword(this.email, this.otp, newPassword!, confirmPassword!).subscribe({
      next:  () => { this.step.set(3); this.loading.set(false); },
      error: (err) => { this.errorMsg.set(err.error?.message ?? 'Reset failed. Please try again.'); this.loading.set(false); }
    });
  }

  passwordStrength(): { score: number; label: string; color: string } {
    const p = this.pwdValue;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8)       score++;
    if (/[A-Z]/.test(p))     score++;
    if (/[0-9]/.test(p))     score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map: Record<number, { label: string; color: string }> = {
      0: { label: '', color: '' }, 1: { label: 'Weak', color: '#E8593C' },
      2: { label: 'Fair', color: '#FAC775' }, 3: { label: 'Good', color: '#C9A84C' },
      4: { label: 'Strong', color: '#2A7A4A' }
    };
    return { score, ...map[score] };
  }
}
