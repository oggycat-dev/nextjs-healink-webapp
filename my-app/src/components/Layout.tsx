"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useState, useEffect } from "react";
import EnvStatus from "./EnvStatus";

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Podcast", href: "/podcast" },
  { name: "Về chúng tôi", href: "/about" },
  { name: "Gói đăng ký", href: "/subscription" },
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
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isContentCreator, setIsContentCreator] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user has ContentCreator role
  useEffect(() => {
    if (isAuthenticated) {
      const hasCreatorRole = authService.hasRole('ContentCreator');
      setIsContentCreator(hasCreatorRole);
    } else {
      setIsContentCreator(false);
    }
  }, [isAuthenticated]);

  // Detect scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* SVG Filter Definition for Edge-based Liquid Glass Effect */}
      <svg style={{ display: 'none' }}>
        <filter id="header-wavy-liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          {/* Create a fractal noise pattern for wavy distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.03"
            numOctaves="2"
            seed="0"
            result="noise"
          />
          
          {/* Animate the noise for a moving liquid effect */}
          <feOffset dx="0" dy="0" in="noise">
            <animate
              attributeName="baseFrequency"
              from="0.008 0.03"
              to="0.012 0.04"
              dur="80s"
              repeatCount="indefinite"
              keyTimes="0;0.5;1"
              values="0.008 0.03;0.012 0.04;0.008 0.03"
            />
          </feOffset>
          
          {/* Apply blur to the noise for smoother distortion */}
          <feGaussianBlur in="noise" stdDeviation="3" result="blurredNoise" />
          
          {/* Create edge mask for gradient effect */}
          <feComponentTransfer in="SourceGraphic" result="edgeMask">
            <feFuncA type="discrete" tableValues="0 0.1 0.3 0.8 0.3 0.1 0"/>
          </feComponentTransfer>
          
          {/* Use the blurred noise to displace the header content */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distorted"
          />
          
          {/* Additional blur for frosted glass look */}
          <feGaussianBlur in="distorted" stdDeviation="0.3" result="finalBlur" />
        </filter>
      </svg>

      <header 
        className={`sticky top-0 z-50 liquid-glass-header ${isScrolled ? 'scrolled' : ''}`}
      >
        {/* Blur Background Layer - chỉ blur, không có filter */}
        <div className="absolute inset-0 liquid-glass-blur"></div>
        
        {/* Liquid Glass Background Layer - chỉ background color */}
        <div className="absolute inset-0 liquid-glass-bg"></div>
        
        {/* Edge Gradient Overlay - chỉ SVG filter */}
        <div className="absolute inset-0 liquid-glass-edge-gradient"></div>
        
        {/* Header Content - không bị biến dạng */}
        <div className="relative z-10">
          <div className="bg-[#604B3B]/10 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#604B3B] sm:text-xs">
            Hành trình của cảm xúc
          </div>

          <div className="mx-auto w-full max-w-[1440px] px-6 py-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#000000] sm:gap-4 sm:text-sm lg:text-base">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#826B39]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center justify-end gap-3 text-xs font-medium sm:text-sm">
                <Link href="/subscription" className="flex items-center gap-1.5 text-right">
                  <span>Đăng ký</span>
                  <Image src={utilityIcons.cart} alt="Đăng ký" width={22} height={22} />
                </Link>
                <Link href="/podcast" className="flex items-center gap-1.5 text-right">
                  <span>Podcast</span>
                  <Image src={utilityIcons.bag} alt="Podcast" width={22} height={22} />
                </Link>
                
                {isAuthenticated && user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-1.5 text-right hover:text-[#826B39] transition-colors">
                      <span className="max-w-[100px] truncate">{user.fullName || user.email}</span>
                      <Image src={utilityIcons.user} alt="Tài khoản" width={22} height={22} />
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#604B3B]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-3 border-b border-[#604B3B]/10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#604B3B] truncate">{user.fullName}</p>
                            <p className="text-xs text-[#604B3B]/70 truncate">{user.email}</p>
                          </div>
                          {isContentCreator && (
                            <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">Creator</span>
                          )}
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-[#604B3B] hover:bg-[#FBE7BA]/30 transition-colors"
                        >
                          Tài khoản của tôi
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-[#604B3B] hover:bg-[#FBE7BA]/30 transition-colors"
                        >
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          href="/subscription"
                          className="block px-4 py-2 text-sm text-[#604B3B] hover:bg-[#FBE7BA]/30 transition-colors"
                        >
                          Gói đăng ký
                        </Link>
                        {/* Only show for Content Creators - Check JWT role */}
                        {isContentCreator && (
                          <Link
                            href="/creator/dashboard"
                            className="block px-4 py-2 text-sm text-[#604B3B] font-semibold hover:bg-[#FBE7BA]/30 transition-colors border-t border-[#D0BF98]/50 mt-2 pt-2"
                          >
                            Quản lý nội dung của tôi
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/auth" className="flex items-center gap-1.5 text-right hover:text-[#826B39] transition-colors">
                    <span>Đăng nhập</span>
                    <Image src={utilityIcons.user} alt="Tài khoản" width={22} height={22} />
                  </Link>
                )}
              </div>
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
              <Link href="/" className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Image src="/icons/logo.png" alt="Healink logo" width={45} height={45} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#000000]">
                    Healink
                  </p>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#604B3B]">
                    Nuôi dưỡng cảm xúc mỗi ngày
                  </p>
                </div>
              </Link>
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
      
      {/* Environment Status (Development Only) */}
      <EnvStatus />
    </div>
  );
}