import React, { useState } from 'react';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Clock,
  CreditCard,
  Award,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Receipt,
  Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerAddress } from '../../types';

export const UserProfilePage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    addUserAddress,
    removeUserAddress,
    orders,
    setActiveTrackingOrderId,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses' | 'orders' | 'rewards'>('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  // New Address State
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('NSW');
  const [postcode, setPostcode] = useState('2000');
  const [instructions, setInstructions] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    showToast('Customer profile updated successfully', 'success');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !suburb.trim()) return;

    const newAddr: CustomerAddress = {
      id: `addr-${Date.now()}`,
      label: addrLabel,
      street,
      suburb,
      state,
      postcode,
      deliveryInstructions: instructions,
      lat: -33.8688,
      lng: 151.2093,
      isDefault: false,
    };

    addUserAddress(newAddr);
    setIsAddingAddress(false);
    setStreet('');
    setSuburb('');
    setInstructions('');
    showToast('New delivery destination added to your account', 'success');
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setActiveTab('tracking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* User Page Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-serif font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-emerald-400">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{userProfile.name}</h1>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Customer Account
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                {userProfile.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {userProfile.phone}
              </span>
            </p>
          </div>
        </div>

        {/* Loyalty Points Badge Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-amber-200 uppercase tracking-wider font-bold block">
              Fresh Club Balance
            </span>
            <span className="text-xl font-black text-white font-mono">
              {userProfile.loyaltyPoints} Pts
            </span>
            <span className="text-[11px] text-emerald-300 block">
              ≈ ${(userProfile.loyaltyPoints / 10).toFixed(2)} AUD Grocery Credit
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        <button
          id="btn-user-page-tab-profile"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'profile'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Contact Details</span>
        </button>

        <button
          id="btn-user-page-tab-addresses"
          onClick={() => setActiveSubTab('addresses')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'addresses'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Addresses ({userProfile.addresses.length})</span>
        </button>

        <button
          id="btn-user-page-tab-orders"
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'orders'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          id="btn-user-page-tab-rewards"
          onClick={() => setActiveSubTab('rewards')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'rewards'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Loyalty Rewards Club</span>
        </button>
      </div>

      {/* Main SubTab Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SubTab 1: Profile & Contact Details */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
                  <p className="text-xs text-stone-500">Update your primary contact information for delivery updates and receipts.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                  <input
                    id="input-userpage-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Email Address</label>
                    <input
                      id="input-userpage-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Australian Phone Number</label>
                    <input
                      id="input-userpage-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="btn-save-userpage-profile"
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SubTab 2: Delivery Addresses */}
          {activeSubTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Saved Delivery Addresses</h3>
                  <p className="text-xs text-stone-500">Manage home, office, and holiday delivery locations.</p>
                </div>
                <button
                  id="btn-userpage-add-addr-toggle"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add address subform */}
              {isAddingAddress && (
                <form
                  onSubmit={handleCreateAddress}
                  className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in"
                >
                  <h4 className="font-bold text-stone-900">New Australian Delivery Address</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Address Label</label>
                      <input
                        id="input-userpage-addr-label"
                        type="text"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value as any)}
                        placeholder="Home / Office / Beach House"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">State / Territory</label>
                      <select
                        id="select-userpage-addr-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                      >
                        <option value="NSW">New South Wales (NSW)</option>
                        <option value="VIC">Victoria (VIC)</option>
                        <option value="QLD">Queensland (QLD)</option>
                        <option value="WA">Western Australia (WA)</option>
                        <option value="SA">South Australia (SA)</option>
                        <option value="TAS">Tasmania (TAS)</option>
                        <option value="ACT">Australian Capital Territory (ACT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Street Address</label>
                    <input
                      id="input-userpage-addr-street"
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Unit 4, 120 Campbell St"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Suburb</label>
                      <input
                        id="input-userpage-addr-suburb"
                        type="text"
                        required
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="e.g. Surry Hills"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Postcode</label>
                      <input
                        id="input-userpage-addr-postcode"
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="2010"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Courier Delivery Notes (Buzzer code, safe drop-off spot)
                    </label>
                    <input
                      id="input-userpage-addr-notes"
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g., Leave behind front planter box or buzz 402"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-userpage-submit-address"
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {userProfile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">{addr.label}</h4>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                              Default Destination
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-700 font-medium mt-1">
                          {addr.unitNumber ? `${addr.unitNumber}, ` : ''}
                          {addr.street}, {addr.suburb} {addr.state} {addr.postcode}
                        </p>
                        {addr.deliveryInstructions && (
                          <p className="text-[11px] text-stone-500 italic mt-0.5">
                            Note: "{addr.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {userProfile.addresses.length > 1 && (
                      <button
                        id={`btn-userpage-remove-addr-${addr.id}`}
                        onClick={() => removeUserAddress(addr.id)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab 3: Order History */}
          {activeSubTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Your Grocery Orders</h3>
                  <p className="text-xs text-stone-500">Track current deliveries or re-order essentials from your favorites.</p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">No past orders placed yet.</p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-black text-stone-900 font-mono">
                            #{ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800 animate-pulse'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-stone-500">
                          {ord.createdAt}
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-2 shrink-0 text-xs"
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <span className="font-semibold text-stone-800 text-[11px] truncate max-w-[120px]">
                              {item.quantity}x {item.productName}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-[11px] text-stone-500 block">Total:</span>
                          <span className="text-base font-black text-stone-900 font-mono">
                            ${ord.totalAmount.toFixed(2)} AUD
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-userpage-track-${ord.id}`}
                            onClick={() => handleTrackOrder(ord.id)}
                            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Order Live</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SubTab 4: Rewards */}
          {activeSubTab === 'rewards' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Fresh Rewards Club</h3>
                  <p className="text-xs text-stone-500">Earn points on every grocery purchase from Australian supermarkets and bakeries.</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold opacity-90">Gold Member Tier</span>
                <h4 className="text-2xl font-black font-mono">{userProfile.loyaltyPoints} Points Available</h4>
                <p className="text-xs text-amber-100">
                  You earn 1 Fresh Point for every $1 spent. Redeemable directly during checkout on any grocery order.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Quick User Shortcuts & Security */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Account Security & Payment</span>
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-800">2-Factor Authentication</span>
                <span className="text-emerald-700 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-800">Encrypted Payments</span>
                <span className="text-emerald-700 font-bold">256-bit SSL</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Need Groceries Today?</span>
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Explore fresh fruit, sourdough bakery, and farm seafood with express chilled courier delivery.
            </p>
            <button
              id="btn-userpage-go-store"
              onClick={() => setActiveTab('store')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Supermarkets Now</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
