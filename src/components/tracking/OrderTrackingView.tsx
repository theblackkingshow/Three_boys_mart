import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Store,
  Navigation,
  Send,
  User,
  Sparkles,
  Play,
  RotateCcw,
  ChevronRight,
  PackageCheck,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    activeTrackingOrder,
    updateOrderStatus,
    sendOrderMessage,
    simulateAdvanceOrder,
    userProfile,
  } = useApp();

  const [chatInput, setChatInput] = useState('');

  if (!activeTrackingOrder) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-stone-800">No active tracking orders</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
          Place an order from any supermarket or select one from your past order history.
        </p>
      </div>
    );
  }

  const order = activeTrackingOrder;
  const progressPercent = order.driverCoordinates?.progressPercent ?? (order.status === 'delivered' ? 100 : 40);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendOrderMessage(order.id, 'customer', userProfile.name, chatInput);
    setChatInput('');

    // Simulate driver auto-reply if asking a question
    setTimeout(() => {
      sendOrderMessage(
        order.id,
        'driver',
        order.driver?.name || 'Courier Driver',
        'Got your message! I have your chilled grocery bag safely secured in the vehicle and will follow your instructions.'
      );
    }, 1500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'order_placed':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold">Order Placed</span>;
      case 'vendor_accepted':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold">Store Confirmed</span>;
      case 'packing_items':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-bold">Packing Bags</span>;
      case 'driver_assigned':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold">Driver Dispatched</span>;
      case 'out_for_delivery':
        return <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">🚚 On The Way (Live GPS)</span>;
      case 'delivered':
        return <span className="bg-emerald-800 text-white px-2.5 py-1 rounded-full text-xs font-bold">✅ Delivered</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-bold">Processing</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Order Switcher & Fast Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-stone-500">Order Reference:</span>
            <span className="text-sm font-black text-stone-900 font-mono">
              #{order.orderNumber}
            </span>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-xs text-stone-600">
            Placed at {order.createdAt} • {order.items.length} items from {order.vendorNames.join(', ')}
          </p>
        </div>

        {/* Order Selector (if multiple orders exist) */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Track Order:</span>
            <select
              id="select-active-order-tracking"
              value={order.id}
              onChange={(e) => setActiveTrackingOrderId(e.target.value)}
              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none cursor-pointer"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.orderNumber} ({o.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Simulation Fast Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-simulate-next-step"
            onClick={() => simulateAdvanceOrder(order.id)}
            disabled={order.status === 'delivered'}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Simulate driver and supermarket progress"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Advance Status</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Interactive Live SVG GPS Map + Route + Driver Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Real-time Map Simulation Stage */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-xl relative aspect-16/10 sm:aspect-16/9 flex flex-col justify-between p-4">
            
            {/* Top Map HUD overlay */}
            <div className="z-10 flex items-center justify-between gap-2">
              <div className="bg-stone-950/80 backdrop-blur-md border border-stone-700/60 rounded-2xl px-3.5 py-2 text-white flex items-center gap-2.5 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                    Live GPS Telemetry
                  </div>
                  <div className="text-xs font-bold text-emerald-300">
                    {order.status === 'delivered'
                      ? 'Delivered to Destination'
                      : `ETA: ${order.estimatedDeliveryTime}`}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/80 backdrop-blur-md border border-stone-700/60 rounded-2xl px-3 py-1.5 text-stone-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>{progressPercent}% Route Complete</span>
              </div>
            </div>

            {/* SVG Visual Map Canvas with Roads, Store Pin, Customer Pin & Moving Vehicle */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 450"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Background Grid & Roads */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              <rect width="800" height="450" fill="#171717" />
              <rect width="800" height="450" fill="url(#grid)" />

              {/* Major Simulated City Streets */}
              <path d="M 0 120 Q 200 160 400 130 T 800 140" stroke="#333333" strokeWidth="18" fill="none" />
              <path d="M 150 0 L 150 450" stroke="#333333" strokeWidth="14" fill="none" />
              <path d="M 620 0 L 620 450" stroke="#333333" strokeWidth="14" fill="none" />
              <path d="M 0 320 Q 300 300 800 340" stroke="#333333" strokeWidth="16" fill="none" />

              {/* River/Harbor Accent */}
              <path
                d="M 550 0 C 580 150, 480 250, 520 450"
                stroke="#0e7490"
                strokeWidth="28"
                fill="none"
                opacity="0.3"
              />

              {/* Delivery Path Curve from Store (150, 130) to Customer (650, 330) */}
              <path
                d="M 150 130 C 250 130, 280 250, 400 250 S 550 330, 650 330"
                stroke="#404040"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 150 130 C 250 130, 280 250, 400 250 S 550 330, 650 330"
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="8 4"
                fill="none"
              />

              {/* Store Location Pin */}
              <g transform="translate(150, 130)">
                <circle r="22" fill="#047857" opacity="0.25" />
                <circle r="14" fill="#059669" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  🏬
                </text>
                <rect x="-60" y="-38" width="120" height="20" rx="6" fill="#064e3b" />
                <text x="0" y="-24" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Metro Supermarket
                </text>
              </g>

              {/* Customer Destination Pin */}
              <g transform="translate(650, 330)">
                <circle r="24" fill="#0284c7" opacity="0.25" />
                <circle r="15" fill="#0284c7" />
                <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🏠
                </text>
                <rect x="-50" y="24" width="100" height="20" rx="6" fill="#0c4a6e" />
                <text x="0" y="38" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {order.deliveryAddress.suburb} (You)
                </text>
              </g>

              {/* Moving Driver Vehicle Marker */}
              {(() => {
                // Approximate coordinate along cubic curve
                const t = Math.max(0.05, Math.min(0.95, progressPercent / 100));
                // Sample points along path
                const x = 150 + (650 - 150) * t;
                const y = 130 + (330 - 130) * Math.sin(t * Math.PI * 0.7);

                return (
                  <g transform={`translate(${x}, ${y})`}>
                    {/* Radar pulse */}
                    <circle r="28" fill="#10b981" opacity="0.3">
                      <animate attributeName="r" values="14;34;14" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      🚗
                    </text>
                    <rect x="-45" y="-32" width="90" height="18" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                    <text x="0" y="-20" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {order.driver?.name || 'Courier'} • Live
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Bottom Map Status Footer */}
            <div className="z-10 bg-stone-950/85 backdrop-blur-md rounded-2xl p-3 border border-stone-800 text-xs text-stone-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate max-w-xs">
                  {order.deliveryAddress.street}, {order.deliveryAddress.suburb}
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                Instruction: "{order.deliveryAddress.deliveryInstructions || 'Leave at doorstep'}"
              </div>
            </div>
          </div>

          {/* Driver Profile Card */}
          {order.driver && (
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={order.driver.avatar}
                  alt={order.driver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-stone-900">{order.driver.name}</h3>
                    <span className="text-xs font-bold bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded">
                      ★ {order.driver.rating}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {order.driver.vehicleModel} • <strong className="text-stone-700">{order.driver.vehiclePlate}</strong>
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Verified Insulated Grocery Transport
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.driver.phone}`}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                  title="Call Courier"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Interactive 6-Stage Timeline */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fulfillment & Delivery Milestones</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      step.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          step.completed ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-400 font-medium">
                        {step.timestamp}
                      </span>
                    </div>
                    {step.notes && (
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        {step.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: 3-Way Order Chat + Purchased Items Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3-Way Live Chat with Driver & Store Staff */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[400px]">
            <div className="p-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-stone-900">Live Delivery & Store Chat</h4>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                ● Live 3-Way Connected
              </span>
            </div>

            {/* Chat message bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {order.messages.map((msg) => {
                const isMe = msg.senderRole === 'customer';
                const isSystem = msg.senderRole === 'system';
                const isDriver = msg.senderRole === 'driver';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-medium">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-stone-400 px-1 mb-0.5">
                      {msg.senderName} ({msg.senderRole}) • {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-br-none'
                          : isDriver
                          ? 'bg-blue-50 text-blue-950 border border-blue-200 rounded-bl-none font-medium'
                          : 'bg-stone-100 text-stone-900 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-stone-200 flex gap-2">
              <input
                id="input-tracking-chat"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message your courier driver or store picker..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
              <button
                id="btn-send-tracking-chat"
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Grocery Items in this Order */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
              <span>Order Basket Items ({order.items.length})</span>
              <span className="text-stone-900 font-mono font-bold">${order.totalAmount.toFixed(2)} AUD</span>
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900 line-clamp-1">{item.productName}</h5>
                      <span className="text-[10px] text-stone-500">
                        {item.quantity}x • {item.vendorName}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Verified details */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Paid via {order.payment.provider}</span>
              <span className="font-mono font-bold text-emerald-800">✓ Verified 256-bit</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
