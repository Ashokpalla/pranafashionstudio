import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../products/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  enquiryService = inject(EnquiryService);
  toast          = inject(ToastService);
  fb             = inject(FormBuilder);

  featured   = signal<Product[]>([]);
  submitting = signal(false);

  enquiryForm = this.fb.group({
    name:     ['', Validators.required],
    phone:    ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email:    [''],
    category: [''],
    message:  ['', Validators.required]
  });

  categoryCards = [
    { slug: 'women',   emoji: '🪷', name: "Women's Ethnic", desc: 'Sarees · Salwar Kameez · Lehengas · Kurtas' },
    { slug: 'men',     emoji: '👔', name: "Men's Wear",      desc: 'Sherwanis · Kurtas · Formals · Casual' },
    { slug: 'western', emoji: '✨', name: 'Western Wear',    desc: 'Dresses · Tops · Co-ords · Fusion' },
    { slug: 'kids',    emoji: '🌟', name: 'Kids Wear',       desc: 'Ethnic Sets · Party Wear · School Casuals' }
  ];

  values = [
    { icon: '🧵', name: 'Quality First',   desc: 'Premium fabrics, meticulous finishing' },
    { icon: '✦',  name: 'Curated Style',   desc: 'Trend-forward, occasion-ready looks' },
    { icon: '🤝', name: 'Personal Care',   desc: 'Warm, attentive in-store experience' },
    { icon: '💫', name: 'Every Budget',    desc: 'Luxury feel, accessible pricing' }
  ];

  contactInfo = [
    { icon: '📍', label: 'Address',  value: 'D.No: 69-3-19/2, Ground Floor,<br>Rajendra Nagar, Kakinada – 533 002' },
    { icon: '📞', label: 'Phone',    value: '8019304566 &nbsp;|&nbsp; 9492704566' },
    { icon: '✉',  label: 'Email',    value: 'pranafashionstudio2026@gmail.com' }
  ];

  storeHours = [
    { days: 'Monday – Saturday', time: '10:00 AM – 9:00 PM' },
    { days: 'Sunday',            time: '11:00 AM – 7:00 PM' },
    { days: 'Public Holidays',   time: 'By Appointment' }
  ];

  ngOnInit() {
    this.productService.getFeatured().subscribe({
      next:  p  => this.featured.set(p),
      error: () => this.featured.set([])
    });
  }

  submitEnquiry() {
    if (this.enquiryForm.invalid) return;
    this.submitting.set(true);
    const v = this.enquiryForm.value;
    this.enquiryService.send({
      name: v.name!, phone: v.phone!,
      email: v.email ?? undefined,
      category: v.category ?? undefined,
      message: v.message!
    }).subscribe({
      next: () => {
        this.toast.success('Thank you! We will reach out to you shortly. 🙏');
        this.enquiryForm.reset();
        this.submitting.set(false);
      },
      error: () => {
        this.toast.error('Could not send message. Please call us directly.');
        this.submitting.set(false);
      }
    });
  }
}
