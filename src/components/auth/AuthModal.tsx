import React, { useState } from 'react';
import {
  X,
  Shield,
  Truck,
  Store,
  User,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  KeyRound,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const DEMO_ACCOUNTS = [
  {
    role: 'admin' as UserRole,
    name: 'Alexander Hayes',
    title: 'Chief Operations Administrator',
    email: 'admin@freshmarket.com.au',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    headerColor: 'from-purple-900 to-indigo-900',
    iconBg: 'bg-purple-600',
    icon: <Shield className="w-5 h-5 text-white" />,
    targetPage: 'Admin Command Center',
    desc: 'Access real-time GMV analytics, fleet dispatch, dynamic pricing controls & payment audit.',
  },
  {
    role: 'driver' as UserRole,
    name: 'Marcus Vance',
    title: 'Express Chilled Courier',
    email: 'driver.marcus@freshmarket.com.au',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    headerColor: 'from-blue-900 to-sky-900',
    iconBg: 'bg-blue-600',
    icon: <Truck className="w-5 h-5 text-white" />,
    targetPage: 'Delivery Driver Application',
    desc: 'Access turn-by-turn GPS route, shift earnings in AUD, camera proof of delivery & orders.',
  },
  {
    role: 'vendor' as UserRole,
    name: 'Elena Rostova',
    title: 'Metro Central Store Manager',
    email: 'manager@metro-supermarket.com.au',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    headerColor: 'from-amber-900 to-stone-900',
    iconBg: 'bg-amber-600',
    icon: <Store className="w-5 h-5 text-white" />,
    targetPage: 'Merchant & Kitchen Portal',
    desc: 'Manage store inventory stock levels, surplus/surge discount rules & order prep queue.',
  },
  {
    role: 'customer' as UserRole,
    name: 'Alexandria Morgan',
    title: 'Fresh Club Gold Member',
    email: 'alex.morgan@sydney.com.au',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    headerColor: 'from-emerald-900 to-teal-900',
    iconBg: 'bg-emerald-600',
    icon: <User className="w-5 h-5 text-white" />,
    targetPage: 'Food & Grocery Storefront',
    desc: 'Shop supermarket aisles, hot kitchen meals, track live GPS couriers & use Australian payments.',
  },
];

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, loginAs, userRole, showToast } = useApp();
  const isAdminRoute = window.location.pathname === '/admin';
  const availableAccounts = DEMO_ACCOUNTS.filter((account) => isAdminRoute ? account.role === 'admin' : account.role === 'customer');

  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(isAdminRoute ? 'admin' : 'customer');
  const [emailInput, setEmailInput] = useState(isAdminRoute ? 'admin@freshmarket.com.au' : 'alex.morgan@sydney.com.au');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'login') return null;

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRoleTab(role);
    const account = availableAccounts.find((a) => a.role === role);
    if (account) {
      setEmailInput(account.email);
    }
  };

  const handle1ClickLogin = (role: UserRole) => {
    const account = availableAccounts.find((a) => a.role === role);
    if (account) {
      loginAs(role, { name: account.name, email: account.email });
    }
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const account = availableAccounts.find((a) => a.role === selectedRoleTab);
      loginAs(selectedRoleTab, {
        name: account ? account.name : emailInput.split('@')[0],
        email: emailInput,
      });
    }, 400);
  };

  const currentTabAccount = availableAccounts.find((a) => a.role === selectedRoleTab)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="modal-auth-dialog"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-100 flex flex-col"
      >
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${currentTabAccount.headerColor} text-white relative flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${currentTabAccount.iconBg} flex items-center justify-center shadow-lg`}>
              {currentTabAccount.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif tracking-tight">
                  System Portal Sign In
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                  {selectedRoleTab.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5">
                Authenticates and directs you straight to your dedicated page
              </p>
            </div>
          </div>

          <button
            id="btn-close-auth-modal"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select User Role & Destination Page
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableAccounts.map((acc) => {
                const isSelected = selectedRoleTab === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    id={`btn-auth-role-${acc.role}`}
                    onClick={() => handleRoleTabChange(acc.role)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/30'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white shadow-2xs'}`}>
                        {React.cloneElement(acc.icon, {
                          className: `w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-700'}`,
                        })}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold capitalize">{acc.role}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {acc.role === 'admin'
                          ? 'Command Center'
                          : acc.role === 'driver'
                          ? 'Driver GPS App'
                          : acc.role === 'vendor'
                          ? 'Merchant Portal'
                          : 'Storefront'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Click Role Direct Sign-In Card */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-stone-900">
                  Instant 1-Click {selectedRoleTab.toUpperCase()} Login
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTabAccount.badgeColor}`}>
                Direct to {currentTabAccount.targetPage}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {currentTabAccount.desc}
            </p>

            <button
              type="button"
              id="btn-quick-login-direct"
              onClick={() => handle1ClickLogin(selectedRoleTab)}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in as {currentTabAccount.name} ({selectedRoleTab.toUpperCase()}) & Open Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleCustomFormSubmit} className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Or sign in with custom credentials:</span>
              <span className="text-[11px] text-stone-400">Standard secure sign in</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-auth-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
                  placeholder="name@freshmarket.com.au"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-auth-password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                <span>Stay signed in on this device</span>
              </label>
              <button
                type="button"
                onClick={() => showToast('Password reset link sent to demo email', 'info')}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                Forgot PIN/Password?
              </button>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating credentials...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRoleTab.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          FreshMarket Secure Role-Based Access Control • Australian Multi-Vendor Platform
        </div>
      </div>
    </div>
  );
};
