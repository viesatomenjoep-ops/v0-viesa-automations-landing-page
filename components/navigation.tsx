'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-viesa-slate/95 backdrop-blur-sm border-b border-[#2d3e52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <Image
                src="/viesa-logo.png"
                alt="VIESA Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[#0F5373]">VIESA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-white hover:text-[#00d9ff] transition-colors">
              Services
            </Link>
            <Link href="#process" className="text-white hover:text-[#00d9ff] transition-colors">
              Werkwijze
            </Link>
            <Link href="#faq" className="text-white hover:text-[#00d9ff] transition-colors">
              FAQ
            </Link>
            <button className="px-6 py-2.5 bg-[#0F5373] text-white rounded-lg hover:bg-[#0d4360] transition-colors font-medium">
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="#services"
              className="block text-white hover:text-[#00d9ff] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#process"
              className="block text-white hover:text-[#00d9ff] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Werkwijze
            </Link>
            <Link
              href="#faq"
              className="block text-white hover:text-[#00d9ff] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <button className="w-full px-6 py-2.5 bg-[#0F5373] text-white rounded-lg hover:bg-[#0d4360] transition-colors font-medium">
              Contact
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
