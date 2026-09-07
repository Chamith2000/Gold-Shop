import React, { useState } from "react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Building,
  Truck,
  CreditCard,
  Printer,
  ChevronRight,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Order } from "../../types";

interface CheckoutStepsProps {
  initialRedeemedPoints?: number;
  onOrderCompleted: (order: Order) => void;
  onNavigateToShop: () => void;
}

type CheckoutStep = 1 | 2 | 3 | 4 | 5 | "confirmation";

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  initialRedeemedPoints = 0,
  onOrderCompleted,
  onNavigateToShop,
}) => {
  const { cart, subtotal, clearCart } = useCart();
  const { user, rewardProfile, isAuthenticated, refreshProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Order Summary (cart items display only, no form)
  // Step 2: Customer Information
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Step 3: Delivery Information
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Colombo");
  const [state, setState] = useState("Western Province (Colombo/Gampaha/Kalutara)");
  const [postalCode, setPostalCode] = useState("00100");
  const [deliveryMethod, setDeliveryMethod] = useState<"HOME_DELIVERY" | "STORE_PICKUP">("HOME_DELIVERY");
  const [deliveryNote, setDeliveryNote] = useState("");

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"BANK_TRANSFER" | "SHOWROOM_PICKUP" | "CASH_ON_DELIVERY">(
    "BANK_TRANSFER"
  );

  // Points Redemption
  const availablePoints = rewardProfile?.currentPoints || 0;
  const maxRedeemable = Math.min(availablePoints, Math.floor(subtotal * 0.3));
  const [redeemedPoints, setRedeemedPoints] = useState(Math.min(initialRedeemedPoints, maxRedeemable));

  const discountAmount = Math.min(redeemedPoints, maxRedeemable);
  const shippingFee = 0; // Complimentary
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const tierMultiplier =
    rewardProfile?.tier === "PLATINUM" ? 1.5 : rewardProfile?.tier === "GOLD" ? 1.25 : 1.0;
  const estimatedEarnedPoints = Math.floor((totalAmount / 100) * tierMultiplier);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.product?.id || item.giftProduct?.id || item.giftCombo?.id || "gift-item",
        quantity: item.quantity,
      }));

      const res = await api.orders.create({
        items: itemsPayload,
        shippingAddress: {
          fullName,
          phone,
          street: deliveryMethod === "HOME_DELIVERY" ? street : "Store Pickup",
          city: deliveryMethod === "HOME_DELIVERY" ? city : "Flagship Boutique",
          state: deliveryMethod === "HOME_DELIVERY" ? state : "Colombo",
          postalCode: deliveryMethod === "HOME_DELIVERY" ? postalCode : "11100",
          country: "Sri Lanka",
        },
        pointsToRedeem: discountAmount,
        paymentMethod,
        deliveryMethod,
      });

      setCompletedOrder(res.order);
      clearCart();
      refreshProfile();
      setCurrentStep("confirmation");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = fullName && email && phone;
  const canProceedToStep3 = deliveryMethod === "STORE_PICKUP" || (street && city && postalCode);
  const canProceedToStep4 = true;
  const canProceedToStep5 = true;

  const stepTitles: Record<CheckoutStep, string> = {
    1: "Order Summary",
    2: "Customer Information",
    3: "Delivery Information",
    4: "Payment Method",
    5: "Final Review",
    confirmation: "Order Confirmation",
  };

  if (completedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-8 sm:p-12 shadow-xl space-y-6">
            <div className="text-center space-y-3 border-b border-stone-200 pb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase font-bold text-[#B54E0E] tracking-wider font-cinzel">
                Acquisition Confirmed
              </span>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B]">
                Thank You for Your Royal Patronage
              </h1>
              <p className="text-xs text-stone-500 font-sans">
                Order Reference Number: <strong className="text-stone-900 font-mono">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            {/* Order Items & Breakdown */}
            <div className="space-y-4 text-xs font-sans">
              <h3 className="font-cinzel text-sm font-bold text-stone-900 uppercase">
                Acquired Masterpieces ({completedOrder.items.length})
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl p-3 bg-stone-50">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900">{item.productName}</span>
                      <span className="text-stone-500 block text-[11px]">
                        Purity: {item.goldPurity} &bull; Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#5A0F1B]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#FAF3E8] p-4 rounded-xl space-y-2 border border-[#D4AF37]/40">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rs. {completedOrder.subtotal.toLocaleString()}</span>
                </div>
                {completedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Loyalty Points Discount:</span>
                    <span>- Rs. {completedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Insured Express Shipping:</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/50 flex justify-between text-base font-bold text-[#5A0F1B] font-cinzel">
                  <span>Total Amount Paid / Due:</span>
                  <span>Rs. {completedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Earned Points Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Royal Points Awarded:
                </span>
                <span className="font-mono font-bold text-sm">+{completedOrder.earnedPoints} Points</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Royal Receipt
              </button>
              <button
                onClick={onNavigateToShop}
                className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Return to Boutique Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F1B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            Secure Sovereign Checkout
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5A0F1B] uppercase tracking-wide">
            {stepTitles[currentStep]}
          </h1>
          <p className="text-xs text-stone-600">Step {currentStep} of 5</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap max-w-2xl mx-auto">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-cinzel text-xs font-bold transition-all ${
                  step === currentStep
                    ? "bg-[#5A0F1B] text-white border-2 border-[#D4AF37]"
                    : step < (typeof currentStep === "number" ? currentStep : 5)
                      ? "bg-emerald-500 text-white"
                      : "bg-stone-200 text-stone-600"
                }`}
              >
                {step < (typeof currentStep === "number" ? currentStep : 5) ? "✓" : step}
              </div>
              {step < 5 && <ChevronRight className="w-4 h-4 text-stone-400" />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handlePlaceOrder} className="max-w-3xl mx-auto">
          {/* STEP 1: ORDER SUMMARY */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Your Items</h2>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {cart.map((item) => {
                  const itemId = item.product?.id || item.giftProduct?.id || item.giftCombo?.id || "";
                  const itemType = item.product ? "product" : item.giftProduct ? "gift" : "combo";
                  const name = item.product?.name || item.giftProduct?.name || item.giftCombo?.name || "Item";
                  const price = item.product?.price || item.giftProduct?.price || item.giftCombo?.comboPrice || 0;
                  const image =
                    item.product?.images?.[0] || item.giftProduct?.mainImage || item.giftCombo?.image || "";

                  return (
                    <div key={`${itemType}-${itemId}`} className="flex gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-stone-900">{name}</h4>
                        <p className="text-xs text-stone-600 mt-0.5">Qty: {item.quantity}</p>
                        <p className="font-bold text-[#5A0F1B] text-sm mt-1">
                          Rs. {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#FAF3E8] p-4 rounded-xl space-y-2 border border-[#D4AF37]/40">
                <div className="flex justify-between text-xs">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Shipping:</span>
                  <span className="text-emerald-600 font-medium">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/50 flex justify-between text-base font-bold text-[#5A0F1B]">
                  <span>Estimated Total:</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (canProceedToStep2) setCurrentStep(2);
                }}
                className="w-full bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                Continue to Customer Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: CUSTOMER INFORMATION */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <User className="w-5 h-5 text-[#B54E0E]" />
                <h2 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Your Information</h2>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (canProceedToStep2) setCurrentStep(3);
                  }}
                  disabled={!canProceedToStep2}
                  className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] disabled:opacity-50 text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERY INFORMATION */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <Truck className="w-5 h-5 text-[#B54E0E]" />
                <h2 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Delivery Method</h2>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "HOME_DELIVERY"
                      ? "bg-[#FAF3E8] border-[#D4AF37]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "HOME_DELIVERY"}
                    onChange={() => setDeliveryMethod("HOME_DELIVERY")}
                    className="mt-1 accent-[#5A0F1B]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">Insured Express Home Delivery</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Delivered via secure bullion courier to your address
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "STORE_PICKUP"
                      ? "bg-[#FAF3E8] border-[#D4AF37]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "STORE_PICKUP"}
                    onChange={() => setDeliveryMethod("STORE_PICKUP")}
                    className="mt-1 accent-[#5A0F1B]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">Store Pickup (Flagship Boutique)</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Sea Street, Colombo 11 &bull; Inspect piece before payment
                    </span>
                  </div>
                </label>
              </div>

              {deliveryMethod === "HOME_DELIVERY" && (
                <div className="bg-stone-50 p-4 rounded-xl space-y-4 border border-stone-200">
                  <h3 className="font-semibold text-stone-900">Delivery Address</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        required={deliveryMethod === "HOME_DELIVERY"}
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">City</label>
                        <input
                          type="text"
                          required={deliveryMethod === "HOME_DELIVERY"}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Province</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      >
                        <option value="Western Province (Colombo/Gampaha/Kalutara)">Western Province</option>
                        <option value="Central Province (Kandy/Matale/Nuwara Eliya)">Central Province</option>
                        <option value="Southern Province (Galle/Matara/Hambantota)">Southern Province</option>
                        <option value="North Western Province (Kurunegala/Puttalam)">North Western Province</option>
                        <option value="Sabaragamuwa Province (Ratnapura/Kegalle)">Sabaragamuwa Province</option>
                        <option value="Eastern / Northern / North Central">Other Provinces</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Delivery Instructions (Optional)</label>
                      <textarea
                        rows={2}
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder="e.g. Deliver before 4 PM or ring bell twice"
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-[#5A0F1B]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (canProceedToStep3) setCurrentStep(4);
                  }}
                  disabled={!canProceedToStep3}
                  className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] disabled:opacity-50 text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <CreditCard className="w-5 h-5 text-[#B54E0E]" />
                <h2 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "bg-[#FAF3E8] border-[#D4AF37]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 accent-[#5A0F1B]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Direct Bank Transfer</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Commercial Bank of Ceylon &bull; Account: 1000-8483-9292
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "bg-[#FAF3E8] border-[#D4AF37]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className="mt-1 accent-[#5A0F1B]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Cash on Delivery</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Pay to our courier upon delivery (Colombo & Suburbs)
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "SHOWROOM_PICKUP"
                      ? "bg-[#FAF3E8] border-[#D4AF37]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "SHOWROOM_PICKUP"}
                    onChange={() => setPaymentMethod("SHOWROOM_PICKUP")}
                    className="mt-1 accent-[#5A0F1B]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Store Pickup Payment</span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Inspect and pay at flagship boutique
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Review Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Order Summary</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {cart.map((item) => {
                      const name = item.product?.name || item.giftProduct?.name || item.giftCombo?.name || "Item";
                      const price = item.product?.price || item.giftProduct?.price || item.giftCombo?.comboPrice || 0;
                      return (
                        <div key={name} className="flex justify-between text-xs pb-2 border-b border-stone-100">
                          <span>{name} (x{item.quantity})</span>
                          <span className="font-bold text-[#5A0F1B]">Rs. {(price * item.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Customer & Delivery</h3>
                  <div className="space-y-3 text-xs text-stone-700">
                    <div>
                      <span className="font-semibold">Name:</span> {fullName}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {email}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {phone}
                    </div>
                    {deliveryMethod === "HOME_DELIVERY" && (
                      <>
                        <div>
                          <span className="font-semibold">Address:</span> {street}, {city}, {postalCode}
                        </div>
                        <div>
                          <span className="font-semibold">Province:</span> {state}
                        </div>
                      </>
                    )}
                    <div>
                      <span className="font-semibold">Delivery:</span>{" "}
                      {deliveryMethod === "HOME_DELIVERY" ? "Insured Express Home Delivery" : "Store Pickup"}
                    </div>
                    <div>
                      <span className="font-semibold">Payment:</span> {paymentMethod.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Price Breakdown & Submit */}
              <div>
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs sticky top-28 space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-[#5A0F1B] uppercase">Final Total</h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    {redeemedPoints > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Points Discount:</span>
                        <span>-Rs. {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping:</span>
                      <span className="text-emerald-600 font-medium">Complimentary</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-[#5A0F1B]">
                      <span>Total:</span>
                      <span>Rs. {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {isAuthenticated && availablePoints > 0 && (
                    <div className="bg-[#FAF3E8] p-3 rounded-xl border border-[#D4AF37]/50 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#5A0F1B]">Redeeming Points:</span>
                        <span className="text-[#B54E0E]">{redeemedPoints} Pts</span>
                      </div>
                      <div className="text-[10px] text-stone-600">
                        Available: {availablePoints} Pts • Discount: Rs. {discountAmount.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#D4AF37]/40 text-[10px] text-[#5A0F1B] flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      Points to earn:
                    </span>
                    <span className="font-bold">+{estimatedEarnedPoints} Pts</span>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-lg font-cinzel text-xs font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || cart.length === 0}
                      className="flex-1 bg-[#5A0F1B] hover:bg-[#400A13] disabled:opacity-50 text-white py-2 rounded-lg font-cinzel text-xs font-bold transition-all"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>100% Secure & Certified</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
