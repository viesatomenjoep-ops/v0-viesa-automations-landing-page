'use client';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-viesa-slate/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight">
          Uw Bedrijf op Autopiloot met{' '}
          <span className="text-[#0F5373]">VIESA</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#94a3b8] text-balance max-w-2xl mx-auto">
          Van high-end websites tot complexe CRM-systemen: wij automatiseren uw groei van A tot Z.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="px-8 py-4 bg-[#0F5373] text-white rounded-lg hover:bg-[#0d4360] transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-[#0F5373]/30">
            Start Project
          </button>
          <button className="px-8 py-4 border-2 border-[#0F5373] text-[#0F5373] rounded-lg hover:bg-[#0F5373]/10 transition-all duration-300 font-semibold">
            Onze Diensten
          </button>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#0F5373]/20 rounded-full blur-3xl opacity-30 z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-3xl opacity-30 z-10" />
    </section>
  );
}
