# 🪷 Prana Fashion Studio

**Premium Fashion Website — Angular 17 + .NET 8 Web API**

> D.No: 69-3-19/2, Ground Floor, Shon N.2, Rajendra Nagar, Kakinada-2
> 📞 8019304566 | 9492704566
> ✉ pranafashionstudio2026@gmail.com

---

## 📁 Project Structure

```
prana-fashion-studio/
├── src/                          ← Angular Frontend
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/           ← TypeScript interfaces (Product, User, Order, Cart…)
│   │   │   ├── services/         ← auth.service, product.service, cart.service, toast.service
│   │   │   ├── guards/           ← auth.guard, admin.guard
│   │   │   └── interceptors/     ← auth.interceptor (attaches JWT to every request)
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── navbar/       ← Fixed top nav with cart badge + mobile menu
│   │   │       ├── footer/       ← Full footer with links and contact
│   │   │       └── toast/        ← Toast notification system
│   │   └── features/
│   │       ├── home/             ← Landing page (Hero, Categories, Collections, About, Contact)
│   │       ├── products/         ← Product grid, filters, product detail page
│   │       ├── auth/             ← Login & Register pages
│   │       ├── cart/             ← Cart page + slide-over sidebar
│   │       └── account/          ← My Account, My Orders pages
│   ├── environments/             ← environment.ts (dev) + environment.prod.ts
│   └── styles.scss               ← Global styles + CSS variables
│
├── backend/
│   └── PranaFashion.API/
│       ├── Controllers/
│       │   ├── AuthController.cs       ← Register, Login, Refresh Token
│       │   ├── ProductsController.cs   ← CRUD + filter + featured
│       │   ├── OrdersController.cs     ← Place order, My orders, Status update
│       │   └── EnquiriesController.cs  ← Contact form submissions
│       ├── PranaFashion.Core/
│       │   ├── Models/Models.cs        ← Product, User, Order, OrderItem, Enquiry
│       │   └── DTOs/DTOs.cs            ← All request/response DTOs
│       ├── PranaFashion.Infrastructure/
│       │   └── Data/AppDbContext.cs    ← EF Core DbContext + seed data
│       ├── Program.cs                  ← App bootstrap (JWT, CORS, Swagger, EF)
│       └── appsettings.json            ← Connection string, JWT config, Email
│
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- **Angular CLI** 17: `npm install -g @angular/cli`
- **.NET 8 SDK**: https://dotnet.microsoft.com/download
- **SQL Server** (LocalDB / Express is fine for dev)

---

### 1. Frontend — Angular

```bash
# From the project root (prana-fashion-studio/)
npm install
ng serve
# Opens at http://localhost:4200
```

**Environment config** (`src/environments/environment.ts`):
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'   // ← change if .NET runs on different port
};
```

---

### 2. Backend — .NET 8

```bash
cd backend/PranaFashion.API

# Restore packages
dotnet restore

# Update connection string in appsettings.json if needed:
# "DefaultConnection": "Server=localhost;Database=PranaFashionDB;Trusted_Connection=True;TrustServerCertificate=True;"

# Run the API (creates DB automatically on first run)
dotnet run

# API runs at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

**First run** auto-creates the database and seeds 8 demo products via `EnsureCreated()`.

For real migrations:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | `/api/auth/register`  | Create new account       | ❌   |
| POST   | `/api/auth/login`     | Login, get JWT token     | ❌   |
| POST   | `/api/auth/refresh`   | Refresh JWT token        | ❌   |

### Products
| Method | Endpoint                    | Description                          | Auth    |
|--------|-----------------------------|--------------------------------------|---------|
| GET    | `/api/products`             | List all (filter, sort, paginate)    | ❌      |
| GET    | `/api/products/featured`    | Featured products for homepage       | ❌      |
| GET    | `/api/products/category/:c` | Products by category                 | ❌      |
| GET    | `/api/products/:id`         | Single product detail                | ❌      |
| POST   | `/api/products`             | Create product                       | 🔐 Admin |
| PUT    | `/api/products/:id`         | Update product                       | 🔐 Admin |
| DELETE | `/api/products/:id`         | Delete product                       | 🔐 Admin |

#### Query Params for GET /api/products
```
?category=women|men|western|kids
&minPrice=500&maxPrice=5000
&inStock=true
&sortBy=newest|price_asc|price_desc|rating
&search=saree
&page=1&pageSize=12
```

### Orders
| Method | Endpoint                       | Description           | Auth       |
|--------|--------------------------------|-----------------------|------------|
| POST   | `/api/orders`                  | Place a new order     | 🔐 Customer |
| GET    | `/api/orders/my`               | My order history      | 🔐 Customer |
| GET    | `/api/orders/:id`              | Single order details  | 🔐 Customer |
| PATCH  | `/api/orders/:id/status`       | Update order status   | 🔐 Admin   |

### Enquiries
| Method | Endpoint                       | Description           | Auth    |
|--------|--------------------------------|-----------------------|---------|
| POST   | `/api/enquiries`               | Submit contact form   | ❌      |
| GET    | `/api/enquiries`               | All enquiries         | 🔐 Admin |
| PATCH  | `/api/enquiries/:id/resolve`   | Mark as resolved      | 🔐 Admin |

---

## 🎨 Design System

| Token        | Value      | Usage                          |
|--------------|------------|--------------------------------|
| `--gold`     | `#C9A84C`  | Primary accent, CTAs           |
| `--gold-light`| `#E8C97A` | Text on dark backgrounds       |
| `--gold-pale`| `#F5EDD6`  | Backgrounds, cards             |
| `--cream`    | `#FAF6EE`  | Page background                |
| `--ivory`    | `#FDF9F2`  | Card / surface background      |
| `--deep`     | `#1A1208`  | Primary text, dark sections    |
| `--brown`    | `#4A3728`  | Secondary text                 |
| `--muted`    | `#8B7355`  | Placeholder, helper text       |
| `--border`   | `#E2D5B8`  | Card borders, dividers         |

