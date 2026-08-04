import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, CustomerInfo } from '../types';
import { MapPicker } from './MapPicker';
import { launchRazorpayPayment } from '../services/api';
import { 
  X, MapPin, Phone, User, CreditCard, Wallet, 
  CheckCircle, ArrowRight, ShieldCheck, Home, Building, Navigation, Clock 
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
  const [altPhone, setAltPhone] = useState<string>('');
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [area, setArea] = useState<string>('Melapalayam');
  const [pincode, setPincode] = useState<string>('627005');
  const [notes, setNotes] = useState<string>('');
  
  // Melapalayam, Tirunelveli Default Pin Coordinates
  const [lat, setLat] = useState<number>(8.7075);
  const [lng, setLng] = useState<number>(77.7280);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
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

    if (!fullName.trim() || !phone.trim() || !address.trim() || !area.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, Address Type, and Delivery Address.');
      return;
    }

    const customer: CustomerInfo = {
      fullName,
      phone,
      altPhone,
      addressType,
      address,
      landmark,
      area,
      pincode,
      location: { lat, lng },
      notes,
    };

    if (paymentMethod === 'ONLINE_RAZORPAY') {
      setLoading(true);
      await launchRazorpayPayment(
        grandTotal,
        fullName,
        phone,
        (paymentResponse) => {
          setLoading(false);
          const order = placeOrder(customer, 'ONLINE_RAZORPAY');
          order.paid = true;
          onOrderCompleted();
        },
        (err) => {
          setLoading(false);
          setErrorMsg(`Online Payment Failed: ${err}`);
        }
      );
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        placeOrder(customer, 'COD');
        onOrderCompleted();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-darkbg border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-extrabold uppercase">
              ⚡ Checkout & Delivery Location
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">Complete Your Midnight Order</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/40 text-danger p-3 rounded-xl text-xs font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrderSubmit} className="space-y-5">
          
          {/* Section 1: Customer Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohamed Aslam"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9080139363"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Alternative Contact Number (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210 (Family / Alternate)"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Address Type & Exact Delivery Location */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> 2. Delivery Address & GPS Coordinates
            </h3>

            {/* Address Type Selector: Home / Office / Other */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Save Address As *</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Home', label: 'Home', icon: Home },
                  { id: 'Office', label: 'Office', icon: Building },
                  { id: 'Other', label: 'Other', icon: MapPin },
                ].map(type => {
                  const Icon = type.icon;
                  const isSelected = addressType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAddressType(type.id as any)}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition border ${
                        isSelected 
                          ? 'bg-primary text-white border-primary shadow-glow-sm' 
                          : 'bg-secondary text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Door Number & Street Name */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Door / House / Flat No & Street Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Door No 42/B, Main Street, Near Mosque"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near Meera Broilers"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Area / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Melapalayam"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="627005"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-secondary text-xs text-white p-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive OpenStreetMap Pin Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Exact GPS Pin Position</span>
                <span className="text-[10px] text-primary">GPS: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
              </label>
              <MapPicker
                mode="picker"
                initialLat={lat}
                initialLng={lng}
                height="160px"
                onLocationSelect={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />
            </div>

          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 3. Select Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                  paymentMethod === 'COD' ? 'bg-primary/20 border-primary text-white shadow-glow-sm' : 'bg-secondary border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    💵 Cash on Delivery
                  </span>
                  {paymentMethod === 'COD' && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[10px] text-gray-400">Pay cash upon hot food arrival</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE_RAZORPAY')}
                className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                  paymentMethod === 'ONLINE_RAZORPAY' ? 'bg-primary/20 border-primary text-white shadow-glow-sm' : 'bg-secondary border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    💳 Razorpay UPI / Card
                  </span>
                  {paymentMethod === 'ONLINE_RAZORPAY' && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[10px] text-gray-400">Instant UPI, GPay, PhonePe, Cards</p>
              </button>
            </div>
          </div>

          {/* Order Summary & Submit Button */}
          <div className="bg-secondary/90 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Delivery Fee</span>
              <span>₹{deliveryCharge}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400 font-bold">
                <span>Discount Applied</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
              <span>Grand Total</span>
              <span className="text-primary text-base">₹{grandTotal}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-3.5 rounded-xl text-sm transition shadow-glow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Order...' : `Place Order (₹${grandTotal}) →`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
