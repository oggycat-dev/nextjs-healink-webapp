"use client";

import Image from "next/image";

interface PhilosophyItem {
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  position: string;
}

interface JobPosition {
  icon: string;
  title: string;
}

const philosophyItems: PhilosophyItem[] = [
  {
    title: "Chánh niệm",
    description: "Chúng tôi tạo ra môi trường nuôi dưỡng sức khỏe tinh thần.",
  },
  {
    title: "Sự ấm áp",
    description: "Healink giúp bạn thư giãn và giải tỏa sự áp lực từ bất cứ đâu.",
  },
  {
    title: "Phát triển",
    description: "Cộng đồng của chúng tôi phát triển nhờ sự truyền cảm hứng.",
  },
];

const teamMembers: TeamMember[][] = [
  [
    { name: "Lê Xuân Huy", position: "Giám đốc Vận hành" },
    { name: "Lê Thị Cao Ngân", position: "Giám đốc Tài chính" },
  ],
  [
    { name: "Danh Tuấn Đạt", position: "Giám đốc Điều hành" },
    { name: "Vũ Minh Đức", position: "Giám đốc Công nghệ" },
  ],
  [
    { name: "Nguyễn Ngọc Xuân Thùy", position: "Giám đốc Tiếp thị" },
    { name: "Trần Ngọc Minh", position: "Giám đốc Tiếp thị" },
  ],
];

const jobPositions: JobPosition[] = [
  { icon: "mic", title: "MEDIA" },
  { icon: "edit", title: "Content Creator" },
  { icon: "pen", title: "Designer" },
  { icon: "cpu", title: "Developer" },
  { icon: "mail", title: "Marketing" },
  { icon: "edit", title: "Customer Service" },
  { icon: "pen", title: "Business" },
  { icon: "cpu", title: "Operations" },
];

