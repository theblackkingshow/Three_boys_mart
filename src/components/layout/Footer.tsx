import React from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Heart,
  DollarSign,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-stone-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live GPS Delivery</h4>
              <p className="text-xs text-stone-400">20-35 min chilled couriers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dynamic Inventory Pricing</h4>
              <p className="text-xs text-stone-400">Direct surplus savings up to 15%</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Multi-Gateway Security</h4>
              <p className="text-xs text-stone-400">Stripe, PayPal, PayID & Afterpay</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Freshness Guarantee</h4>
              <p className="text-xs text-stone-400">Instant replacement or refund</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white font-serif tracking-tight">
                FreshMarket<span className="text-emerald-500">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Australia's premier multi-vendor supermarket and artisan grocery platform. Sourcing farm-fresh produce, meats, bakery goods, and pantry staples directly to your doorstep with real-time GPS tracking.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700">
                🇦🇺 Sydney, NSW
              </span>
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700">
                🇦🇺 Melbourne, VIC
              </span>
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700">
                🇦🇺 Brisbane, QLD
              </span>
            </div>
          </div>

          {/* Grocery Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Aisles</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-emerald-400 transition-colors">Fresh Produce & Herbs</li>
              <li className="hover:text-emerald-400 transition-colors">Dairy, Milk & Free-Range Eggs</li>
              <li className="hover:text-emerald-400 transition-colors">Woodfire Sourdough & Bakery</li>
              <li className="hover:text-emerald-400 transition-colors">Tasmanian Salmon & Prime Meats</li>
              <li className="hover:text-emerald-400 transition-colors">Organic & Gluten-Free Pantry</li>
              <li className="hover:text-emerald-400 transition-colors">Cold-Pressed Juices & Brews</li>
            </ul>
          </div>

          {/* Ecosystem Portals */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Portals</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-emerald-400 transition-colors">Customer Marketplace</li>
              <li className="hover:text-emerald-400 transition-colors">Real-Time Courier GPS Tracking</li>
              <li className="hover:text-emerald-400 transition-colors">Driver Dispatch App</li>
              <li className="hover:text-emerald-400 transition-colors">Vendor Inventory Manager</li>
              <li className="hover:text-emerald-400 transition-colors">Admin Command Center</li>
              <li className="hover:text-emerald-400 transition-colors">Dynamic Pricing Engine</li>
            </ul>
          </div>

          {/* Payment Badges & Security */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Accepted Payment Gateways</h5>
            <p className="text-xs text-stone-400 mb-3">Secure 256-bit encrypted checkout across global and Australian payment networks:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <span className="bg-stone-800 border border-stone-700 text-stone-200 px-2 py-1 rounded text-center">
                💳 Stripe Card
              </span>
              <span className="bg-blue-950 border border-blue-800 text-blue-300 px-2 py-1 rounded text-center">
                🅿️ PayPal
              </span>
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-1 rounded text-center">
                🆔 PayID (AU)
              </span>
              <span className="bg-teal-950 border border-teal-800 text-teal-300 px-2 py-1 rounded text-center">
                ⏱️ Afterpay
              </span>
              <span className="bg-amber-950 border border-amber-800 text-amber-300 px-2 py-1 rounded text-center">
                🏦 BPAY
              </span>
              <span className="bg-stone-800 border border-stone-700 text-stone-200 px-2 py-1 rounded text-center">
                ⚡ POLi Bank
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FreshMarket Hub Australia Pty Ltd. All rights reserved. ABN 84 920 184 722.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300 transition-colors">Vendor Terms</span>
            <span>•</span>
            <span className="hover:text-stone-300 transition-colors">Driver Agreement</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
