import React, { useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerAddress } from '../../types';

export const UserProfileModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    userProfile,
    updateUserProfile,
    addUserAddress,
    removeUserAddress,
    orders,
    setActiveTrackingOrderId,
    setActiveTab,
    showToast,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
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

  if (activeModal !== 'profile') return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    showToast('Profile details updated successfully', 'success');
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
    showToast('New Australian delivery address added', 'success');
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setActiveModal(null);
    setActiveTab('tracking');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-user-profile"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{userProfile.name}</h2>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{userProfile.email}</span>
                <span>•</span>
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" />
                  {userProfile.loyaltyPoints} Fresh Club Pts
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-close-user-profile"
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-white px-5 gap-4 text-xs font-bold">
          <button
            id="btn-profile-tab-info"
            onClick={() => setActiveProfileTab('profile')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeProfileTab === 'profile'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Contact & Details
          </button>
          <button
            id="btn-profile-tab-addresses"
            onClick={() => setActiveProfileTab('addresses')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeProfileTab === 'addresses'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Saved Delivery Addresses ({userProfile.addresses.length})
          </button>
          <button
            id="btn-profile-tab-orders"
            onClick={() => setActiveProfileTab('orders')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeProfileTab === 'orders'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            My Past Orders ({orders.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Tab 1: Profile Info Form */}
          {activeProfileTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                <input
                  id="input-profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Address</label>
                <input
                  id="input-profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Australian Phone Number</label>
                <input
                  id="input-profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-950">Fresh Rewards Club Tier</h4>
                  <p className="text-[11px] text-amber-800">
                    Earn 1 point per $1 spent across all supermarkets and bakeries.
                  </p>
                </div>
                <span className="text-base font-black text-amber-900 font-mono">
                  {userProfile.loyaltyPoints} Pts
                </span>
              </div>

              <button
                id="btn-save-profile"
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold transition-all cursor-pointer"
              >
                Update Profile
              </button>
            </form>
          )}

          {/* Tab 2: Addresses */}
          {activeProfileTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">Delivery Destinations</span>
                <button
                  id="btn-add-address-toggle"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add address subform */}
              {isAddingAddress && (
                <form
                  onSubmit={handleCreateAddress}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Label</label>
                      <input
                        id="input-address-label"
                        type="text"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="Home / Office"
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">State</label>
                      <select
                        id="select-address-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="ACT">ACT</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Street Address</label>
                    <input
                      id="input-address-street"
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Unit 4, 120 Campbell St"
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Suburb</label>
                      <input
                        id="input-address-suburb"
                        type="text"
                        required
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="e.g. Surry Hills"
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Postcode</label>
                      <input
                        id="input-address-postcode"
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="2010"
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Courier Instructions (Buzzer, safe place)
                    </label>
                    <input
                      id="input-address-instructions"
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Leave at porch or buzz 401"
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 rounded-lg text-stone-500 hover:bg-stone-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-submit-address"
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-2.5">
                {userProfile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">{addr.label}</h4>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-700 mt-0.5">
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
                        id={`btn-remove-addr-${addr.id}`}
                        onClick={() => removeUserAddress(addr.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Order History */}
          {activeProfileTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">No orders found.</p>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-stone-900 font-mono">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {ord.items.length} items from {ord.vendorNames.join(', ')}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        {ord.createdAt} • Paid via {ord.payment.provider}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-sm font-black text-stone-900 font-mono">
                        ${ord.totalAmount.toFixed(2)} AUD
                      </span>

                      <button
                        id={`btn-track-past-order-${ord.id}`}
                        onClick={() => handleTrackOrder(ord.id)}
                        className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
