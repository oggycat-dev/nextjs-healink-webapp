import Image from "next/image";

const navLinks = [
  { label: "Trang chủ", href: "#" },
  { label: "Podcast", href: "#podcast" },
  { label: "Về chúng tôi", href: "#about" },
  { label: "Tin tức", href: "#news" },
  { label: "Liên hệ", href: "#contact" },
];

const mindfulHighlights = [
  {
    title: "Khoảnh khắc chánh niệm",
    description: "Đón nhận sự bình yên và tích cực mỗi ngày.",
  },
  {
    title: "Khoảnh khắc chánh niệm",
    description: "Đón nhận sự bình yên và tích cực mỗi ngày.",
  },
  {
    title: "Khoảnh khắc chánh niệm",
    description: "Đón nhận sự bình yên và tích cực mỗi ngày.",
  },
];

const communityHighlights = [
  {
    title: "Podcast chữa lành",
    description: "Những câu chuyện thực tế giúp bạn vững tin hơn mỗi ngày.",
  },
  {
    title: "Thẻ cảm hứng",
    description: "Nhắc nhở nhỏ nuôi dưỡng lòng biết ơn và sự tử tế.",
  },
  {
    title: "Workshop trực tuyến",
    description: "Kết nối cùng chuyên gia để hiểu bản thân sâu sắc hơn.",
  },
  {
    title: "Cộng đồng sẻ chia",
    description: "Cùng nhau viết thư, ghi nhật ký và trao đi lời động viên.",
  },
];

const planFeatures = [
  { key: "podcast", label: "Nghe podcast" },
  { key: "noAds", label: "Không quảng cáo" },
  { key: "flashcard", label: "Flashcard to podcast" },
  { key: "journal", label: "Viết thư - nhật kí cảm xúc" },
  { key: "personal", label: "Đang tải podcast cá nhân" },
];

const plans = [
  {
    name: "Freemium",
    priceLabel: "Truy cập cảm hứng",
    price: "Free",
    accent: {
      background: "bg-[#FBE7BA]",
      text: "text-black",
      shadow: "shadow-[0_15px_40px_rgba(130,107,57,0.15)]",
      cta: "bg-[#826B39] text-white hover:bg-[#6d572f]",
    },
    features: {
      podcast: true,
      noAds: false,
      flashcard: false,
      journal: false,
      personal: false,
    },
  },
  {
    name: "Premium Individuals",
    priceLabel: "59.000 VND/Tháng",
    price: "Nhận ưu đãi",
    accent: {
      background: "bg-[#B99B5C]",
      text: "text-white",
      shadow: "shadow-[0_25px_50px_rgba(0,0,0,0.25)]",
      cta: "bg-white text-[#604B3B] hover:bg-[#FBE7BA]",
    },
    features: {
      podcast: true,
      noAds: true,
      flashcard: true,
      journal: true,
      personal: false,
    },
  },
  {
    name: "Freemium Channel",
    priceLabel: "89.000 VND/Tháng",
    price: "Nhận ưu đãi",
    accent: {
      background: "bg-[#FBE7BA]",
      text: "text-black",
      shadow: "shadow-[0_15px_40px_rgba(130,107,57,0.15)]",
      cta: "bg-[#826B39] text-white hover:bg-[#6d572f]",
    },
    features: {
      podcast: true,
      noAds: true,
      flashcard: true,
      journal: true,
      personal: true,
    },
  },
];

