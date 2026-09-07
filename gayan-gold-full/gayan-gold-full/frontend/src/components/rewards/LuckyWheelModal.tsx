import React, { useState, useEffect, useRef } from "react";
import { X, Flame, Sparkles, Award, Clock, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { LuckySpinStatus } from "../../types";

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLogin: () => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLogin,
}) => {
  const { isAuthenticated, refreshProfile } = useAuth();
  const [spinStatus, setSpinStatus] = useState<LuckySpinStatus | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [wonPoints, setWonPoints] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const wheelRef = useRef<HTMLDivElement>(null);

  const fetchStatus = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.rewards.getSpinStatus();
      setSpinStatus(data);
      setTimeLeft(data.secondsRemaining || 0);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setResultMessage(null);
      setWonPoints(null);
      setErrorMessage(null);
    }
  }, [isOpen, isAuthenticated]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchStatus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const segments = spinStatus?.segments || [
    { id: "seg-1", name: "50 Gold Pts", rewardPoints: 50, color: "#5A0F1B" },
    { id: "seg-2", name: "100 Gold Pts", rewardPoints: 100, color: "#D4AF37" },
    { id: "seg-3", name: "250 Royal Pts", rewardPoints: 250, color: "#8A1C2C" },
    { id: "seg-4", name: "500 Grand Pts", rewardPoints: 500, color: "#B54E0E" },
    { id: "seg-5", name: "1,000 Sovereign", rewardPoints: 1000, color: "#3C0812" },
    { id: "seg-6", name: "Better Luck", rewardPoints: 0, color: "#781726" },
    { id: "seg-7", name: "5,000 Empress", rewardPoints: 5000, color: "#C59B27" },
    { id: "seg-8", name: "10,000 Crown", rewardPoints: 10000, color: "#B54E0E" },
  ];

  const handleSpin = async () => {
    if (!isAuthenticated) {
      onClose();
      onNavigateToLogin();
      return;
    }

    if (isSpinning || timeLeft > 0) return;

    setIsSpinning(true);
    setErrorMessage(null);
    setResultMessage(null);
    setWonPoints(null);

    try {
      const response = await api.rewards.spinWheel();

      // Find index of winning segment
      const winIndex = segments.findIndex(
        (s) => s.id === response.winningSegment.id || s.name === response.winningSegment.name
      );
      const targetIndex = winIndex >= 0 ? winIndex : 1;

      // Calculate target angle (each segment occupies 360 / segments.length degrees)
      const numSegments = segments.length;
      const segmentAngle = 360 / numSegments;
      // Wheel spins clockwise, pointer is at top (270 or 0 deg), adjust for center of segment
      const extraSpins = 360 * 5; // 5 full rotations
      const destinationAngle =
        extraSpins + (numSegments - targetIndex) * segmentAngle - segmentAngle / 2;

      setSpinAngle(destinationAngle);

      // Wait for spin animation (4 seconds)
      setTimeout(() => {
        setIsSpinning(false);
        setWonPoints(response.rewardPoints);
        setResultMessage(response.message);
        setTimeLeft(response.secondsRemaining || 86400);
        refreshProfile();

        if (response.rewardPoints > 0) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#D4AF37", "#B54E0E", "#5A0F1B", "#FAF8F5"],
          });
        }
      }, 4000);
    } catch (err: any) {
      setIsSpinning(false);
      setErrorMessage(err.message || "Spin failed. Please try again later.");
    }
  };

  if (!isOpen) return null;

  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => !isSpinning && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#FAF8F5] border-2 border-[#D4AF37] p-6 shadow-2xl transition-all font-sans animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={() => !isSpinning && onClose()}
            disabled={isSpinning}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#D4AF37]/50 text-[#B54E0E] text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
              Daily Royal Wheel of Fortune
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5A0F1B] uppercase tracking-wider">
              Spin to Win Gold Points
            </h3>
            <p className="text-xs text-stone-600">
              Every patron is entitled to one complimentary spin every 24 hours. Points redeemable for instant checkout discounts!
            </p>
          </div>

          {/* Wheel Graphic Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-4 flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 z-30 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#D4AF37] drop-shadow-md" />
              <div className="w-3 h-3 rounded-full bg-[#5A0F1B] -mt-1 border border-[#D4AF37]" />
            </div>

            {/* Outer Gold Bezel */}
            <div className="absolute inset-0 rounded-full border-8 border-[#D4AF37] shadow-xl pointer-events-none z-20" />

            {/* Rotating SVG Wheel */}
            <div
              ref={wheelRef}
              style={{
                transform: `rotate(${spinAngle}deg)`,
                transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
              }}
              className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
            >
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {segments.map((seg, index) => {
                  const startAngle = (index * 360) / numSegments;
                  const endAngle = ((index + 1) * 360) / numSegments;
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;

                  const x1 = 200 + 200 * Math.cos(startRad);
                  const y1 = 200 + 200 * Math.sin(startRad);
                  const x2 = 200 + 200 * Math.cos(endRad);
                  const y2 = 200 + 200 * Math.sin(endRad);

                  const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

                  // Text rotation
                  const midAngle = startAngle + segmentAngle / 2;

                  return (
                    <g key={seg.id || index}>
                      <path
                        d={pathData}
                        fill={seg.color || (index % 2 === 0 ? "#5A0F1B" : "#B54E0E")}
                        stroke="#D4AF37"
                        strokeWidth="2"
                      />
                      <text
                        x="200"
                        y="60"
                        transform={`rotate(${midAngle}, 200, 200)`}
                        fill="#FAF8F5"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="Cinzel, serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {seg.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Central Monogrammed Spin Button */}
            <div className="absolute z-20 w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF8F5] to-[#F3E5AB] border-4 border-[#D4AF37] shadow-lg flex flex-col items-center justify-center p-1">
              <span className="font-cinzel text-xs font-bold text-[#5A0F1B] leading-none">
                GAYAN
              </span>
              <span className="text-[8px] font-bold text-[#B54E0E] uppercase tracking-widest mt-0.5">
                GOLD
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 animate-spin" />
            </div>
          </div>

          {/* Outcome Notice */}
          {resultMessage && (
            <div className="my-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 animate-in fade-in">
              <p className="font-cinzel text-sm font-bold">{resultMessage}</p>
              {wonPoints !== null && wonPoints > 0 && (
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  +{wonPoints} Points added to your royal balance!
                </p>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="my-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Trigger / Cooldown status */}
          <div className="mt-5 space-y-3">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToLogin();
                }}
                className="w-full bg-[#5A0F1B] text-white py-3 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#400A13] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Sign In to Spin the Royal Wheel
              </button>
            ) : timeLeft > 0 ? (
              <div className="bg-stone-100 border border-stone-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-stone-600">
                <Clock className="w-4 h-4 text-[#B54E0E]" />
                <span className="text-xs font-medium">Next Spin Available in:</span>
                <span className="font-mono text-xs font-bold text-[#5A0F1B]">
                  {formatCountdown(timeLeft)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-[#5A0F1B] via-[#8A1C2C] to-[#B54E0E] hover:opacity-95 text-[#FAF8F5] py-3.5 rounded-xl font-cinzel text-sm font-bold uppercase tracking-wider transition-all shadow-lg border border-[#D4AF37]/50 disabled:opacity-50 flex items-center justify-center gap-2"
                id="lucky-spin-action-btn"
              >
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                {isSpinning ? "Spinning Royal Wheel..." : "Spin the Wheel Now"}
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Free Daily
              </span>
              <span>•</span>
              <span>1 Pt = Rs. 1.00 Off</span>
              <span>•</span>
              <span>Tier Multipliers Apply</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
