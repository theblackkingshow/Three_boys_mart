import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Navigation,
  DollarSign,
  Camera,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Power,
  Store,
  User,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const DriverPortal: React.FC = () => {
  const {
    activeDriver,
    drivers,
    activeDriverId,
    setActiveDriverId,
    updateDriverStatus,
    orders,
    updateOrderStatus,
    assignDriverToOrder,
    showToast,
  } = useApp();

  const [activeDeliveryOrderId, setActiveDeliveryOrderId] = useState<string | null>(
    orders.find((o) => o.assignedDriverId === activeDriverId && o.status !== 'delivered')?.id ||
      orders[0]?.id ||
      null
  );

  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
  const [signatureProvided, setSignatureProvided] = useState(false);

  const driver = activeDriver || drivers[0];
  const isOnline = driver.status !== 'offline';

  // Active delivery order assigned to this driver
  const activeDelivery = orders.find((o) => o.id === activeDeliveryOrderId);

  // Available unassigned or incoming orders
  const availableOrders = orders.filter(
    (o) => o.status === 'order_placed' || o.status === 'vendor_accepted' || o.status === 'packing_items'
  );

  const handleAcceptOrder = (orderId: string) => {
    assignDriverToOrder(orderId, driver.id);
    setActiveDeliveryOrderId(orderId);
    updateOrderStatus(orderId, 'driver_assigned', `Courier ${driver.name} accepted delivery dispatch.`);
    showToast(`Order accepted! Navigate to pickup supermarket.`, 'success');
  };

  const handleAdvanceDeliveryStage = () => {
    if (!activeDelivery) return;

    if (activeDelivery.status === 'driver_assigned') {
      updateOrderStatus(activeDelivery.id, 'driver_at_store', `${driver.name} arrived at store dispatch bay.`);
    } else if (activeDelivery.status === 'driver_at_store' || activeDelivery.status === 'packing_items') {
      updateOrderStatus(activeDelivery.id, 'out_for_delivery', `${driver.name} collected chilled grocery bags and is en route.`);
    } else if (activeDelivery.status === 'out_for_delivery') {
      updateOrderStatus(activeDelivery.id, 'arrived_destination', `${driver.name} arrived at customer residence.`);
    } else if (activeDelivery.status === 'arrived_destination') {
      if (!hasCapturedPhoto) {
        showToast('Please capture delivery drop-off proof photo first', 'warning');
        return;
      }
      updateOrderStatus(activeDelivery.id, 'delivered', 'Order safely delivered to customer doorstep.');
      showToast('Delivery completed! Earnings added to your wallet.', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Driver Header & Shift Status Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={driver.avatar}
            alt={driver.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{driver.name}</h2>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                ★ {driver.rating} Rating
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {driver.vehicleModel} • <strong className="text-stone-200">{driver.vehiclePlate}</strong>
            </p>
            <span className="text-[11px] text-stone-400">
              {driver.totalDeliveries} Completed Courier Runs
            </span>
          </div>
        </div>

        {/* Online Toggle & Earnings stats */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Driver selector for testing different drivers */}
          <div className="text-xs text-stone-400">
            <span>Active Driver:</span>
            <select
              id="select-driver-profile"
              value={activeDriverId}
              onChange={(e) => setActiveDriverId(e.target.value)}
              className="ml-1.5 bg-stone-800 border border-stone-700 text-white font-bold rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehicleType})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-stone-800 border border-stone-700 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
              Today's Payout
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ${driver.todayEarnings.toFixed(2)} AUD
            </span>
          </div>

          <button
            id="btn-toggle-driver-online"
            onClick={() =>
              updateDriverStatus(driver.id, isOnline ? 'offline' : 'available')
            }
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Online • Ready for Dispatch' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Active Navigation Console + Available Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Active Delivery Turn-by-Turn GPS Console */}
        <div className="lg:col-span-8 space-y-6">
          {activeDelivery && activeDelivery.status !== 'delivered' ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-6">
              
              {/* Active Delivery Stage Banner */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700">
                      Active Courier Route • Order #{activeDelivery.orderNumber}
                    </span>
                    <h3 className="text-sm font-bold capitalize">
                      Current Step: {activeDelivery.status.replace(/_/g, ' ')}
                    </h3>
                  </div>
                </div>

                <span className="text-sm font-mono font-black text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                  +${(activeDelivery.deliveryFee + activeDelivery.driverTip).toFixed(2)} AUD Fee
                </span>
              </div>

              {/* Waypoints: Supermarket Pickup & Customer Dropoff */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pickup Store */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Pickup Store:
                  </span>
                  <div className="flex items-start gap-2.5">
                    <Store className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {activeDelivery.vendorNames.join(' & ')}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        240 George St, Sydney CBD NSW
                      </p>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                        {activeDelivery.items.length} Chilled Grocery Packages
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropoff Customer */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Customer Dropoff:
                  </span>
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {activeDelivery.customerName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {activeDelivery.deliveryAddress.street}, {activeDelivery.deliveryAddress.suburb}
                      </p>
                      <span className="text-[10px] text-stone-600 italic mt-1 block">
                        "{activeDelivery.deliveryAddress.deliveryInstructions || 'Leave at door'}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proof of Delivery / Photo Upload Simulation */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-stone-600" />
                  <span>Doorstep Photo Proof & Handover Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo Proof button */}
                  <button
                    id="btn-driver-capture-photo"
                    onClick={() => {
                      setHasCapturedPhoto(!hasCapturedPhoto);
                      showToast(hasCapturedPhoto ? 'Photo removed' : 'Doorstep photo captured and attached to receipt', 'info');
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      hasCapturedPhoto
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{hasCapturedPhoto ? '✓ Doorstep Photo Captured' : 'Take Drop-off Photo'}</span>
                  </button>

                  {/* Signature button */}
                  <button
                    id="btn-driver-signature"
                    onClick={() => {
                      setSignatureProvided(!signatureProvided);
                      showToast('Customer signature verified', 'info');
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      signatureProvided
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{signatureProvided ? '✓ Contactless Acknowledged' : 'Sign Handover'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Stage Action Button */}
              <button
                id="btn-advance-driver-status"
                onClick={handleAdvanceDeliveryStage}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 px-6 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {activeDelivery.status === 'driver_assigned' && (
                  <>
                    <Store className="w-4 h-4" />
                    <span>1. Confirm Arrival at Supermarket</span>
                  </>
                )}
                {(activeDelivery.status === 'driver_at_store' || activeDelivery.status === 'packing_items') && (
                  <>
                    <Package className="w-4 h-4" />
                    <span>2. Items Collected • Start GPS Navigation to Customer</span>
                  </>
                )}
                {activeDelivery.status === 'out_for_delivery' && (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>3. Arrived at Customer Residence</span>
                  </>
                )}
                {activeDelivery.status === 'arrived_destination' && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>4. Complete Drop-off & Receive +${(activeDelivery.deliveryFee + activeDelivery.driverTip).toFixed(2)} AUD</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No active delivery in progress</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                You are currently available. Accept an incoming grocery order from the dispatch pool below to start earning.
              </p>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Available Orders Radar & Dispatch Pool */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Available Dispatch Queue ({availableOrders.length})</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-3">
              {availableOrders.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">
                  No orders currently waiting for courier pickup.
                </p>
              ) : (
                availableOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 font-mono">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">
                        +${(ord.deliveryFee + ord.driverTip).toFixed(2)} AUD
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{ord.vendorNames.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{ord.deliveryAddress.suburb} ({ord.items.length} items)</span>
                      </div>
                    </div>

                    <button
                      id={`btn-accept-order-${ord.id}`}
                      onClick={() => handleAcceptOrder(ord.id)}
                      className="w-full bg-stone-900 hover:bg-black text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Accept Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
