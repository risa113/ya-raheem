import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPicker } from './MapPicker';
import { ThermalReceiptModal } from './ThermalReceiptModal';
import { OrderStatus } from '../types';
import { 
  Clock, MapPin, PhoneCall, CheckCircle2, 
  ChefHat, Bike, PackageCheck, AlertCircle, MessageCircle, ArrowLeft, Printer, Star, User, Mic, Volume2, PhoneOff, Send, X
} from 'lucide-react';

export const LiveOrderTracker: React.FC = () => {
  const { activeOrder, setActiveOrder, setCustomerTab, settings } = useStore();
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showDriverCall, setShowDriverCall] = useState<boolean>(false);
  const [showDriverChat, setShowDriverChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'driver', text: 'Are you coming?', time: '8:10 pm' },
    { sender: 'customer', text: 'Hey, Congratulations for order', time: '8:11 pm' },
    { sender: 'customer', text: 'Hey Where are you now?', time: '8:11 pm' },
    { sender: 'driver', text: "I'm Coming , just wait ...", time: '8:12 pm' },
    { sender: 'customer', text: 'Hurry Up, Man', time: '8:12 pm' },
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🛵</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">No Active Order Selected</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Place a new order or select an existing order from your Order History!
        </p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="bg-primary hover:bg-primary-hover text-white font-black px-6 py-3 rounded-full text-xs transition shadow-ios-orange"
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
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Accepted': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'Preparing': return <ChefHat className="w-5 h-5 text-primary" />;
      case 'Ready': return <PackageCheck className="w-5 h-5 text-emerald-500" />;
      case 'Out for Delivery': return <Bike className="w-5 h-5 text-emerald-500 animate-bounce" />;
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'Cancelled': return <AlertCircle className="w-5 h-5 text-danger" />;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([...chatMessages, { sender: 'customer', text: inputMsg, time: now }]);
    setInputMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveOrder(null);
            setCustomerTab('orders');
          }}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition font-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="flex items-center gap-1.5 bg-secondary-soft dark:bg-secondary text-gray-900 dark:text-white border border-black/5 dark:border-white/10 px-3 py-1.5 rounded-full text-xs font-black transition"
          >
            <Printer className="w-3.5 h-3.5 text-primary" /> Receipt
          </button>

          <span className="text-xs bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded-full font-black">
            Order #{order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white dark:bg-secondary border border-black/5 dark:border-white/10 p-5 sm:p-7 rounded-3xl space-y-6 shadow-ios-card relative overflow-hidden transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
          <div>
            <span className="text-xs text-gray-400 font-black uppercase tracking-wider">ESTIMATED DELIVERY TIME</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-7 h-7 text-primary animate-pulse" />
              <span className="text-3xl font-black text-gray-900 dark:text-white">{order.estimatedTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDriverChat(true)}
              className="flex-1 sm:flex-initial bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" /> <span>Chat Driver</span>
            </button>

            <button
              onClick={() => setShowDriverCall(true)}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary-hover text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-ios-orange transition"
            >
              <PhoneCall className="w-4 h-4" /> <span>Call Driver</span>
            </button>
          </div>
        </div>

        {/* Driver Card - Matching Phase 2 UI Kit */}
        <div className="bg-secondary-soft dark:bg-darkbg border border-black/5 dark:border-white/10 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shadow-ios-orange">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-gray-900 dark:text-white">Robert Fox</h4>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" /> 4.9
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Delivery Courier • Express Bike</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowDriverChat(true)}
              className="p-2.5 rounded-2xl bg-white dark:bg-secondary text-primary hover:bg-primary hover:text-white transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowDriverCall(true)}
              className="p-2.5 rounded-2xl bg-primary text-white shadow-ios-orange hover:bg-primary-hover transition"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-gray-700 dark:text-gray-300">
            <span>Status: <strong className="text-primary uppercase">{order.status}</strong></span>
            <span className="text-gray-400">Placed at {order.orderTime}</span>
          </div>

          <div className="overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            <div className="flex items-start gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-6">
              {statuses.map((st, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={st} className="flex flex-col items-center text-center space-y-1.5 w-16 sm:w-auto flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition ${
                      isCurrent
                        ? 'bg-primary border-primary text-white shadow-ios-orange animate-pulse'
                        : isPassed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-secondary-soft dark:bg-darkbg border-black/5 dark:border-white/10 text-gray-400'
                    }`}>
                      {getStatusIcon(st)}
                    </div>
                    <span className={`text-[10px] font-black leading-tight ${
                      isPassed ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-black text-gray-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" /> Track Courier Live
            </span>
            <span className="text-[11px] text-emerald-500 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Live Route GPS
            </span>
          </div>

          <MapPicker
            mode="tracker"
            initialLat={order.customer.location?.lat || 8.7075}
            initialLng={order.customer.location?.lng || 77.7280}
            driverLat={order.driverLocation?.lat || 8.7120}
            driverLng={order.driverLocation?.lng || 77.7310}
            height="240px"
          />
        </div>

      </div>

      {/* Driver Calling Modal Overlay (Matching Phase 2 UI Kit Image 2 & 5) */}
      {showDriverCall && (
        <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-secondary max-w-sm w-full rounded-3xl p-8 text-center space-y-6 shadow-ios-lg relative text-gray-900 dark:text-white">
            
            <button
              onClick={() => setShowDriverCall(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Avatar Photo */}
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-ios-orange relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Robert Fox"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-black">Robert Fox</h3>
              <p className="text-xs text-primary font-bold animate-pulse mt-0.5">Connecting call...</p>
            </div>

            {/* Call Action Controls */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <button className="w-12 h-12 rounded-full bg-secondary-soft dark:bg-darkbg text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-sm">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowDriverCall(false)}
                className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <button className="w-12 h-12 rounded-full bg-secondary-soft dark:bg-darkbg text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-sm">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Driver Chat Modal Overlay (Matching Phase 2 UI Kit Image 2 & 5) */}
      {showDriverChat && (
        <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-secondary max-w-md w-full rounded-3xl overflow-hidden shadow-ios-lg flex flex-col h-[520px] border border-black/5 dark:border-white/10">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-secondary-soft dark:bg-darkbg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black">
                  RF
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">Robert Fox</h4>
                  <span className="text-[10px] text-emerald-500 font-bold">Online • Driver</span>
                </div>
              </div>

              <button
                onClick={() => setShowDriverChat(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-lightbg dark:bg-darkbg">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-bold ${
                    msg.sender === 'customer'
                      ? 'bg-primary text-white rounded-br-none shadow-ios-orange'
                      : 'bg-white dark:bg-secondary text-gray-900 dark:text-white rounded-bl-none border border-black/5 dark:border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-secondary flex gap-2">
              <input
                type="text"
                placeholder="Write something..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-secondary-soft dark:bg-darkbg text-xs text-gray-900 dark:text-white px-4 py-2.5 rounded-full border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-ios-orange hover:bg-primary-hover transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Thermal Receipt Modal */}
      {showReceiptModal && (
        <ThermalReceiptModal
          order={order}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

    </div>
  );
};
