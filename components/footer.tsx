'use client';

import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0f1419] border-t border-[#2d3e52] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-[#0F5373] mb-4">VIESA</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Automating your growth from A to Z. Transforming businesses through intelligent technology solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Diensten</h4>
            <ul className="space-y-2 text-[#94a3b8] text-sm">
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Websites & Platforms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  CRM/ERP Systemen
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Lead Capture
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Mobiele Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-[#94a3b8] text-sm">
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Cases
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#0F5373] transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-[#94a3b8] text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#0F5373]" />
                <a href="mailto:info@viesa.nl" className="hover:text-[#0F5373] transition-colors">
                  info@viesa.nl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#0F5373]" />
                <a href="tel:+31612345678" className="hover:text-[#0F5373] transition-colors">
                  +31 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[#0F5373] mt-0.5 flex-shrink-0" />
                <span>Amsterdam, Netherlands</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d3e52] my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-[#64748b] text-sm">
            &copy; 2024 VIESA Automations. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2d3e52] hover:bg-[#0F5373] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2d3e52] hover:bg-[#0F5373] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2d3e52] hover:bg-[#0F5373] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
