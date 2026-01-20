import React, { useState } from 'react';

const AdjustableServings = ({ originalServings = 1, ingredients = [], onMultiplierChange }) => {
  const [multiplier, setMultiplier] = useState(1);

  const handleMultiplierChange = (value) => {
    setMultiplier(value);
    onMultiplierChange?.(value);
  };

  const adjustQuantity = (quantity, amount) => {
    if (!quantity) return quantity;

    // Parse quantity string like "2 cups" or "1/2"
    const parts = quantity.split(' ');
    if (parts.length === 0) return quantity;

    const numberPart = parts[0];
    const unitPart = parts.slice(1).join(' ') || '';

    // Handle fractions like "1/2"
    let numValue = 0;
    if (numberPart.includes('/')) {
      const [num, denom] = numberPart.split('/').map(Number);
      numValue = num / denom;
    } else {
      numValue = parseFloat(numberPart);
    }

    if (isNaN(numValue)) return quantity;

    const newValue = (numValue * amount).toFixed(2);
    return `${parseFloat(newValue)} ${unitPart}`.trim();
  };

  const presets = [
    { label: '1x', value: 1 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 },
    { label: '3x', value: 3 },
    { label: '½', value: 0.5 },
  ];

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 mb-8 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adjust Servings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Original: {originalServings} | Adjusted: {(originalServings * multiplier).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleMultiplierChange(preset.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              multiplier === preset.value
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-200 dark:border-orange-800 hover:border-orange-400'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom Multiplier
        </label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={multiplier}
          onChange={(e) => handleMultiplierChange(parseFloat(e.target.value) || 1)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Adjusted Ingredients Preview */}
      {multiplier !== 1 && ingredients.length > 0 && (
        <div className="mt-6 pt-4 border-t border-orange-200 dark:border-orange-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
            Adjusted Ingredients ({multiplier}x)
          </h4>
          <div className="space-y-2 text-sm">
            {ingredients.slice(0, 5).map((ingredient, idx) => (
              <div key={idx} className="text-gray-700 dark:text-gray-300">
                {adjustQuantity(ingredient, multiplier)} {ingredient.split(' ').slice(1).join(' ')}
              </div>
            ))}
            {ingredients.length > 5 && (
              <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                ...and {ingredients.length - 5} more ingredients
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdjustableServings;
