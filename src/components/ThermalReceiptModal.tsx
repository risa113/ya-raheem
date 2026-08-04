import React from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { Printer, X } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable thermal container */}
        <div id="thermal-receipt" className="space-y-3 text-center font-mono text-xs">
          
          <div className="border-b border-black pb-2 space-y-1">
            <h2 className="text-base font-extrabold uppercase">{settings.restaurantName}</h2>
            <p>{settings.address}</p>
            <p>Ph: {settings.phone}</p>
            <p className="text-[10px]">GSTIN: 33AAAAA0000A1Z5</p>
          </div>

          <div className="flex justify-between text-left font-bold py-1 border-b border-dashed border-black">
            <span>Bill #: {order.orderNumber}</span>
            <span>{order.orderTime}</span>
          </div>

          <div className="text-left py-1 space-y-0.5">
            <p><strong>Customer:</strong> {order.customer.fullName}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Address:</strong> {order.customer.address}, {order.customer.area}</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-t border-b border-black my-2 py-1">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1">QTY</th>
                <th className="py-1">ITEM</th>
                <th className="py-1 text-right">AMT</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-0.5">{it.quantity}</td>
                  <td className="py-0.5">{it.product.name}</td>
                  <td className="py-0.5 text-right">₹{(it.product.offerPrice || it.product.price) * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="space-y-0.5 text-right">
            <p>Subtotal: ₹{order.subtotal}</p>
            {order.discount > 0 && <p>Discount: -₹{order.discount}</p>}
            <p>Delivery Fee: ₹{order.deliveryCharge}</p>
            <p>GST Tax (5%): ₹{order.tax}</p>
            <p className="text-sm font-extrabold border-t border-b border-black py-1 mt-1">
              GRAND TOTAL: ₹{order.grandTotal}
            </p>
            <p className="text-[10px] mt-1">Payment Method: {order.paymentMethod} ({order.paid ? 'PAID' : 'COD UNPAID'})</p>
          </div>

          <div className="pt-2 text-center text-[10px] border-t border-dashed border-black">
            <p>*** THANK YOU FOR ORDERING ***</p>
            <p>Visit Midnight Fuel Again! 🍗</p>
          </div>

        </div>

        {/* Action Button for screen view */}
        <div className="pt-2 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-black text-white hover:bg-gray-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Printer className="w-4 h-4" /> Print Thermal Bill
          </button>
        </div>

      </div>
    </div>
  );
};
