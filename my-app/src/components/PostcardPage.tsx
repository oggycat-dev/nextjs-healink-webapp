"use client";

import Image from "next/image";

interface PodcastCard {
  id: number;
  title: string;
}

interface FlashCard {
  id: number;
  quote: string;
  author: string;
  role: string;
}

const podcastCards: PodcastCard[] = [
  { id: 1, title: "Thả lỏng và cảm nhận sự bình yên lan tỏa trong đêm" },
  { id: 2, title: "Thả lỏng và cảm nhận sự bình yên lan tỏa trong đêm" },
  { id: 3, title: "Thả lỏng và cảm nhận sự bình yên lan tỏa trong đêm" },
];

const flashCards: FlashCard[] = [
  {
    id: 1,
    quote: "Bạn là nhà,\nđừng bỏ rơi\nchính mình.",
    author: "Trần Văn A",
    role: "Bác sĩ tâm lý",
  },
  {
    id: 2,
    quote: "Lúc nào\nKhông phải\nCũng phải ứng",
    author: "Nguyễn Văn B",
    role: "Giảng viên khoa tâm lý học...",
  },
  {
    id: 3,
    quote: "Không có gì nở rộ mãi mãi kể cả bạn",
    author: "Nguyễn Văn B",
    role: "Giảng viên khoa tâm lý học...",
  },
  {
    id: 4,
    quote: "Giữa những ồn ào, đừng quên nghe tiếng mình.",
    author: "Nguyễn Văn B",
    role: "Giảng viên khoa tâm lý học...",
  },
  {
    id: 5,
    quote: "Ngay lúc này đã đủ để bắt đầu",
    author: "Trần Văn A",
    role: "Bác sĩ tâm lý",
  },
];

export default function PostcardPage() {
  const sections = [
    { title: "Podcast thịnh hành", id: "section1" },
    { title: "Vừa ra mắt", id: "section2" },
    { title: "Podcast thịnh hành", id: "section3" },
    { title: "Podcast thịnh hành", id: "section4" },
    { title: "Podcast thịnh hành", id: "section5" },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="flex gap-8">
          {/* Left Sidebar - Flashcards */}
          <div className="w-[427px] flex-shrink-0 space-y-8">
            {flashCards.map((card) => (
              <div
                key={card.id}
                className="relative bg-[#D0BF98] rounded-xl p-8 h-[376px] flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Large Quote Mark */}
                <div className="absolute top-6 left-6 text-white text-[128px] leading-none font-bold opacity-50">
                  "
                </div>

                {/* Quote Text */}
                <div className="relative z-10 flex-1 flex items-center justify-center">
                  <p className="text-center text-[24px] sm:text-[32px] lg:text-[36px] font-semibold uppercase leading-tight text-[#000000] whitespace-pre-line">
                    {card.quote}
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 flex items-center gap-4 pt-4">
                  <div className="w-[53px] h-[53px] rounded-full bg-[#D9D9D9] flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#000000]">{card.author}</p>
                    <p className="text-xs font-light text-[#000000]">{card.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Divider Line */}
          <div className="w-px bg-[#D0BF98] opacity-60"></div>

          {/* Right Content - Podcast Cards */}
          <div className="flex-1 space-y-16">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-8">
                {/* Section Title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-black text-[#000000] text-center flex-1">
                    {section.title}
                  </h2>
                  <button className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Podcast Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {podcastCards.map((card) => (
                    <div
                      key={`${section.id}-${card.id}`}
                      className="group cursor-pointer"
                    >
                      {/* Card Image */}
                      <div className="aspect-square bg-[#D0BF98] rounded-lg mb-3 overflow-hidden group-hover:shadow-lg transition-all duration-300">
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src="/icons/logo.png"
                            alt={card.title}
                            width={120}
                            height={120}
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Card Title */}
                      <h3 className="text-center text-sm font-semibold uppercase leading-tight text-[#000000] px-2">
                        {card.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}