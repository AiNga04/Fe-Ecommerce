import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-primary font-bold">
                AN
              </div>
              <span className="font-bold text-lg">ZYNA FASHION</span>
            </div>

            <p className="text-sm opacity-90 mb-4">
              Nơi thời trang và phong cách gặp nhau. Chúng tôi mang đến những
              thiết kế mới nhất, chất lượng cao và giá cả hợp lý dành cho mọi
              khách hàng yêu thích thời trang.
            </p>

            <div className="text-sm">
              <p className="font-semibold mb-1">Hotline: 0902 123 456</p>
              <p className="opacity-90">Thủ Đức, TP. Hồ Chí Minh, Việt Nam</p>
              <p className="opacity-90">zyna.fashion@gmail.com</p>
            </div>
          </div>

          {/* Top Category */}
          <div>
            <h3 className="font-semibold mb-4">DANH MỤC NỔI BẬT</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Thời trang nữ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Thời trang nam
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Phụ kiện thời trang
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Giày & Túi xách
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">LIÊN KẾT NHANH</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Yêu thích
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  So sánh sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Theo dõi đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support (REPLACEMENT FOR DOWNLOAD APP) */}
          <div>
            <h3 className="font-semibold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
            <p className="text-sm opacity-90 mb-4">
              Đội ngũ CSKH của ZYNA FASHION luôn sẵn sàng hỗ trợ bạn 24/7 về mọi
              vấn đề mua hàng, đổi trả và tư vấn sản phẩm.
            </p>

            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Điều khoản & dịch vụ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-6 text-sm opacity-90">
              <Facebook className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <Github className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <Instagram className="w-5 h-5 cursor-pointer hover:opacity-100" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-6 text-center text-sm opacity-90">
          <p>&copy; 2025 ZYNA FASHION. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
