import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export const createPaymentSession = async (rideDetails) => {
  try {
    const response = await fetch('/api/create-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ride: rideDetails,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      }),
    });

    const session = await response.json();
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Erreur de paiement:', error);
    throw error;
  }
};

export const createFamilySubscription = async (familyDetails) => {
  try {
    const response = await fetch('/api/create-family-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family: familyDetails,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      }),
    });

    const session = await response.json();
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Erreur de souscription:', error);
    throw error;
  }
};

export const calculateFamilyDiscount = (memberCount) => {
  if (memberCount >= 5) return 0.20; // 20% de réduction
  if (memberCount >= 4) return 0.15; // 15% de réduction
  if (memberCount >= 3) return 0.10; // 10% de réduction
  return 0;
};

export const processRefund = async (paymentId) => {
  try {
    const response = await fetch('/api/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
      }),
    });

    const refund = await response.json();
    return refund;
  } catch (error) {
    console.error('Erreur de remboursement:', error);
    throw error;
  }
};