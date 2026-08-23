import React, { useEffect, useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Clock,
  Building,
  Smartphone,
  QrCode,
  DollarSign,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FulfillmentType, PaymentMethodType, PaymentDetails } from '../../types';
import { getShippingQuote } from '../../services/shippingApi';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartServiceFee,
    driverTip,
    userProfile,
    createOrder,
  } = useApp();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [deliveryFee, setDeliveryFee] = useState(cartDeliveryFee);
  const [quoteMessage, setQuoteMessage] = useState('Standard local delivery');
  const [street, setStreet] = useState(userProfile.addresses[0]?.street || '');
  const [suburb, setSuburb] = useState(userProfile.addresses[0]?.suburb || '');
  const [state, setState] = useState(userProfile.addresses[0]?.state || 'NSW');
  const [postcode, setPostcode] = useState(userProfile.addresses[0]?.postcode || '');

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType>('stripe_card');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userProfile.addresses[0]?.id || 'addr-1'
  );
  const [deliveryTiming, setDeliveryTiming] = useState<'asap' | 'today_evening' | 'tomorrow_morning'>('asap');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Stripe Card State
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(userProfile.name);
  const [saveCard, setSaveCard] = useState(true);

  // PayID State
  const [payIdHandle, setPayIdHandle] = useState('alex.morgan@sydney.com.au');
  const [isPayIdVerified, setIsPayIdVerified] = useState(false);

  // POLi Bank State
  const [selectedBank, setSelectedBank] = useState('Commonwealth Bank of Australia (CBA)');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const activeAddress =
    userProfile.addresses.find((a) => a.id === selectedAddressId) || userProfile.addresses[0];

  const checkoutTotal = Number((cartSubtotal + deliveryFee + cartServiceFee + driverTip).toFixed(2));
  const installmentAmount = (checkoutTotal / 4).toFixed(2);

  useEffect(() => {
    if (fulfillmentType === 'pickup') {
      setDeliveryFee(0);
      setQuoteMessage('Free in-store pickup');
      return;
    }
    const timer = window.setTimeout(() => {
      getShippingQuote(suburb, postcode, cartSubtotal)
        .then((quote) => {
          setDeliveryFee(quote.fee);
          setQuoteMessage(quote.message);
        })
        .catch(() => {
          setDeliveryFee(cartSubtotal >= 100 ? 0 : 10);
          setQuoteMessage('Standard local delivery');
        });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [fulfillmentType, suburb, postcode, cartSubtotal]);

  if (activeModal !== 'checkout') return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setProcessingStage(`Connecting securely to ${selectedPaymentMethod.replace(/_/g, ' ').toUpperCase()} gateway...`);

    setTimeout(() => {
      if (selectedPaymentMethod === 'stripe_card') {
        setProcessingStage('Performing 3D Secure SCA biometric verification...');
      } else if (selectedPaymentMethod === 'paypal') {
        setProcessingStage('Verifying PayPal Express checkout authorization...');
      } else if (selectedPaymentMethod === 'payid_au') {
        setProcessingStage('Resolving New Payments Platform (NPP) PayID address...');
      } else if (selectedPaymentMethod === 'afterpay_au') {
        setProcessingStage('Setting up 4-installment schedule with Afterpay...');
      } else if (selectedPaymentMethod === 'poli_au') {
        setProcessingStage(`Establishing encrypted session with ${selectedBank}...`);
      } else {
        setProcessingStage('Confirming order transaction details...');
      }

      setTimeout(() => {
        setIsProcessing(false);

        const paymentRecord: PaymentDetails = {
          method: selectedPaymentMethod,
          provider:
            selectedPaymentMethod === 'stripe_card'
              ? 'Stripe Australia'
              : selectedPaymentMethod === 'paypal'
              ? 'PayPal Checkout'
              : selectedPaymentMethod === 'payid_au'
              ? 'NPP PayID Instant AU'
              : selectedPaymentMethod === 'afterpay_au'
              ? 'Afterpay Australia'
              : selectedPaymentMethod === 'bpay_au'
              ? 'BPAY Australia'
              : selectedPaymentMethod === 'poli_au'
              ? 'POLi Internet Banking'
              : 'Apple Pay AU',
          transactionId: `txn_${Date.now().toString(36).toUpperCase()}_${Math.floor(
            1000 + Math.random() * 9000
          )}`,
          status: 'paid',
          paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardLast4: selectedPaymentMethod === 'stripe_card' ? cardNumber.slice(-4) : undefined,
          cardBrand: selectedPaymentMethod === 'stripe_card' ? 'Visa' : undefined,
          payIdHandle: selectedPaymentMethod === 'payid_au' ? payIdHandle : undefined,
          bpayBillerCode: selectedPaymentMethod === 'bpay_au' ? '84920' : undefined,
          bpayRef: selectedPaymentMethod === 'bpay_au' ? `CRN-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
          installments:
            selectedPaymentMethod === 'afterpay_au'
              ? {
                  count: 4,
                  amountPerInstallment: Number(installmentAmount),
                  frequency: 'Fortnightly',
                }
              : undefined,
        };

        createOrder({
          payment: paymentRecord,
          fulfillmentType,
          deliveryFee,
          addressId: selectedAddressId,
          customAddress: {
            street: fulfillmentType === 'pickup' ? '240 George Street' : street,
            unitNumber: fulfillmentType === 'pickup' ? undefined : activeAddress.unitNumber,
            suburb: fulfillmentType === 'pickup' ? 'Sydney CBD' : suburb,
            state: fulfillmentType === 'pickup' ? 'NSW' : state,
            postcode: fulfillmentType === 'pickup' ? '2000' : postcode,
            deliveryInstructions: deliveryNotes || activeAddress.deliveryInstructions,
            lat: fulfillmentType === 'pickup' ? -33.865 : activeAddress.lat,
            lng: fulfillmentType === 'pickup' ? 151.205 : activeAddress.lng,
          },
        });
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        id="modal-checkout"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-100 relative flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Encrypted 256-bit Checkout</h2>
              <p className="text-xs text-stone-500">
                Total to pay: <strong className="text-stone-900 font-mono">${checkoutTotal.toFixed(2)} AUD</strong>
              </p>
            </div>
          </div>

          <button
            id="btn-close-checkout"
            onClick={() => setActiveModal(null)}
            disabled={isProcessing}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Step 1: Delivery Address & Slot */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. Fulfillment & Destination</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button id="btn-fulfillment-delivery" onClick={() => setFulfillmentType('delivery')} className={`p-3 rounded-xl border text-left ${fulfillmentType === 'delivery' ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-stone-200'}`}>
                <strong className="block text-xs text-stone-900">Local Express Delivery</strong>
                <span className="text-[10px] text-stone-500">To an Australian address</span>
              </button>
              <button id="btn-fulfillment-pickup" onClick={() => setFulfillmentType('pickup')} className={`p-3 rounded-xl border text-left ${fulfillmentType === 'pickup' ? 'bg-emerald-50 border-emerald-600' : 'bg-white border-stone-200'}`}>
                <strong className="block text-xs text-stone-900">In-Store Pickup</strong>
                <span className="text-[10px] text-stone-500">No delivery fee</span>
              </button>
            </div>

            {fulfillmentType === 'pickup' ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950"><Building className="w-4 h-4" /> Three Boys Mart Sydney CBD</div>
                <p className="text-xs text-amber-900 mt-1">240 George Street, Sydney NSW 2000</p>
                <p className="text-[11px] text-amber-800 mt-1">Open daily, 8:00 AM - 8:00 PM. Pickup is free.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-[11px] font-bold text-stone-700 sm:col-span-2">Street<input value={street} onChange={(e) => setStreet(e.target.value)} required className="mt-1 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-normal" /></label>
                <label className="text-[11px] font-bold text-stone-700">Suburb<input value={suburb} onChange={(e) => setSuburb(e.target.value)} required className="mt-1 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-normal" /></label>
                <label className="text-[11px] font-bold text-stone-700">State<select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-normal"><option>NSW</option><option>VIC</option><option>QLD</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option></select></label>
                <label className="text-[11px] font-bold text-stone-700">Postcode<input value={postcode} onChange={(e) => setPostcode(e.target.value)} required pattern="[0-9]{4}" inputMode="numeric" className="mt-1 w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-normal" /></label>
                <p className="text-[11px] text-emerald-800 sm:col-span-2">{quoteMessage}: <strong>${deliveryFee.toFixed(2)} AUD</strong></p>
              </div>
            )}

            {fulfillmentType === 'delivery' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userProfile.addresses.map((addr) => (
                <button
                  key={addr.id}
                  id={`btn-checkout-address-${addr.id}`}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAddressId === addr.id
                      ? 'bg-emerald-50 border-emerald-600 shadow-2xs ring-1 ring-emerald-600/30'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900">{addr.label}</span>
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-stone-700 font-medium leading-tight">
                    {addr.unitNumber ? `${addr.unitNumber}, ` : ''}
                    {addr.street}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {addr.suburb} {addr.state} {addr.postcode}
                  </p>
                </button>
              ))}
            </div>}

            {/* Time slot selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                id="btn-slot-asap"
                onClick={() => setDeliveryTiming('asap')}
                className={`p-2.5 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                  deliveryTiming === 'asap'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[10px] uppercase font-bold opacity-80">Express</span>
                <span>⚡ ASAP (20-35m)</span>
              </button>
              <button
                id="btn-slot-evening"
                onClick={() => setDeliveryTiming('today_evening')}
                className={`p-2.5 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                  deliveryTiming === 'today_evening'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[10px] uppercase font-bold opacity-80">Today</span>
                <span>🌆 5:00 PM - 7:00 PM</span>
              </button>
              <button
                id="btn-slot-tomorrow"
                onClick={() => setDeliveryTiming('tomorrow_morning')}
                className={`p-2.5 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                  deliveryTiming === 'tomorrow_morning'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="block text-[10px] uppercase font-bold opacity-80">Tomorrow</span>
                <span>☀️ 8:00 AM - 10:00 AM</span>
              </button>
            </div>
          </div>

          {/* Step 2: Payment Gateway Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. Select Payment Gateway</span>
            </h3>

            {/* Gateway Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Stripe Card */}
              <button
                id="btn-gateway-stripe"
                onClick={() => setSelectedPaymentMethod('stripe_card')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'stripe_card'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900">💳 Credit / Debit</span>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                    Stripe
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">Visa, Mastercard, Amex</span>
              </button>

              {/* PayPal */}
              <button
                id="btn-gateway-paypal"
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'paypal'
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-900">🅿️ PayPal</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    Fast
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">One-click PayPal Balance</span>
              </button>

              {/* Australian PayID */}
              <button
                id="btn-gateway-payid"
                onClick={() => setSelectedPaymentMethod('payid_au')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'payid_au'
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-950">🆔 PayID</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    AU Instant
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">Osko / NPP real-time</span>
              </button>

              {/* Afterpay */}
              <button
                id="btn-gateway-afterpay"
                onClick={() => setSelectedPaymentMethod('afterpay_au')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'afterpay_au'
                    ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-950">⏱️ Afterpay</span>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                    4x Pay
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">4x ${installmentAmount} AUD fortnightly</span>
              </button>

              {/* BPAY */}
              <button
                id="btn-gateway-bpay"
                onClick={() => setSelectedPaymentMethod('bpay_au')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'bpay_au'
                    ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-950">🏦 BPAY</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    Biller: 84920
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">Australian Bill Payment</span>
              </button>

              {/* POLi Payments */}
              <button
                id="btn-gateway-poli"
                onClick={() => setSelectedPaymentMethod('poli_au')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPaymentMethod === 'poli_au'
                    ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-950">⚡ POLi Bank</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    Direct
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">CommBank, ANZ, Westpac</span>
              </button>
            </div>

            {/* Gateway Dynamic Details Section */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-3">
              {/* Stripe Details */}
              {selectedPaymentMethod === 'stripe_card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800 pb-2 border-b border-stone-200">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Stripe Elements Secure Form</span>
                    </span>
                    <span className="text-[11px] text-emerald-700">3D Secure 2.0 Enabled</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="input-stripe-card-number"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="input-stripe-expiry"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        CVC / CVV
                      </label>
                      <input
                        id="input-stripe-cvc"
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="888"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 pt-1">
                    <input
                      id="checkbox-save-card"
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Save encrypted card token for faster checkout</span>
                  </label>
                </div>
              )}

              {/* PayPal Details */}
              {selectedPaymentMethod === 'paypal' && (
                <div className="text-center py-2 space-y-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold">🅿️</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">PayPal Express Checkout</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You will authenticate via PayPal's secure modal to authorize ${checkoutTotal.toFixed(2)} AUD using your PayPal balance or linked bank account.
                  </p>
                </div>
              )}

              {/* PayID AU Details */}
              {selectedPaymentMethod === 'payid_au' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                    <span>PayID Instant Australian Transfer</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded">
                      Zero Fees
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Merchant PayID Handle:</span>
                      <strong className="text-xs font-mono text-stone-900">
                        orders@threeboysmart.com.au
                      </strong>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      ABN: 84 920 184 722
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Instant clearance through your Australian Banking app (CommBank, NAB, Westpac, ANZ, ING, Macquarie).
                  </p>
                </div>
              )}

              {/* Afterpay Details */}
              {selectedPaymentMethod === 'afterpay_au' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                    <span>4 Interest-Free Fortnightly Payments</span>
                    <span className="text-teal-700 font-mono font-bold">
                      ${installmentAmount} x 4
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="bg-white p-2 rounded-lg border border-teal-200">
                      <span className="text-stone-400 block">Due Today</span>
                      <strong className="text-teal-900">${installmentAmount}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">In 2 Wks</span>
                      <strong className="text-stone-800">${installmentAmount}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">In 4 Wks</span>
                      <strong className="text-stone-800">${installmentAmount}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block">In 6 Wks</span>
                      <strong className="text-stone-800">${installmentAmount}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* BPAY Details */}
              {selectedPaymentMethod === 'bpay_au' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Biller Code:</span>
                      <strong className="font-mono text-stone-900">84920</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Customer Reference Number (CRN):</span>
                      <strong className="font-mono text-emerald-800">882 109 231</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* POLi Details */}
              {selectedPaymentMethod === 'poli_au' && (
                <div className="space-y-2 text-xs">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    Select Your Australian Financial Institution:
                  </label>
                  <select
                    id="select-poli-bank"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                  >
                    <option value="Commonwealth Bank of Australia (CBA)">Commonwealth Bank (CBA)</option>
                    <option value="ANZ Australia">ANZ Banking Group</option>
                    <option value="Westpac Banking Corporation">Westpac</option>
                    <option value="National Australia Bank (NAB)">National Australia Bank (NAB)</option>
                    <option value="Macquarie Bank">Macquarie Bank</option>
                    <option value="ING Direct Australia">ING Australia</option>
                    <option value="Bendigo Bank">Bendigo Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Processing Overlay State */}
          {isProcessing && (
            <div className="p-4 bg-emerald-950 text-white rounded-2xl text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-emerald-200">{processingStage}</p>
              <p className="text-[10px] text-emerald-400">Do not refresh or close window</p>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[11px] text-stone-500 block">Authorized Amount:</span>
              <span className="text-xl font-black text-stone-900 font-mono">
                ${checkoutTotal.toFixed(2)} AUD
              </span>
            </div>

            <button
              id="btn-confirm-pay"
              onClick={handleProcessPayment}
              disabled={isProcessing || cart.length === 0}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white py-3.5 px-8 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
                <span>
                Pay ${checkoutTotal.toFixed(2)} AUD Now
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
