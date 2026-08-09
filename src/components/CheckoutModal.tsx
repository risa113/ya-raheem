import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, CustomerInfo } from '../types';
import { MapPicker } from './MapPicker';
import { launchRazorpayPayment } from '../services/api';
import { 
  X, MapPin, Phone, User, CreditCard, Wallet, 
  CheckCircle, ArrowRight, ShieldCheck, Home, Building, Plus, Lock, Check
} from 'lucide-react';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { 
    cart, subtotal, deliveryCharge, tax, discount, grandTotal, 
    placeOrder, userPhone, userName, userEmail, isLoggedIn, setIsAuthModalOpen 
  } = useStore();

  const [fullName, setFullName] = useState<string>(userName || '');
  const [phone, setPhone] = useState<string>(userPhone || '');
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [address, setAddress] = useState<string>('2464 Royal Ln. Mesa, New Jersey 34567');
  const [area, setArea] = useState<string>('Melapalayam');
  const [pincode, setPincode] = useState<string>('627005');
  
  // Coordinates
  const [lat, setLat] = useState<number>(8.7075);
  const [lng, setLng] = useState<number>(77.7280);

  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Visa' | 'Mastercard' | 'Paypal'>('Mastercard');
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  
  // Card form state
  const [cardHolder, setCardHolder] = useState<string>('Vishal Khadok');
  const [cardNumber, setCardNumber] = useState<string>('2134 5678 9101 4362');
  const [expireDate, setExpireDate] = useState<string>('09/2028');
  const [cvc, setCvc] = useState<string>('345');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLoggedIn) {
      onClose();
      setIsAuthModalOpen(true);
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }

    const customer: CustomerInfo = {
      fullName,
      phone,
      addressType,
      address,
      area,
      pincode,
      location: { lat, lng },
    };

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      placeOrder(customer, paymentMethod === 'Cash' ? 'COD' : 'ONLINE_RAZORPAY');
      onOrderCompleted();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-secondary border border-black/5 dark:border-white/10 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-6 shadow-ios-lg relative text-gray-900 dark:text-white transition-colors">
        
        {/* Header matching Phase 2 UI Kit */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black">Payment & Checkout</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Select payment method & delivery location</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/40 text-danger p-3 rounded-2xl text-xs font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Payment Tabs Bar matching Image 2 & 5 of UI Kit */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
            Select Payment Method
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'Cash', label: 'Cash', icon: '💵' },
              { id: 'Visa', label: 'Visa', icon: '💳' },
              { id: 'Mastercard', label: 'Mastercard', icon: '🔴🟡' },
              { id: 'Paypal', label: 'Paypal', icon: '🅿️' },
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id as any)}
                className={`py-3 px-2 rounded-2xl text-xs font-black border transition flex flex-col items-center gap-1 ${
                  paymentMethod === pm.id
                    ? 'bg-primary text-white border-primary shadow-ios-orange'
                    : 'bg-secondary-soft dark:bg-darkbg text-gray-700 dark:text-gray-300 border-black/5 dark:border-white/10 hover:border-primary'
                }`}
              >
                <span className="text-lg">{pm.icon}</span>
                <span>{pm.label}</span>
              </button>
            ))}
          </div>

          {/* Saved Card Option Card */}
          {paymentMethod !== 'Cash' && (
            <div className="bg-secondary-soft dark:bg-darkbg p-4 rounded-2xl border border-black/5 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔴🟡</span>
                  <div>
                    <h4 className="text-xs font-black">Master Card</h4>
                    <p className="text-[10px] text-gray-400 font-mono">•••• •••• •••• 436</p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-primary font-black" />
              </div>

              <button
                type="button"
                onClick={() => setShowAddCardModal(true)}
                className="w-full py-2.5 border-2 border-dashed border-primary/40 text-primary font-black text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary/10 transition uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> ADD NEW CARD
              </button>
            </div>
          )}
        </div>

        {/* Address Selection Section */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-white/10">
          <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
            Delivery Address
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-secondary-soft dark:bg-darkbg border-2 border-primary p-3.5 rounded-2xl space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> HOME
                </span>
                <Check className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">{address}</p>
            </div>

            <div className="bg-secondary-soft dark:bg-darkbg border border-black/5 dark:border-white/10 p-3.5 rounded-2xl space-y-1 opacity-70">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> WORK
              </span>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">3891 Ranchview Dr. Richardson, California</p>
            </div>
          </div>

          <MapPicker
            mode="picker"
            initialLat={lat}
            initialLng={lng}
            height="140px"
            onLocationSelect={(nLat, nLng) => {
              setLat(nLat);
              setLng(nLng);
            }}
          />
        </div>

        {/* Total & Confirm Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-gray-500 font-bold uppercase">TOTAL PAYMENT</span>
            <span className="text-2xl font-black text-primary">₹{grandTotal}</span>
          </div>

          <button
            onClick={handlePlaceOrderSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black py-4 rounded-2xl text-sm shadow-ios-orange transition transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : 'PAY & CONFIRM'}</span>
          </button>
        </div>

      </div>

      {/* Add Card Modal Overlay matching Image 2 & 5 */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-secondary max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-ios-lg relative text-gray-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-black">Add Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">Card Holder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-secondary-soft dark:bg-darkbg text-xs font-bold text-gray-900 dark:text-white p-3 rounded-xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-secondary-soft dark:bg-darkbg text-xs font-mono font-bold text-gray-900 dark:text-white p-3 rounded-xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">Expire Date</label>
                  <input
                    type="text"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="w-full bg-secondary-soft dark:bg-darkbg text-xs font-bold text-gray-900 dark:text-white p-3 rounded-xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-gray-400 block mb-1">CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full bg-secondary-soft dark:bg-darkbg text-xs font-bold text-gray-900 dark:text-white p-3 rounded-xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCardModal(false)}
              className="w-full bg-primary hover:bg-primary-hover text-white font-black py-3.5 rounded-2xl text-xs shadow-ios-orange transition uppercase tracking-wider"
            >
              ADD & MAKE PAYMENT
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
