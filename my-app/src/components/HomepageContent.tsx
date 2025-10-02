import Image from "next/image";

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
    name: "Trải nghiệm",
    priceLabel: "Miễn phí",
    price: "Dùng thử",
    accent: {
      background: "bg-white/60 backdrop-blur-xl border-2 border-white/40",
      text: "text-[#1E1E1E]",
      shadow: "shadow-[0_18px_40px_rgba(0,0,0,0.1)]",
      cta: "border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white",
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
    name: "Căn bản",
    priceLabel: "49.000đ / tháng",
    price: "Mua gói này",
    accent: {
      background: "bg-[#604B3B]/95 backdrop-blur-xl border-2 border-[#604B3B]/30",
      text: "text-white",
      shadow: "shadow-[0_18px_40px_rgba(96,75,59,0.3)]",
      cta: "bg-white text-[#604B3B] hover:bg-gray-100",
    },
    features: {
      podcast: true,
      noAds: true,
      flashcard: true,
      journal: false,
      personal: false,
    },
  },
  {
    name: "Cao cấp",
    priceLabel: "89.000đ / tháng",
    price: "Mua gói này",
    accent: {
      background: "bg-[#D0BF98]/90 backdrop-blur-xl border-2 border-white/50",
      text: "text-[#1E1E1E]",
      shadow: "shadow-[0_18px_40px_rgba(208,191,152,0.4)]",
      cta: "bg-[#1E1E1E] text-white hover:bg-[#333]",
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

const iconMap = {
  check: "/icons/check.svg",
  close: "/icons/close.svg",
};

export default function HomepageContent() {
  return (
    <>
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
              "
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
                className="flex flex-col items-center rounded-3xl bg-white/30 backdrop-blur-xl px-8 py-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-white/40 hover:bg-white/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1"
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
                className={`flex h-full flex-col justify-between rounded-[40px] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] ${plan.accent.background} ${plan.accent.text} ${plan.accent.shadow}`}
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
    </>
  );
}