const partners = Array(8).fill("/icons/logo.png");

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1030px] mx-auto text-center space-y-4">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#000000]">
            Healink xin chào,
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-[#000000]">
            Hành trình chăm sóc sức khỏe tinh thần của bạn bắt đầu từ đây.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 bg-[#826B39] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#6d5a2f] transition-colors duration-200">
            Khám phá cơ hội
          </button>
        </div>

        {/* Logo Image */}
        <div className="flex justify-center mt-12">
          <div className="relative w-[326px] h-[387px]">
            <Image
              src="/icons/logo.png"
              alt="Healink Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-5xl font-black text-center text-[#000000] mb-12">
            Triết lý của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <h3 className="text-4xl font-medium text-[#000000]">{item.title}</h3>
                <p className="text-2xl font-light text-[#000000]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1030px] mx-auto">
          <h2 className="text-5xl font-black text-center text-[#000000] mb-8">
            Triết lý của chúng tôi
          </h2>
          <p className="text-2xl sm:text-3xl font-light text-center text-[#000000] mb-8">
            Chúng tôi mong muốn nâng cao sức khỏe tinh thần thông qua cảm hứng hàng ngày và các podcast.
          </p>
          <div className="text-2xl font-light text-[#000000] leading-10 space-y-6">
            <p>
              🧘‍♀️ <strong>Về Healink – Không gian chữa lành nhẹ nhàng mỗi ngày</strong>
              <br />
              Tại Healink, chúng tôi tin rằng mỗi người đều xứng đáng có một nơi để dừng lại, thở sâu và lắng nghe chính mình. Healink được tạo ra như một người bạn đồng hành tinh thần – nơi bạn tìm thấy những postcard tích cực, podcast nhẹ nhàng, và những phút giây chánh niệm, giúp bạn kết nối lại với nội tâm giữa cuộc sống bận rộn.
            </p>
            <p>
              🌱 <strong>Sứ mệnh của chúng tôi</strong>
              <br />
              Chúng tôi không chữa lành cho bạn – chúng tôi trao công cụ để bạn tự chữa lành.
              <br />
              Thông qua nội dung truyền cảm hứng mỗi ngày, Healink hướng đến việc nuôi dưỡng sự bình an từ bên trong, tạo dựng thói quen chăm sóc tinh thần lành mạnh – từng ngày, một cách đơn giản và bền vững.
            </p>
            <p>
              💡 <strong>Giá trị cốt lõi</strong>
              <br />
              Tử tế: Với người dùng, với chính mình, với thế giới
              <br />
              Lắng nghe: Lắng nghe cơ thể, cảm xúc và cộng đồng
              <br />
              Tự do cảm xúc: Được buồn, được nghỉ ngơi, được không hoàn hảo
              <br />
              Nuôi dưỡng chánh niệm: Mỗi ngày một khoảnh khắc tỉnh thức
            </p>
            <p>
              🤝 <strong>Đội ngũ phía sau Healink</strong>
              <br />
              Healink được tạo nên bởi những con người yêu thích sự nhẹ nhàng – từ chuyên gia tâm lý, thiết kế trải nghiệm, đến những người từng trải qua trầm cảm, lo âu và đang học cách sống chậm lại.
              <br />
              Chúng tôi hiểu cảm giác mệt mỏi và mất kết nối – và chúng tôi ở đây để nhắc bạn rằng: bạn không một mình.
            </p>
            <p>
              ✨ <strong>Chào mừng bạn đến với Healink</strong>
              <br />
              Dù bạn đến đây để tìm sự bình yên, để bắt đầu lại, hay chỉ để thư giãn 5 phút mỗi ngày – Healink luôn sẵn sàng ở đây, như một chiếc ô giữa cơn mưa cảm xúc.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1313px] mx-auto">
          <h2 className="text-5xl font-black text-center text-[#000000] mb-12">
            Đối tác của chúng tôi
          </h2>
          
          {/* First Row - 4 partners */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {partners.slice(0, 4).map((partner, index) => (
              <div
                key={`partner-1-${index}`}
                className="bg-[#FBE7BA] rounded-lg p-8 flex items-center justify-center aspect-[295/200] hover:shadow-lg transition-shadow duration-200"
              >
                <Image src={partner} alt={`Partner ${index + 1}`} width={80} height={80} />
              </div>
            ))}
          </div>

          {/* Second Row - 3 partners centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-[967px]">
              {partners.slice(4, 7).map((partner, index) => (
                <div
                  key={`partner-2-${index}`}
                  className="bg-[#FBE7BA] rounded-lg p-8 flex items-center justify-center aspect-[295/200] hover:shadow-lg transition-shadow duration-200"
                >
                  <Image src={partner} alt={`Partner ${index + 5}`} width={80} height={80} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Positions Section */}
      <section className="py-16 px-6">
        <div className="max-w-[1246px] mx-auto">
          <h2 className="text-5xl font-black text-center text-[#000000] mb-12">
            Vị Trí Tuyển Dụng
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {jobPositions.map((position, index) => (
              <div
                key={index}
                className="bg-[#D0BF98] rounded-lg p-8 flex flex-col items-center justify-center aspect-[295/281] hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  {/* Icon placeholder */}
                  <div className="w-20 h-20 border-4 border-black rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold text-[#000000] text-center uppercase">
                  {position.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-[#FBE7BA]">
        <div className="max-w-[1341px] mx-auto">
          <h2 className="text-5xl font-black text-center text-[#000000] mb-16">
            OUR TEAMS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((column, colIndex) => (
              <div key={colIndex} className="space-y-8">
                {column.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className="bg-[#D0BF98] rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Image placeholder */}
                    <div className="aspect-square bg-[#C4B086] flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center">
                        <svg className="w-20 h-20 text-[#604B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-medium text-[#000000] mb-1">
                        {member.name}
                      </h3>
                      <p className="text-2xl font-extralight text-[#000000]">
                        {member.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
