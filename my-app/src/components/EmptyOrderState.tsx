"use client";

export default function EmptyOrderState() {
  return (
    <div className="relative w-full max-w-[968px] mx-auto h-[724px]">
      {/* Main Container */}
      <div className="absolute w-full h-[618px] left-0 top-[45px] bg-white rounded-[40px] shadow-lg">
        {/* Back Button */}
        <button className="absolute left-[22px] top-[66px] w-[40.75px] h-[40.75px] bg-[#604B3B] rounded-lg flex items-center justify-center hover:bg-[#4a3b2d] transition-colors duration-200">
          <div className="relative w-[13.25px] h-[13.25px]">
            <div className="absolute w-[2px] h-[10px] bg-white transform rotate-45 origin-bottom-left"></div>
            <div className="absolute w-[2px] h-[10px] bg-white transform -rotate-45 origin-top-left"></div>
          </div>
        </button>

        {/* Icon Container - Centered */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-[101.37px]">
          {/* Outer Circle (Light Red Background) */}
          <div className="relative w-[93.26px] h-[93.26px] bg-[rgba(162,35,37,0.25)] rounded-full flex items-center justify-center">
            {/* Inner Circle (Solid Red) */}
            <div className="w-[46.74px] h-[46.74px] bg-[#A22325] rounded-full flex items-center justify-center">
              {/* X Icon */}
              <span className="text-white text-[40px] font-normal leading-none">
                ×
              </span>
            </div>
          </div>
        </div>

        {/* Text Message */}
        <div className="absolute left-1/2 top-[322px] transform -translate-x-1/2 w-full max-w-[541.99px] px-4">
          <p className="text-center text-[#474747] text-[26.65px] leading-[40px] font-normal">
            Rất tiếc bạn chưa có đơn hàng nào hết
          </p>
        </div>

        {/* Optional: Call to Action Button */}
        <div className="absolute left-1/2 top-[420px] transform -translate-x-1/2">
          <button className="px-8 py-3 bg-[#826B39] text-white font-semibold rounded-full hover:bg-[#6d5a2f] transition-colors duration-200 shadow-md">
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
