import Image from "next/image";

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Podcast", href: "/podcast" },
  { name: "Về chúng tôi", href: "/about" },
  { name: "Cửa hàng", href: "#store" },
  { name: "Giỏ hàng", href: "/cart", icon: "cart" },
  { name: "Tài khoản", href: "/auth", icon: "user" },
];

const footerColumns = [
  {
    heading: "AIMER GROUP",
    items: ["Về chúng tôi", "Sản phẩm", "Tư vấn", "Tin tức", "Liên hệ"],
  },
  {
    heading: "Chăm sóc khách hàng",
    items: ["Hỗ trợ khách hàng", "Câu hỏi thường gặp", "Trung tâm trợ giúp", "Góp ý"],
  },
  {
    heading: "LIÊN HỆ VỚI CHÚNG TÔI",
    items: ["Email: healink@gmail.com.vn", "Hotline: 18007200"],
  },
];

const socialLinks = [
  { name: "Facebook", icon: "/icons/facebook.svg", href: "https://www.facebook.com" },
  { name: "Twitter", icon: "/icons/twitter.svg", href: "https://www.twitter.com" },
  { name: "Instagram", icon: "/icons/instagram.svg", href: "https://www.instagram.com" },
  { name: "LinkedIn", icon: "/icons/linkedin.svg", href: "https://www.linkedin.com" },
];

const utilityIcons = {
  cart: "/icons/cart.svg",
  bag: "/icons/bag.svg",
  user: "/icons/user.svg",
  search: "/icons/search.svg",
};

interface LayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
}

export default function Layout({ children, showSearch = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 shadow-sm border-b border-white/20">
        <div className="bg-[#604B3B]/95 backdrop-blur-md py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white sm:text-xs">
          Hành trình của cảm xúc
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-6 py-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="hidden h-[60px] w-[60px] items-center justify-center rounded-xl bg-white lg:flex shadow-sm">
                <Image src="/icons/logo.png" alt="Healink logo" width={45} height={45} />
              </div>
              <div>
                <p className="text-[24px] font-extrabold leading-tight text-[#000000] sm:text-[28px]">
                  Healink
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#604B3B] sm:text-xs">
                  Nuôi dưỡng cảm xúc mỗi ngày
                </p>
              </div>
            </a>

            <nav className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#000000] sm:gap-4 sm:text-sm lg:text-base">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#826B39]"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {showSearch && (
                <form className="flex h-10 w-full items-center gap-2 rounded-full border border-black/20 px-4 sm:w-[280px]">
                  <Image src={utilityIcons.search} alt="Search icon" width={20} height={20} />
                  <input
                    type="search"
                    placeholder="Chủ đề bạn muốn nghe"
                    className="h-full w-full bg-transparent text-sm text-black placeholder:text-[#ACACAC] focus:outline-none"
                  />
                </form>
              )}
              <div className="flex items-center justify-end gap-3 text-xs font-medium sm:text-sm">
                <a href="#store" className="flex items-center gap-1.5 text-right">
                  <span>Cửa hàng</span>
                  <Image src={utilityIcons.cart} alt="Cửa hàng" width={22} height={22} />
                </a>
                <a href="/cart" className="flex items-center gap-1.5 text-right">
                  <span>Giỏ hàng</span>
                  <Image src={utilityIcons.bag} alt="Giỏ hàng" width={22} height={22} />
                </a>
                <a href="/auth" className="flex items-center gap-1.5 text-right">
                  <span>Tài khoản</span>
                  <Image src={utilityIcons.user} alt="Tài khoản" width={22} height={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1440px] px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <a href="/" className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Image src="/icons/healink-chain-logo.svg" alt="Healink logo" width={45} height={45} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#000000]">
                    Healink
                  </p>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#604B3B]">
                    Nuôi dưỡng cảm xúc mỗi ngày
                  </p>
                </div>
              </a>
              <p className="max-w-[300px] text-sm leading-6 text-black/80">
                Healink là không gian an yên, nơi mỗi người được lắng nghe, thực hành chánh niệm và tìm lại sự cân bằng cảm xúc thông qua podcast, postcard và các hoạt động cộng đồng.
              </p>
              <form className="flex w-full max-w-[373px] flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Địa chỉ email"
                  className="h-11 flex-1 rounded-full border border-black/30 px-5 text-sm placeholder:text-[#717171] focus:outline-none focus:ring-2 focus:ring-[#604B3B]"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-[#000000] px-6 text-sm font-semibold uppercase tracking-widest text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Đăng ký
                </button>
              </form>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition-transform duration-200 hover:-translate-y-0.5"
                    aria-label={social.name}
                  >
                    <Image src={social.icon} alt={social.name} width={20} height={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid flex-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.heading} className="space-y-4 text-left">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#604B3B]">
                      {column.heading}
                    </h3>
                    <div className="mt-2 h-[3px] w-10 bg-[#604B3B]" aria-hidden="true" />
                  </div>
                  <ul className="space-y-2 text-sm leading-6 text-black/80">
                    {column.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 py-6">
          <p className="px-6 text-center text-xs text-black/60">
            Việc sử dụng trang web này cho thấy bạn tuân thủ chính sách quyền riêng tư, điều khoản và điều kiện của chúng tôi.
          </p>
        </div>
      </footer>
    </div>
  );
}