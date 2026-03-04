<p align="center">
  <img src="public/images/logo.png" alt="Zyna Fashion Logo" width="200" />
</p>

<h1 align="center">🛍️ Zyna Fashion — E-Commerce Frontend</h1>

<p align="center">
  <strong>Nền tảng thương mại điện tử thời trang cao cấp</strong><br/>
  Xây dựng trên Next.js 16 · React 19 · TypeScript 5.9 · TailwindCSS 4
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0.4-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc tổng quan](#-kiến-trúc-tổng-quan)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Tính năng chi tiết](#-tính-năng-chi-tiết)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Biến môi trường](#-biến-môi-trường)
- [API Services](#-api-services)
- [Phân quyền & Bảo mật](#-phân-quyền--bảo-mật)
- [Tác giả](#-tác-giả)

---

## 🎯 Giới thiệu

**Zyna Fashion** là một nền tảng thương mại điện tử (E-Commerce) chuyên về thời trang, được xây dựng với kiến trúc hiện đại, giao diện premium và trải nghiệm người dùng mượt mà. Hệ thống hỗ trợ đầy đủ các vai trò: **Khách hàng**, **Nhân viên (Staff)**, **Quản trị viên (Admin)**, và **Nhân viên giao hàng (Shipper)**.

### Highlights

- 🎨 **Giao diện Premium** — Thiết kế hiện đại với animations, glassmorphism, dark/light mode
- 🔐 **Phân quyền RBAC** — Role-Based Access Control cho 4 vai trò khác nhau
- 📱 **Responsive Design** — Tối ưu cho mọi kích thước màn hình
- ⚡ **Server-Side Rendering** — Tận dụng Next.js App Router cho hiệu năng tốt nhất
- 📊 **Dashboard Analytics** — Biểu đồ doanh thu, đơn hàng, thống kê realtime
- 🌐 **Vietnamese Localization** — Giao diện tiếng Việt hoàn toàn

---

## 🏗️ Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js 16)          │
│                                                  │
│   ┌──────────┐  ┌───────┐  ┌────────┐  ┌──────┐│
│   │  (main)  │  │(admin)│  │ (staff)│  │(ship)││
│   │  Public  │  │ Admin │  │ Staff  │  │ per  ││
│   │  Pages   │  │ Panel │  │ Portal │  │ App  ││
│   └────┬─────┘  └───┬───┘  └───┬────┘  └──┬───┘│
│        │            │          │           │     │
│   ┌────▼────────────▼──────────▼───────────▼───┐│
│   │          Services Layer (Axios + HTTP)      ││
│   └────────────────────┬───────────────────────┘│
└────────────────────────┼────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────┐
│              Backend (Spring Boot)               │
│              PostgreSQL · Redis                  │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Công nghệ sử dụng

### Core Framework

| Công nghệ       | Phiên bản | Mô tả                                      |
| --------------- | --------- | ------------------------------------------ |
| **Next.js**     | `16.0.4`  | React meta-framework, App Router, SSR/SSG  |
| **React**       | `19.2.0`  | Thư viện UI, React Compiler được kích hoạt |
| **TypeScript**  | `5.9.3`   | Type-safe development                      |
| **TailwindCSS** | `4.1.17`  | Utility-first CSS framework                |

### State Management & Data Fetching

| Công nghệ                      | Mô tả                                             |
| ------------------------------ | ------------------------------------------------- |
| **TanStack React Query** `5.x` | Server state, caching, auto-refetching            |
| **Zustand** `5.x`              | Client state management (sidebar, local UI)       |
| **React Hook Form** `7.x`      | Form handling performant, uncontrolled components |
| **Zod** `4.x`                  | Schema validation & type inference                |

### UI & Design

| Công nghệ                | Mô tả                                                             |
| ------------------------ | ----------------------------------------------------------------- |
| **Radix UI**             | Headless, accessible UI primitives (Dialog, Select, Accordion...) |
| **Framer Motion** `12.x` | Animations, page transitions, scroll effects                      |
| **Lucide React**         | Icon library (550+ icons)                                         |
| **Recharts** `3.x`       | Biểu đồ (AreaChart, BarChart, PieChart) cho Dashboard             |
| **Sonner**               | Toast notifications                                               |
| **cmdk**                 | Command palette component                                         |
| **Vaul**                 | Drawer component cho mobile                                       |

### Utilities

| Công nghệ                     | Mô tả                                       |
| ----------------------------- | ------------------------------------------- |
| **Axios**                     | HTTP client với interceptors, refresh token |
| **date-fns**                  | Xử lý ngày giờ, locale tiếng Việt           |
| **clsx** + **tailwind-merge** | Conditional class merging                   |
| **class-variance-authority**  | Component variants (Button, Badge...)       |
| **xlsx**                      | Xuất file Excel cho báo cáo                 |

---

## ✨ Tính năng chi tiết

### 🛒 Trang Khách hàng `(main)`

| Tính năng              | Mô tả                                                      |
| ---------------------- | ---------------------------------------------------------- |
| **Trang chủ**          | Hero banner, sản phẩm nổi bật, danh mục, ưu đãi            |
| **Danh sách sản phẩm** | Lọc theo danh mục, kích thước, giá — phân trang            |
| **Chi tiết sản phẩm**  | Gallery ảnh, chọn size, đánh giá, sản phẩm liên quan       |
| **Giỏ hàng**           | Thêm/xóa/cập nhật số lượng, áp mã voucher                  |
| **Thanh toán**         | Checkout flow, chọn địa chỉ, phương thức thanh toán        |
| **Hồ sơ cá nhân**      | Thông tin, lịch sử đơn hàng, quản lý địa chỉ, đổi mật khẩu |
| **Liên hệ**            | Form hỗ trợ, bản đồ, mạng xã hội, FAQ                      |
| **Giới thiệu**         | Câu chuyện thương hiệu, tầm nhìn, CTA                      |

### 👔 Staff Portal `(staff)`

| Tính năng            | Mô tả                                             |
| -------------------- | ------------------------------------------------- |
| **Dashboard**        | Thống kê tổng quan, biểu đồ đơn hàng              |
| **Quản lý Đơn hàng** | Xem, cập nhật trạng thái đơn hàng                 |
| **Quản lý Sản phẩm** | Xem chi tiết sản phẩm (read-only), điều chỉnh kho |
| **Quản lý Kho**      | Theo dõi tồn kho, điều chỉnh stock                |
| **Đánh giá**         | Kiểm duyệt, ẩn/hiện, xóa đánh giá                 |
| **Hỗ trợ**           | Xem & phản hồi yêu cầu hỗ trợ từ khách hàng       |
| **Voucher**          | Quản lý mã giảm giá                               |
| **Người dùng**       | Xem danh sách khách hàng                          |

### 🔧 Admin Panel `(admin)`

| Tính năng               | Mô tả                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| **Dashboard Analytics** | Biểu đồ doanh thu (AreaChart), đơn hàng (BarChart), date-range filter |
| **Quản lý Sản phẩm**    | CRUD đầy đủ, upload ảnh, gallery, bảng size                           |
| **Quản lý Danh mục**    | Tạo/sửa/xóa danh mục sản phẩm                                         |
| **Quản lý Đơn hàng**    | Toàn quyền xử lý đơn hàng                                             |
| **Quản lý Kho**         | Nhập/xuất kho, lịch sử điều chỉnh                                     |
| **Quản lý Người dùng**  | CRUD users, phân quyền vai trò                                        |
| **Đánh giá**            | Kiểm duyệt nội dung, xử lý báo cáo                                    |
| **Voucher**             | Tạo/sửa/xóa mã giảm giá                                               |
| **Kích thước**          | Quản lý bảng kích thước, size guide                                   |
| **Hỗ trợ & Khiếu nại**  | Phân công, phản hồi, ghi chú nội bộ                                   |
| **Cài đặt**             | Cấu hình hệ thống                                                     |

### 🚚 Shipper App `(shipper)`

| Tính năng             | Mô tả                                   |
| --------------------- | --------------------------------------- |
| **Dashboard**         | Tổng quan đơn cần giao                  |
| **Quản lý Giao hàng** | Nhận đơn, cập nhật trạng thái giao hàng |
| **Lịch sử**           | Xem lịch sử các đơn đã giao             |
| **Hồ sơ**             | Thông tin cá nhân shipper               |

### 🔐 Xác thực `(auth)`

| Tính năng         | Mô tả                         |
| ----------------- | ----------------------------- |
| **Đăng nhập**     | Email/Password authentication |
| **Đăng ký**       | Tạo tài khoản mới             |
| **Quên mật khẩu** | Reset password flow           |

---

## 📁 Cấu trúc thư mục

```
ecommerce-fe/
├── public/                    # Static assets (images, favicon)
│   └── images/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (main)/            # 🛒 Trang công khai (Khách hàng)
│   │   │   ├── page.tsx       #    Trang chủ
│   │   │   ├── products/      #    Danh sách & chi tiết sản phẩm
│   │   │   ├── carts/         #    Giỏ hàng
│   │   │   ├── checkout/      #    Thanh toán
│   │   │   ├── profile/       #    Hồ sơ cá nhân
│   │   │   ├── contact/       #    Liên hệ
│   │   │   └── about/         #    Giới thiệu
│   │   ├── (admin)/admin/     # 🔧 Admin Panel
│   │   │   ├── page.tsx       #    Dashboard
│   │   │   ├── products/      #    Quản lý sản phẩm
│   │   │   ├── orders/        #    Quản lý đơn hàng
│   │   │   ├── users/         #    Quản lý người dùng
│   │   │   ├── reviews/       #    Quản lý đánh giá
│   │   │   ├── vouchers/      #    Quản lý voucher
│   │   │   ├── inventory/     #    Quản lý kho
│   │   │   ├── support/       #    Hỗ trợ & khiếu nại
│   │   │   └── ...
│   │   ├── (staff)/staff/     # 👔 Staff Portal
│   │   │   ├── dashboard/     #    Dashboard nhân viên
│   │   │   ├── orders/        #    Xử lý đơn hàng
│   │   │   ├── products/      #    Xem sản phẩm
│   │   │   ├── inventory/     #    Quản lý tồn kho
│   │   │   └── ...
│   │   ├── (shipper)/shipper/ # 🚚 Shipper App
│   │   │   ├── dashboard/     #    Dashboard giao hàng
│   │   │   ├── shipments/     #    Quản lý đơn giao
│   │   │   └── history/       #    Lịch sử giao hàng
│   │   ├── (auth)/            # 🔐 Xác thực
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       └── forgot-password/
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # React Query, Theme providers
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── ui/                # 🧩 Shadcn/ui components (31 components)
│   │   ├── common/            # Header, Footer, LoadingOverlay
│   │   ├── layout/            # Sidebar, AdminLayout
│   │   ├── home/              # Trang chủ components
│   │   ├── product/           # Product card, detail, gallery
│   │   ├── admin/             # Admin-specific components
│   │   ├── staff/             # Staff-specific components
│   │   ├── shipper/           # Shipper components
│   │   ├── auth/              # Login, Register forms
│   │   ├── orders/            # Order components
│   │   ├── reviews/           # Review components
│   │   ├── contact/           # Contact page components
│   │   ├── about/             # About page components
│   │   ├── profile/           # Profile components
│   │   ├── vouchers/          # Voucher management
│   │   └── inventory/         # Inventory components
│   ├── services/              # 📡 API service layer (16 modules)
│   │   ├── auth.ts            # Xác thực (login, register, refresh)
│   │   ├── product.ts         # CRUD sản phẩm
│   │   ├── order.ts           # Quản lý đơn hàng
│   │   ├── cart.ts            # Giỏ hàng
│   │   ├── payment.ts         # Thanh toán
│   │   ├── review.ts          # Đánh giá
│   │   ├── user.ts            # Quản lý người dùng
│   │   ├── voucher.ts         # Mã giảm giá
│   │   ├── inventory.ts       # Quản lý kho
│   │   ├── shipment.ts        # Giao hàng
│   │   ├── support.ts         # Hỗ trợ khách hàng
│   │   ├── category.ts        # Danh mục
│   │   ├── size.ts            # Kích thước
│   │   ├── size-guide.ts      # Bảng quy đổi size
│   │   ├── address.ts         # Địa chỉ giao hàng
│   │   └── dashboard.ts       # Dashboard analytics
│   ├── lib/                   # 🔧 Utilities
│   │   ├── http.ts            # Axios instance, interceptors, refresh token
│   │   ├── auth-cookies.ts    # Cookie management
│   │   ├── query-client.ts    # TanStack Query config
│   │   ├── refresh-token-client.ts
│   │   └── utils.ts           # Helper functions (cn, getImageUrl...)
│   ├── types/                 # 📐 TypeScript type definitions
│   └── store/                 # 🗃️ Zustand stores
│       └── use-sidebar-store.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 💻 Yêu cầu hệ thống

| Yêu cầu         | Phiên bản                                                |
| --------------- | -------------------------------------------------------- |
| **Node.js**     | `>= 18.x` (khuyến nghị `20.x` trở lên)                   |
| **npm**         | `>= 9.x` hoặc **yarn** `>= 1.22.x`                       |
| **Backend API** | Spring Boot đang chạy (mặc định `http://localhost:8080`) |

---

## 🚀 Cài đặt & Chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/your-username/ecommerce-fe.git
cd ecommerce-fe
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:8080
```

### 4. Chạy ở chế độ Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### 5. Build Production

```bash
npm run build
npm start
```

### 6. Kiểm tra linting

```bash
npm run lint
```

---

## 🔑 Biến môi trường

| Biến                         | Mô tả                          | Mặc định                       |
| ---------------------------- | ------------------------------ | ------------------------------ |
| `NEXT_PUBLIC_API_URL`        | URL của Backend REST API       | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_IMAGE_BASE_URL` | URL base cho hiển thị hình ảnh | `http://localhost:8080`        |

---

## 📡 API Services

Tầng service được tổ chức theo module, mỗi file tương ứng với một domain:

| Service        | Endpoint Base                      | Mô tả                                     |
| -------------- | ---------------------------------- | ----------------------------------------- |
| `auth.ts`      | `/auth/*`                          | Đăng nhập, đăng ký, refresh token, logout |
| `product.ts`   | `/products/*`, `/admin/products/*` | CRUD sản phẩm, upload ảnh, gallery        |
| `order.ts`     | `/orders/*`, `/admin/orders/*`     | Tạo/quản lý đơn hàng                      |
| `cart.ts`      | `/cart/*`                          | Thêm, xóa, cập nhật giỏ hàng              |
| `payment.ts`   | `/payment/*`                       | Xử lý thanh toán                          |
| `review.ts`    | `/reviews/*`, `/admin/reviews/*`   | Đánh giá, báo cáo, kiểm duyệt             |
| `user.ts`      | `/users/*`, `/admin/users/*`       | Quản lý tài khoản, phân quyền             |
| `voucher.ts`   | `/vouchers/*`                      | Mã giảm giá                               |
| `inventory.ts` | `/admin/inventory/*`               | Nhập/xuất kho, lịch sử                    |
| `shipment.ts`  | `/shipments/*`                     | Quản lý giao hàng                         |
| `support.ts`   | `/support/*`, `/admin/support/*`   | Hỗ trợ khách hàng                         |
| `category.ts`  | `/categories/*`                    | Danh mục sản phẩm                         |
| `dashboard.ts` | `/admin/dashboard/*`               | Thống kê, analytics                       |

### HTTP Client (`lib/http.ts`)

- **Axios Instance** với base URL từ env
- **Request Interceptor**: Tự động gắn `Authorization: Bearer <token>`
- **Response Interceptor**: Tự động refresh token khi nhận 401
- **Token Refresh Queue**: Xử lý race condition khi nhiều request cùng bị 401

---

## 🔐 Phân quyền & Bảo mật

### Vai trò (Roles)

| Vai trò      | Route Group | Mô tả                                          |
| ------------ | ----------- | ---------------------------------------------- |
| **CUSTOMER** | `(main)`    | Duyệt sản phẩm, đặt hàng, đánh giá             |
| **STAFF**    | `(staff)`   | Xử lý đơn hàng, quản lý kho, hỗ trợ khách hàng |
| **ADMIN**    | `(admin)`   | Toàn quyền quản trị hệ thống                   |
| **SHIPPER**  | `(shipper)` | Nhận và giao đơn hàng                          |

### Cơ chế bảo mật

- **JWT Authentication** — Access token + Refresh token
- **Cookie-based Storage** — Token lưu trong HTTP-only cookies
- **Auto Refresh** — Tự động refresh token khi hết hạn
- **Route Protection** — Middleware kiểm tra quyền truy cập theo vai trò
- **Layout Guard** — Mỗi route group có layout riêng kiểm tra authentication

---

## 👤 Tác giả

**Ngã Trương (Zyna)**

- 🌐 Facebook: [truong.ai.nga.2025](https://www.facebook.com/truong.ai.nga.2025/)
- 📸 Instagram: [@ainga_76](https://www.instagram.com/ainga_76)
- 💼 LinkedIn: [Nga Trương](https://www.linkedin.com/in/nga-tr%C6%B0%C6%A1ng-bb62202ab/)
- 🎵 TikTok: [@zyna2k4](https://www.tiktok.com/@zyna2k4)

---

<p align="center">
  <sub>Built with ❤️ using Next.js, React & TailwindCSS</sub><br/>
  <sub>© 2026 Zyna Fashion. All rights reserved.</sub>
</p>
