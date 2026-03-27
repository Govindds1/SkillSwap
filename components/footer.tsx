'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                className="h-8 w-8"
              >
                <path
                  d="M 20 30 Q 15 50 25 70"
                  stroke="#184A48"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xl font-bold">
                <span className="text-teal-200">Skill</span>
                <span className="text-golden-yellow">Swap</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Connecting students to exchange skills, learn together, and grow as a community.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Top Skills
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-golden-yellow transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-center gap-2 hover:text-golden-yellow transition-colors">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@skillswap.com">hello@skillswap.com</a>
              </li>
              <li className="flex items-center gap-2 hover:text-golden-yellow transition-colors">
                <Phone className="w-4 h-4" />
                <span>(555) SKILL-SWAP</span>
              </li>
              <li className="flex items-start gap-2 hover:text-golden-yellow transition-colors">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Learning Lane, Education City, ED 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          {/* Social Links and Bottom Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2024 SkillSwap. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link
                href="#"
                className="text-white/60 hover:text-golden-yellow transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-golden-yellow transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M19.121 19.121A9 9 0 005.04 5.04a9 9 0 1112.081 12.081M9.5 9.5v6m3-3h-6" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-golden-yellow transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.19.092-.926.35-1.545.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.268.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817a9.585 9.585 0 012.502.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="flex gap-6 text-white/60 text-xs">
              <Link href="#" className="hover:text-golden-yellow transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-golden-yellow transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
