import Image from "next/image";
import Link from "next/link";

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
  { key: "flashcard", label: "Flashcard" },
  { key: "journal", label: "Viết nhật ký" },
  { key: "offline", label: "Tải offline" },
  { key: "hd", label: "Chất lượng HD" },
  { key: "exclusive", label: "Nội dung độc quyền" },
  { key: "personal", label: "Podcast cá nhân" },
];

const plans = [
  {
    name: "Yearly Premium",
    priceLabel: "Yearly Premium for user",
    price: "200.000đ",
    period: "/12 năm",
    accent: {
      background: "bg-white",
      text: "text-black",
      shadow: "shadow-[0_15px_40px_rgba(130,107,57,0.15)]",
      cta: "bg-[#826B39] text-white hover:bg-[#6d572f]",
      button: "ĐĂNG KÝ NGAY",
    },
    features: {
      podcast: false,
      noAds: false,
      flashcard: false,
      journal: false,
      offline: false,
      hd: false,
      exclusive: false,
      personal: false,
    },
  },
  {
    name: "Premium",
    priceLabel: "Premium plan with advanced features",
    price: "9,99đ",
    period: "/tháng",
    trial: "Dùng thử 7 ngày miễn phí",
    accent: {
      background: "bg-[#6D5A47]",
      text: "text-white",
      shadow: "shadow-[0_25px_50px_rgba(0,0,0,0.25)]",
      cta: "bg-white text-[#604B3B] hover:bg-[#FBE7BA]",
      button: "ĐĂNG KÝ NGAY",
    },
    features: {
      podcast: false,
      noAds: false,
      flashcard: false,
      journal: false,
      offline: false,
      hd: false,
      exclusive: false,
      personal: false,
    },
  },
  {
    name: "Free",
    priceLabel: "Free plan with basic features",
    price: "Miễn phí",
    period: "",
    accent: {
      background: "bg-[#D4C3A3]",
      text: "text-black",
      shadow: "shadow-[0_15px_40px_rgba(130,107,57,0.15)]",
      cta: "bg-[#826B39] text-white hover:bg-[#6d572f]",
      button: "BẮT ĐẦU MIỄN PHÍ",
    },
    features: {
      podcast: true,
      noAds: false,
      flashcard: false,
      journal: false,
      offline: false,
      hd: false,
      exclusive: false,
      personal: false,
    },
  },
];

const utilityIcons = {
  cart: "/icons/cart.svg",
  bag: "/icons/bag.svg",
  user: "/icons/user.svg",
  search: "/icons/search.svg",
};

export default function HomepageContent() {
  return (
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
              "
            </span>
            <h1 className="text-4xl font-semibold leading-snug sm:text-5xl md:text-6xl">
              Nuôi dưỡng tâm hồn bằng cảm hứng mỗi ngày
            </h1>
            <p className="text-base font-light leading-relaxed text-white/80 sm:text-lg">
              Healink là không gian an yên, nơi mỗi người được lắng nghe, thực hành chánh niệm và tìm lại sự cân bằng cảm xúc thông qua podcast, postcard và các hoạt động cộng đồng.
            </p>
            <div className="pt-2">
              <Link
                href="/podcast"
                className="inline-flex items-center rounded-full bg-white px-8 py-3 text-base font-semibold text-[#604B3B] transition-all hover:bg-[#FBE7BA] hover:shadow-lg"
              >
                Nghe ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="mindful" className="bg-white py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#000000] sm:text-4xl">
            Chánh niệm mỗi ngày
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {mindfulHighlights.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 rounded-3xl bg-[#FBE7BA] p-8 text-center shadow-md transition-transform hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <svg className="h-8 w-8 text-[#604B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#604B3B]">{item.title}</h3>
                <p className="text-sm font-light text-[#826B39]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="bg-[#F7F2F2] py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#000000] sm:text-4xl">
            Cộng đồng chữa lành
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {communityHighlights.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-md transition-transform hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B99B5C]">
                  {index === 0 && (
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#604B3B]">{item.title}</h3>
                <p className="text-sm font-light text-[#826B39]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#000000] sm:text-4xl">
            Chọn gói phù hợp
          </h2>
          <p className="mb-12 text-center text-base font-light text-[#826B39]">
            Trải nghiệm Healink theo cách của bạn
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col gap-6 rounded-3xl p-8 ${plan.accent.background} ${plan.accent.text} ${plan.accent.shadow} transition-transform hover:scale-105`}
              >
                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm font-medium opacity-80">{plan.priceLabel}</p>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-lg ml-1">{plan.period}</span>}
                  </div>
                  {plan.trial && (
                    <p className="mt-2 text-sm opacity-90">{plan.trial}</p>
                  )}
                </div>
                <ul className="flex-1 space-y-3">
                  {planFeatures.map((feature) => {
                    const hasFeature = plan.features[feature.key as keyof typeof plan.features];
                    return (
                      <li 
                        key={feature.key} 
                        className={`flex items-center gap-3 text-sm ${!hasFeature ? 'opacity-50 line-through' : ''}`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center">
                          {hasFeature ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        <span>{feature.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/subscription"
                  className={`rounded-full py-3 text-center font-semibold uppercase tracking-wider transition-colors ${plan.accent.cta}`}
                >
                  {plan.accent.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
