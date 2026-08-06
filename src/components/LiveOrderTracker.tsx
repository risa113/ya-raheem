import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPicker } from './MapPicker';
import { OrderStatus } from '../types';
import { 
  Clock, MapPin, PhoneCall, CheckCircle2, 
  ChefHat, Bike, PackageCheck, AlertCircle, MessageCircle, ArrowLeft 
} from 'lucide-react';

export const LiveOrderTracker: React.FC = () => {
  const { activeOrder, setActiveOrder, setCustomerTab, settings } = useStore();

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🛵</div>
        <h2 className="text-2xl font-bold text-white">No Active Order Selected</h2>
        <p className="text-gray-400 text-sm">
          Place a new order or select an existing order from your Order History!
        </p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-full text-xs transition"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const order = activeOrder;
  const statuses: OrderStatus[] = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status as OrderStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Accepted': return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
      case 'Preparing': return <ChefHat className="w-5 h-5 text-primary" />;
      case 'Ready': return <PackageCheck className="w-5 h-5 text-emerald-400" />;
      case 'Out for Delivery': return <Bike className="w-5 h-5 text-emerald-500 animate-bounce" />;
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'Cancelled': return <AlertCircle className="w-5 h-5 text-danger" />;
    }
  };

  const whatsappConfirmUrl = `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Midnight Fuel! Confirming my Order #${order.orderNumber} (Grand Total: ₹${order.grandTotal}). Please share live update!`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCustomerTab('orders')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>

        <span className="text-xs bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded-full font-bold">
          Order #{order.orderNumber}
        </span>
      </div>

      {/* Main Glass Status Hero Card */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl space-y-5 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs text-gray-400 block">ESTIMATED DELIVERY TIME</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-2xl font-extrabold text-white">{order.estimatedTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={whatsappConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" /> <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial bg-secondary hover:bg-secondary-light text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 transition"
            >
              <PhoneCall className="w-4 h-4 text-primary" /> <span>Call Kitchen</span>
            </a>
          </div>
        </div>

        {/* Status Stage Stepper Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300 flex-wrap gap-1">
            <span>Status: <strong className="text-primary uppercase">{order.status}</strong></span>
            <span className="text-gray-500">Placed at {order.orderTime}</span>
          </div>

          {/* Stepper Bar — horizontally scrollable on mobile, always shows labels */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            <div className="flex items-start gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-6">
              {statuses.map((st, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={st} className="flex flex-col items-center text-center space-y-1.5 w-14 sm:w-auto flex-shrink-0">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition ${
                      isCurrent
                        ? 'bg-primary border-white text-white shadow-glow-sm animate-pulse'
                        : isPassed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-secondary border-white/10 text-gray-600'
                    }`}>
                      {getStatusIcon(st)}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-semibold leading-tight ${
                      isPassed ? 'text-white' : 'text-gray-600'
                    }`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Driver Interactive Leaflet Map */}
        <div className="space-y-2 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" /> Live GPS Delivery Tracking
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Driver En Route
            </span>
          </div>

          <MapPicker
            mode="tracker"
            initialLat={order.customer.location?.lat || 8.7075}
            initialLng={order.customer.location?.lng || 77.7280}
            driverLat={order.driverLocation?.lat || 8.7120}
            driverLng={order.driverLocation?.lng || 77.7310}
            height="200px"
          />
        </div>

      </div>

      {/* Order Itemized Summary Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
          Order Summary & Invoice
        </h3>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-white">{item.product.name}</span>
              </div>
              <span className="font-bold text-white">
                ₹{(item.product.offerPrice || item.product.price) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between">
            <span>GST Tax</span>
            <span>₹{order.tax}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
            <span>Paid via {order.paymentMethod}</span>
            <span className="text-primary text-base">₹{order.grandTotal}</span>
          </div>
        </div>

        {/* Address Footer */}
        <div className="bg-secondary/60 p-3 rounded-xl text-xs text-gray-300 space-y-1 border border-white/5">
          <span className="font-bold text-white block">Deliver To:</span>
          <p>{order.customer.fullName} ({order.customer.phone})</p>
          <p className="text-gray-400">{order.customer.address}, {order.customer.area} - {order.customer.pincode}</p>
        </div>

      </div>

    </div>
  );
};
