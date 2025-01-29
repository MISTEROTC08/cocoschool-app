import React, { useState } from 'react';
import {
  Dialog,
  Button,
  Textarea,
  RadioGroup,
  Label,
  Alert,
} from '@/components/ui';
import { Star } from 'lucide-react';
import { ratingService } from '@/services/RatingService';

const ratingCategories = [
  { id: 'punctuality', label: 'Ponctualité' },
  { id: 'driving', label: 'Conduite' },
  { id: 'cleanliness', label: 'Propreté du véhicule' },
  { id: 'communication', label: 'Communication' },
  { id: 'behavior', label: 'Comportement' },
];

const RatingModal = ({
  isOpen,
  onClose,
  rideId,
  userId,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState({
    score: 0,
    comment: '',
    categories: ratingCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: 0
    }), {}),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStarClick = (score) => {
    setRating(prev => ({
      ...prev,
      score
    }));
  };

  const handleCategoryChange = (categoryId, value) => {
    setRating(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ratingService.submitRating(rideId, userId, rating);
      onRatingSubmitted?.();
      onClose();
    } catch (err) {
      setError('Erreur lors de la soumission de l'évaluation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="max-w-md w-full"
    >
      <Dialog.Title className="text-xl font-semibold mb-4">
        Évaluer le trajet
      </Dialog.Title>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Note globale */}
        <div>
          <Label>Note globale</Label>
          <div className="flex justify-center space-x-2 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={`p-1 rounded-full transition-colors
                  ${rating.score >= star 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-200'
                  }`}
              >
                <Star
                  className="h-8 w-8"
                  fill={rating.score >= star ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="space-y-4">
          <Label>Évaluation détaillée</Label>
          {ratingCategories.map((category) => (
            <div key={category.id}>
              <Label>{category.label}</Label>
              <RadioGroup
                value={rating.categories[category.id]}
                onValueChange={(value) => 
                  handleCategoryChange(category.id, Number(value))
                }
                className="flex space-x-4 mt-1"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <RadioGroup.Item
                    key={value}
                    value={value}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${rating.categories[category.id] === value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {value}
                  </RadioGroup.Item>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        {/* Commentaire */}
        <div>
          <Label>Commentaire (optionnel)</Label>
          <Textarea
            value={rating.comment}
            onChange={(e) => setRating(prev => ({
              ...prev,
              comment: e.target.value
            }))}
            placeholder="Partagez votre expérience..."
            className="mt-1"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!rating.score || loading}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default RatingModal;