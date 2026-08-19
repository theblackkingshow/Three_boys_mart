import React from 'react';
import { Store, Star, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoreSelector: React.FC = () => {
  const { vendors, selectedVendorId, setSelectedVendorId, selectedSector, setSelectedSector } = useApp();

  const filteredVendors = vendors.filter((v) => {
    if (selectedSector === 'grocery') return v.sector === 'grocery' || v.sector === 'hybrid';
    if (selectedSector === 'food') return v.sector === 'food' || v.sector === 'hybrid';
    return true;
  });

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-stone-900 font-serif">
            {selectedSector === 'food'
              ? 'Hot Food Kitchens, Delis & Restaurants'
              : selectedSector === 'grocery'
              ? 'Featured Supermarkets & Fresh Grocers'
              : 'Local Stores & Kitchens'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedVendorId && (
            <button
              id="btn-view-all-stores"
              onClick={() => setSelectedVendorId(null)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Clear Store Filter
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* All Stores Pill/Card */}
        <button
          id="btn-filter-all-vendors"
          onClick={() => setSelectedVendorId(null)}
          className={`flex flex-col items-start text-left p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedVendorId === null
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/50'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 text-current flex items-center justify-center mb-2">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold leading-tight">All Stores & Kitchens</span>
          <span className={`text-[10px] mt-0.5 ${selectedVendorId === null ? 'text-emerald-200' : 'text-stone-400'}`}>
            Combined multi-basket
          </span>
        </button>

        {/* Individual Vendors */}
        {filteredVendors.map((vendor) => {
          const isSelected = selectedVendorId === vendor.id;
          return (
            <button
              key={vendor.id}
              id={`btn-select-vendor-${vendor.id}`}
              onClick={() => setSelectedVendorId(isSelected ? null : vendor.id)}
              className={`group flex flex-col justify-between p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-50 text-stone-900 border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-8 h-8 rounded-xl object-cover border border-stone-100 shadow-2xs"
                  />
                  <span className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {vendor.rating}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                  {vendor.name}
                </h3>
                <span className="text-[10px] font-medium text-emerald-700 block mt-0.5">
                  {vendor.type}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-stone-400" />
                  {vendor.deliveryTimeMin}-{vendor.deliveryTimeMax}m
                </span>
                <span className="font-semibold text-stone-700">
                  ${vendor.deliveryFee.toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
