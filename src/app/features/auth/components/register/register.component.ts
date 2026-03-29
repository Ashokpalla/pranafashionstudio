import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

function passwordMatch(control: AbstractControl) {
  const pw  = control.get('password')?.value;
  const cpw = control.get('confirmPassword')?.value;
  return pw === cpw ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  auth     = inject(AuthService);
  toast    = inject(ToastService);
  router   = inject(Router);
  fb       = inject(FormBuilder);
  showPwd  = signal(false);
  showCpwd = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    phone:           ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatch });

  get pwdValue() { return this.form.get('password')?.value ?? ''; }

  passwordStrength = computed(() => {
    const p = this.pwdValue;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8)  score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map: Record<number, { label: string; color: string }> = {
      0: { label: '', color: '' },
      1: { label: 'Weak', color: '#E8593C' },
      2: { label: 'Fair', color: '#FAC775' },
      3: { label: 'Good', color: '#C9A84C' },
      4: { label: 'Strong', color: '#2A7A4A' }
    };
    return { score, ...map[score] };
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.errorMsg.set('');
    const v = this.form.value;
    this.auth.register({ name: v.name!, email: v.email!, phone: v.phone!, password: v.password!, confirmPassword: v.confirmPassword! })
      .subscribe({
        next:  () => { this.toast.success('Welcome to Prana Fashion Studio! 🪷'); this.router.navigate(['/']); },
        error: (err) => this.errorMsg.set(err.error?.message ?? 'Registration failed. Please try again.')
      });
  }
}