**Fonts:**
- `Cormorant Garamond` — headings, logo, editorial (serif, elegant)
- `Jost` — body text, labels, buttons (clean, modern)

---

## 🗺 Angular Routes

| Route                | Component          | Guard  |
|----------------------|--------------------|--------|
| `/`                  | HomeComponent      | —      |
| `/products`          | ProductsComponent  | —      |
| `/products/:id`      | ProductDetailComponent | —  |
| `/auth/login`        | LoginComponent     | —      |
| `/auth/register`     | RegisterComponent  | —      |
| `/cart`              | CartComponent      | —      |
| `/account`           | AccountComponent   | 🔐 auth |
| `/account/orders`    | OrdersComponent    | 🔐 auth |

---

## 📦 Angular Services

### `AuthService`
- Signals: `user()`, `isLoggedIn()`, `isAdmin()`, `loading()`
- Methods: `login()`, `register()`, `logout()`, `getToken()`
- Persists user + token in `localStorage`

### `CartService`
- Signals: `items()`, `totalItems()`, `subtotal()`, `discount()`, `total()`
- Methods: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Persists cart in `localStorage` via `effect()`

### `ProductService`
- Methods: `getProducts(filter)`, `getProduct(id)`, `getFeatured()`, `getByCategory()`
- Admin: `createProduct()`, `updateProduct()`, `deleteProduct()`

### `ToastService`
- Methods: `success()`, `error()`, `info()`, `warning()`
- Auto-dismisses after 3.5 seconds

---

## 🔐 Security Notes

1. Change the JWT secret in `appsettings.json` before going to production
2. Store secrets in environment variables or Azure Key Vault for production
3. Enable HTTPS in production (`app.UseHttpsRedirection()`)
4. Add rate limiting on auth endpoints
5. Use `appsettings.Development.json` to override connection strings locally

---

## 🔮 Phase 2 — What's Next

- [ ] **Payment Gateway** — Razorpay / PayU integration
- [ ] **Image Upload** — Azure Blob Storage / Cloudinary for product photos
- [ ] **Admin Dashboard** — Manage products, view orders, resolve enquiries
- [ ] **WhatsApp Integration** — Order confirmations via WhatsApp API
- [ ] **Email Notifications** — Order placed / shipped emails via MailKit
- [ ] **Product Reviews** — Rating and review system
- [ ] **Wishlist** — Save products for later
- [ ] **Promo Codes** — Discount coupon system
- [ ] **PWA** — Installable app for mobile customers

---

## 📞 Support

**Prana Fashion Studio**
D.No: 69-3-19/2, Rajendra Nagar, Kakinada-2, A.P.
📞 8019304566 | 9492704566
✉ pranafashionstudio2026@gmail.com

---
*Built with Angular 17 + .NET 8 · Designed for Prana Fashion Studio, Kakinada*
