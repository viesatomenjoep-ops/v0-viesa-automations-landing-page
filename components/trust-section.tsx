'use client';

import { motion } from 'framer-motion';

const logos = [
  'Google',
  'Microsoft',
  'Amazon',
  'Apple',
  'Meta',
  'IBM',
  'Cisco',
  'Oracle',
];

export function TrustSection() {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 md:py-24 bg-viesa-slate border-y border-[#2d3e52] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-[#64748b] text-sm md:text-base mb-12 uppercase tracking-wider">
          Vertrouwd door toonaangevende bedrijven
        </p>

        <div className="relative">
          {/* Gradient masks for fade effect */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-viesa-slate to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-viesa-slate to-transparent z-10" />

          {/* Marquee Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-16"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-16 md:h-20 flex items-center justify-center"
                >
                  <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-lg md:text-xl font-semibold text-[#94a3b8]">
                      {logo}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