const footerColumns = [
  {
    heading: "AIMER GROUP",
    items: ["Về chúng tôi", "Sản phẩm", "Tư vấn", "Tin tức", "Liên hệ"],
  },
  {
    heading: "Chăm sóc khách hàng",
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

const iconMap = {
  check: "/icons/check.svg",
  close: "/icons/close.svg",
};

const utilityIcons = {
  cart: "/icons/cart.svg",
  bag: "/icons/bag.svg",
  user: "/icons/user.svg",
  search: "/icons/search.svg",
};

export default function Homepage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header>
        <div className="bg-[#604B3B] py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white sm:text-sm">
          Hành trình của cảm xúc
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-6 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden h-[98px] w-[105px] items-center justify-center rounded-2xl bg-[#BFAC83] lg:flex">
                <Image src="/icons/logo.png" alt="Healink icon" width={48} height={48} />
              </div>
              <div>
                <p className="text-[32px] font-extrabold leading-tight text-[#000000] sm:text-[40px]">
                  Healink
                </p>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#604B3B]">
                  Nuôi dưỡng cảm xúc mỗi ngày
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[#000000] sm:gap-6 sm:text-base lg:text-lg">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#826B39]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <form className="flex h-12 w-full items-center gap-3 rounded-full border border-black/20 px-5 sm:w-[320px]">
                <Image src={utilityIcons.search} alt="Search icon" width={20} height={20} />
                <input
                  type="search"
                  placeholder="Chủ đề bạn muốn nghe"
                  className="h-full w-full bg-transparent text-sm text-black placeholder:text-[#ACACAC] focus:outline-none"
                />
              </form>
              <div className="flex items-center justify-end gap-4 text-sm font-medium sm:text-base">
                <a href="#store" className="flex items-center gap-2 text-right">
                  <span>Cửa hàng</span>
                  <Image src={utilityIcons.cart} alt="Cửa hàng" width={28} height={28} />
                </a>
                <a href="#cart" className="flex items-center gap-2 text-right">
                  <span>Giỏ hàng</span>
                  <Image src={utilityIcons.bag} alt="Giỏ hàng" width={28} height={28} />
                </a>
                <a href="/auth" className="flex items-center gap-2 text-right">
                  <span>Tài khoản</span>
                  <Image src={utilityIcons.user} alt="Tài khoản" width={28} height={28} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section
          id="hero"
          className="relative isolate overflow-hidden bg-[#5A452F] text-white"
        >
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/hero-texture.svg"
              alt="Healink texture background"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          </div>

          <div className="absolute right-0 top-0 hidden h-full w-full max-w-[520px] lg:block">
            <div className="relative h-full w-full">
              <Image
                src="/images/hero-portrait.svg"
                alt="Người đang thực hành chánh niệm"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#5A452F] via-transparent to-transparent" aria-hidden="true" />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-20 md:flex-row md:items-center md:py-28">
            <div className="max-w-xl space-y-6">
              <span className="block text-6xl font-bold leading-none text-white/70 sm:text-7xl" aria-hidden="true">
                “
              </span>
              <h1 className="text-4xl font-semibold leading-snug sm:text-5xl md:text-6xl">
                Nuôi dưỡng tâm hồn bằng cảm hứng mỗi ngày
              </h1>
              <p className="text-base font-light leading-relaxed text-white/80 sm:text-lg">
                Healink là không gian an yên, nơi mỗi người được lắng nghe, thực hành chánh niệm và tìm lại sự cân bằng cảm xúc thông qua podcast, postcard và các hoạt động cộng đồng.
              </p>
              <div className="pt-2">
                <a
                  href="#podcast"
                  className="inline-flex items-center justify-center rounded-full bg-[#826B39] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#6d572f] sm:text-base"
                >
                  Nghe ngay
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#BFAC83] py-12" id="podcast">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {mindfulHighlights.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="flex flex-col items-center rounded-3xl bg-white/40 px-8 py-6 text-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm"
                >
                  <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-[#2B3F6C]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#1E1E1E] sm:text-base">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FBE7BA] py-16" id="about">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-6 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#1E1E1E] sm:text-3xl md:text-4xl">
                Tham gia cộng đồng Healink và kết nối với những người đồng hành
              </h2>
              <p className="text-sm text-[#1E1E1E]/80 sm:text-base">
                Một cộng đồng biết lắng nghe, thấu hiểu và chia sẻ những hành trình chữa lành chân thành.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {communityHighlights.map((item) => (
                <article
                  key={item.title}
                  className="flex h-full flex-col justify-between rounded-[38px] bg-[#D0BF98] px-6 py-8 text-left shadow-[0_18px_40px_rgba(0,0,0,0.15)]"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[#1E1E1E]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#1E1E1E]/80">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.3em] text-[#604B3B]">
                    Khám phá
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="plans">
          <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-10 px-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#1E1E1E] sm:text-3xl md:text-[32px]">
                Chọn gói đăng ký của bạn
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex h-full flex-col justify-between rounded-[40px] p-8 ${plan.accent.background} ${plan.accent.text} ${plan.accent.shadow}`}
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase">{plan.name}</h3>
                    <p className="text-2xl font-light leading-tight sm:text-[28px]">
                      {plan.priceLabel}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-4 text-sm sm:text-base">
                    {planFeatures.map((feature) => {
                      const available = plan.features[feature.key as keyof typeof plan.features];

                      return (
                        <li key={`${plan.name}-${feature.key}`} className="flex items-center gap-3">
                          <Image
                            src={available ? iconMap.check : iconMap.close}
                            alt={available ? "Tính năng khả dụng" : "Tính năng chưa khả dụng"}
                            width={20}
                            height={20}
                          />
                          <span className={`font-medium ${available ? "" : "opacity-80"}`}>
                            {feature.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="pt-8">
                    <a
                      href="#register"
                      className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-widest transition-colors duration-200 ${plan.accent.cta}`}
                    >
                      {plan.price}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white" id="contact">
        <div className="border-t border-black/10">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 py-16 lg:flex-row lg:justify-between">
            <div className="max-w-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#604B3B]">
                  Kết nối với chúng tôi
                </h3>
                <div className="mt-2 h-[3px] w-10 bg-[#604B3B]" aria-hidden="true" />
              </div>
              <p className="text-[40px] font-extrabold leading-tight text-[#000000]">Healink</p>
              <p className="text-sm leading-6 text-black/70">
                Hãy để lại email của bạn để nhận những thông tin và ưu đãi từ Healink.
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
