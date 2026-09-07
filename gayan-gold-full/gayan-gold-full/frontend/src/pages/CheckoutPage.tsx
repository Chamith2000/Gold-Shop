import React from "react";
import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { Order } from "../types";

interface CheckoutPageProps {
  initialRedeemedPoints?: number;
  onOrderCompleted?: (order: Order) => void;
  onNavigateToShop?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialRedeemedPoints = 0,
  onOrderCompleted = () => {},
  onNavigateToShop = () => {},
}) => {
  return (
    <CheckoutSteps
      initialRedeemedPoints={initialRedeemedPoints}
      onOrderCompleted={onOrderCompleted}
      onNavigateToShop={onNavigateToShop}
    />
  );
};
