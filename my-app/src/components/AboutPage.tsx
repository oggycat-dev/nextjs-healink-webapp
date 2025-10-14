"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE7BA]/30 to-white">
      {/* Hero Section */}
      <div className="bg-[#FBE7BA]/20 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-4 text-5xl font-bold text-[#604B3B] lg:text-6xl">
            Healink xin chào,
          </h1>
          <p className="text-xl text-[#604B3B]/80">
            Hành trình chăm sóc sức khỏe tinh thần của bạn bắt đầu từ đây.
          </p>
          <div className="mt-8">
            <span className="inline-block rounded-full bg-[#604B3B] px-6 py-2 text-sm font-medium text-white">
              Khám phá cơ hội
            </span>
          </div>
          
          {/* Logo - Same as header */}
          <div className="mx-auto mt-12 flex h-48 w-48 items-center justify-center rounded-3xl bg-white shadow-lg">
            <Image src="/icons/logo.png" alt="Healink logo" width={150} height={150} priority />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Philosophy Section */}
        <div className="mb-20 text-center">
          <h2 className="mb-12 text-4xl font-bold text-[#604B3B]">
            Triết lý của chúng tôi
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">Chính niệm</h3>
              <p className="text-[#604B3B]/70">
                Chúng tôi tạo ra môi trường nuôi dưỡng sức khỏe tinh thần.
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">Sự ấm áp</h3>
              <p className="text-[#604B3B]/70">
                Healink giúp bạn thư giãn và giải tỏa áp lực từ bất cứ đâu.
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">Phát triển</h3>
              <p className="text-[#604B3B]/70">
                Cộng đồng của chúng tôi phát triển nội bộ sự truyền cảm hứng.
              </p>
            </div>
          </div>
        </div>

        {/* Second Philosophy Section */}
        <div className="mb-20 rounded-3xl bg-[#FBE7BA]/20 p-12 text-center">
          <h2 className="mb-6 text-4xl font-bold text-[#604B3B]">
            Triết lý của chúng tôi
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-[#604B3B]/80">
            Chúng tôi mong muốn nâng cao sức khỏe tinh thần thông qua cảm hứng hàng ngày và các podcast.
          </p>
        </div>

        {/* About Healink - No Judgment */}
        <div className="mb-12 rounded-2xl border-l-4 border-[#604B3B] bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">
            Về Healink - Không gian chữa lành nhẹ nhàng mỗi ngày
          </h3>
          <p className="mb-4 text-[#604B3B]/80">
            Tại Healink, chúng tôi tin rằng mỗi người đều xứng đáng có một nơi để dừng lại, 
            thở sâu và lắng nghe chính mình. Healink được tạo ra như một người bạn đồng 
            hành tinh thần – nơi bạn thấy những phút giây chăm sóc, podcast tích cực, những 
            nhạc và những phút giây chánh niệm, giúp bạn kết nối lại với nội tâm giữa cuộc sống 
            bận rộn.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 rounded-2xl border-l-4 border-[#604B3B] bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">
            Sứ mệnh của chúng tôi
          </h3>
          <p className="mb-4 text-[#604B3B]/80">
            Chúng tôi không chữa lành cho bạn – chúng tôi trao công cụ để bạn tự chữa lành.
          </p>
          <p className="text-[#604B3B]/80">
            Thông qua nội dung truyền cảm hứng mỗi ngày, Healink hướng đến việc nuôi 
            dưỡng sự bình an từ bên trong, tạo dựng thói quen chăm sóc tinh thần lành mạnh 
            – từng ngày, một cách đơn giản và bền vững.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-12 rounded-2xl border-l-4 border-[#604B3B] bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">
            Giá trị cốt lõi
          </h3>
          <ul className="space-y-3 text-[#604B3B]/80">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#604B3B]">•</span>
              <span>
                <strong>Tự tế:</strong> Với người dùng, với chính mình, với thế giới
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#604B3B]">•</span>
              <span>
                <strong>Lắng nghe:</strong> Hiểu người nghe có thể, cảm xúc và cộng đồng
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#604B3B]">•</span>
              <span>
                <strong>Tự do cảm xúc:</strong> Được buồn, được nghỉ ngơi, được không hoàn hảo
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#604B3B]">•</span>
              <span>
                <strong>Nuôi dưỡng chánh niệm:</strong> Mỗi ngày một khoảnh khắc tinh thức
              </span>
            </li>
          </ul>
        </div>

        {/* Target Audience */}
        <div className="mb-12 rounded-2xl border-l-4 border-[#604B3B] bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-[#604B3B]">
            Đối tượng phù hợp với Healink
          </h3>
          <p className="mb-4 text-[#604B3B]/80">
            Healink được tạo nên bởi những con người yêu thích sự thực nhẹ – từ chuyên 
            gia tâm lý, thiết kế trải nghiệm, đến những người từng trải qua trầm cảm, lo âu và 
            đang học cách sống chậm lại.
          </p>
          <p className="text-[#604B3B]/80">
            Chúng tôi hiểu cảm giác mệt mỏi và mất kết nối – và chúng tôi ở đây để nhắc 
            bạn rằng: bạn không mất một mình.
          </p>
        </div>

        {/* Welcome Message */}
        <div className="rounded-2xl bg-gradient-to-r from-[#FBE7BA]/40 to-[#D0BF98]/40 p-12 text-center">
          <h3 className="mb-4 text-3xl font-bold text-[#604B3B]">
            Chào mừng bạn đến với Healink
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-[#604B3B]/80">
            Dù bạn đến đây để tìm sự bình yên, để bắt đầu lại, hay chỉ để thư giãn 5 phút mỗi 
            ngày – Healink luôn sẵn sàng 5 đây, như một chiếc ô giữa cơn mưa cảm xúc.
          </p>
        </div>
      </div>
    </div>
  );
}
