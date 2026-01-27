# Phân tích Codebase và Đề xuất Lộ trình Phát triển

## 1. Tổng quan Dự án (Project Overview)

- **Tên dự án**: Ecommerce Frontend
- **Công nghệ chính**:
  - **Framework**: Next.js 16 (App Router), React 19
  - **Ngôn ngữ**: TypeScript
  - **Styling**: Tailwind CSS 4, Radix UI Primitives (Shadcn/UI inspiration)
  - **State Management**: Zustand (Client state), React Query (Server state)
  - **Data Fetching**: Axios (với interceptors xử lý JWT)
  - **Forms**: React Hook Form + Zod
- **Cấu trúc**: Modular, phân chia theo tính năng (features) và layers (components, services, store).

## 2. Đánh giá Hiện trạng (Current State Assessment)

### Đã hoàn thành (Implemented)
- **Hệ thống xác thực (Authentication)**:
  - Trang Đăng nhập (`/auth/login`) và Đăng ký (`/auth/register`) đã hoàn thiện UI/UX.
  - Tích hợp API Backend cho Auth (Login, Register, Refresh Token, User Info).
  - Cơ chế quản lý JWT Token mạnh mẽ với Axios Interceptors (tự động refresh token khi hết hạn 401).
- **Cơ sở hạ tầng (Infrastructure)**:
  - Cấu hình Global State với Zustand (`auth-store`, `loading-store`).
  - Bộ UI Component cơ bản sẵn sàng sử dụng (Button, Input, Drawer, Dialog, Toast, v.v.).
  - Layout cơ bản cho Auth và Main app.

### Chưa hoàn thành (Missing)
- **Tính năng E-commerce cốt lõi**:
  - Chưa có trang hiển thị danh sách sản phẩm (Product List).
  - Chưa có trang chi tiết sản phẩm (Product Detail Page).
  - Chưa có chức năng Giỏ hàng (Cart) và Thanh toán (Checkout).
- **Người dùng (User)**:
  - Chưa có trang quản lý hồ sơ (Profile), lịch sử đơn hàng.
- **Trang chủ (Home Page)**:
  - Hiện tại chỉ là trang placeholder "Hello Next.js".

## 3. Đề xuất Lộ trình Phát triển (Development Roadmap)

Dưới đây là đề xuất các giai đoạn phát triển tiếp theo để hoàn thiện ứng dụng E-commerce:

### Giai đoạn 1: Xây dựng Catalog Sản phẩm (Product Catalog)
**Mục tiêu**: Cho phép người dùng xem và tìm kiếm sản phẩm.
1.  **Trang chủ (Home Page)**:
    -   Thiết kế Banner slider/hero section.
    -   Hiển thị các section: "Sản phẩm mới", "Sản phẩm bán chạy", "Danh mục nổi bật".
2.  **Trang Danh sách Sản phẩm (Product Listing)**:
    -   Hiển thị Grid sản phẩm.
    -   Bộ lọc (Filter) theo: Danh mục, Khoảng giá, Thương hiệu, Đánh giá.
    -   Sắp xếp (Sort) theo: Giá tăng/giảm, Mới nhất.
    -   Phân trang (Pagination) hoặc Infinite Scroll.
3.  **Trang Chi tiết Sản phẩm (Product Detail Page - PDP)**:
    -   Gallery hình ảnh sản phẩm (Zoom, Slider).
    -   Thông tin chi tiết: Tên, Giá, Mô tả, Thông số kỹ thuật.
    -   Lựa chọn biến thể (Size, Color).
    -   Hiển thị đánh giá/bình luận (Reviews).
    -   Sản phẩm liên quan (Related Products).

### Giai đoạn 2: Giỏ hàng & Đặt hàng (Cart & Checkout)
**Mục tiêu**: Cho phép người dùng mua hàng.
1.  **Giỏ hàng (Shopping Cart)**:
    -   Xây dựng `cart-store` (Zustand) để quản lý trạng thái giỏ hàng (Client-side trước, sync với Server sau nếu cần).
    -   UI Slide-over Cart hoặc trang Cart riêng.
    -   Chức năng: Thêm/Sửa số lượng/Xóa sản phẩm, nhập mã giảm giá.
2.  **Thanh toán (Checkout)**:
    -   Flow 3 bước: Thông tin giao hàng -> Phương thức vận chuyển -> Thanh toán.
    -   Tích hợp API đặt hàng (Create Order).
    -   Tích hợp cổng thanh toán (nếu có): VNPAY, Momo, Stripe.

### Giai đoạn 3: Quản lý Tài khoản (User Account)
**Mục tiêu**: Tăng trải nghiệm và giữ chân người dùng.
1.  **Hồ sơ cá nhân (Profile)**:
    -   Cập nhật thông tin, Avatar.
    -   Thay đổi mật khẩu.
2.  **Sổ địa chỉ (Address Book)**:
    -   Thêm/Sửa/Xóa địa chỉ giao hàng mặc định.
3.  **Quản lý Đơn hàng (Order History)**:
    -   Danh sách đơn hàng đã đặt.
    -   Chi tiết đơn hàng & Theo dõi trạng thái vận chuyển.

## 4. Cải tiến Kỹ thuật & Chất lượng (Technical Improvements)

-   **SEO (Search Engine Optimization)**:
    -   Tối ưu Metadata (Title, Description, Open Graph) cho từng trang, đặc biệt là trang Sản phẩm.
    -   Sử dụng JSON-LD Schema Markup cho Product và Breadcrumb.
-   **Performance**:
    -   Tối ưu hình ảnh với `next/image`.
    -   Code splitting và Lazy loading cho các component nặng.
-   **Testing**:
    -   Unit Test: Viết test cho các utility functions và hooks quan trọng (sử dụng Vitest).
    -   E2E Test: Sử dụng Playwright để test các luồng chính (Login -> Add to Cart -> Checkout).
-   **CI/CD**:
    -   Thiết lập GitHub Actions để tự động chạy lint và test trước khi merge PR.

## 5. Kết luận
Dự án đã có một nền tảng kỹ thuật rất tốt (Tech stack hiện đại, cấu trúc clean). Việc tiếp theo là tập trung vào implement các nghiệp vụ cốt lõi của E-commerce theo từng giai đoạn để sớm có sản phẩm MVP (Minimum Viable Product).
