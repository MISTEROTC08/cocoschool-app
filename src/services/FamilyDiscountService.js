class FamilyDiscountService {
  constructor() {
    this.discountTiers = [
      { minMembers: 3, discount: 0.10 }, // 10% pour 3 membres
      { minMembers: 4, discount: 0.15 }, // 15% pour 4 membres
      { minMembers: 5, discount: 0.20 }, // 20% pour 5+ membres
    ];
  }

  // Calculer la réduction pour une famille
  calculateDiscount = async (familyId) => {
    try {
      // Obtenir les informations de la famille
      const response = await fetch(`/api/families/${familyId}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des membres');
      }

      const members = await response.json();
      const activeMembers = members.filter(m => m.status === 'active');

      // Trouver le niveau de réduction approprié
      const tier = this.discountTiers
        .slice()
        .reverse()
        .find(t => activeMembers.length >= t.minMembers);

      return tier ? tier.discount : 0;
    } catch (error) {
      console.error('Erreur calcul réduction:', error);
      return 0;
    }
  };

  // Calculer le prix avec réduction
  applyDiscount = (basePrice, discount) => {
    return basePrice * (1 - discount);
  };

  // Vérifier l'éligibilité pour une réduction
  checkEligibility = async (familyId) => {
    try {
      // Vérifier les conditions d'éligibilité
      const [members, paymentHistory] = await Promise.all([
        this.getFamilyMembers(familyId),
        this.getPaymentHistory(familyId)
      ]);

      // Vérifier le nombre de membres actifs
      const activeMembers = members.filter(m => m.status === 'active');
      if (activeMembers.length < 3) {
        return {
          eligible: false,
          reason: 'Minimum 3 membres requis'
        };
      }

      // Vérifier l'historique de paiement
      const hasPaymentIssues = paymentHistory.some(p => p.status === 'failed');
      if (hasPaymentIssues) {
        return {
          eligible: false,
          reason: 'Problèmes de paiement détectés'
        };
      }

      return {
        eligible: true,
        discount: this.calculateDiscount(activeMembers.length)
      };
    } catch (error) {
      console.error('Erreur vérification éligibilité:', error);
      throw error;
    }
  };

  // Obtenir l'historique des réductions
  getDiscountHistory = async (familyId) => {
    try {
      const response = await fetch(`/api/families/${familyId}/discounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur récupération historique');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur historique réductions:', error);
      throw error;
    }
  };

  // Appliquer une réduction promotionnelle
  applyPromoDiscount = async (familyId, promoCode) => {
    try {
      const response = await fetch(`/api/families/${familyId}/promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ promoCode }),
      });

      if (!response.ok) {
        throw new Error('Code promo invalide');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur application promo:', error);
      throw error;
    }
  };
}

// Créer une instance singleton
const familyDiscountService = new FamilyDiscountService();
export { familyDiscountService };