import React from 'react';
import { OutfitLayer } from '../types';
import { brandConfig } from '../brandConfig';
import { t } from '../i18n';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment }) => {
  if (outfitHistory.length <= 1) return null;

  return (
    <div>
      <h2
        className="text-xl font-serif tracking-wider mb-3"
        style={{ color: brandConfig.colors.secondary }}
      >
        {t('outfit.title')}
      </h2>
      <div className="flex flex-col gap-2">
        {outfitHistory.map((layer, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              index === outfitHistory.length - 1
                ? 'bg-gray-100 border border-gray-300'
                : 'opacity-60'
            }`}
          >
            <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
              {layer.garment ? (
                <img
                  src={layer.garment.url}
                  alt={layer.garment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  👤
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700 font-medium flex-1 truncate">
              {layer.garment ? layer.garment.name : t('outfit.base')}
            </span>
          </div>
        ))}
      </div>
      {outfitHistory.length > 1 && (
        <button
          onClick={onRemoveLastGarment}
          className="mt-3 text-sm font-medium hover:underline"
          style={{ color: brandConfig.colors.primary }}
        >
          ← {t('outfit.remove')}
        </button>
      )}
    </div>
  );
};

export default OutfitStack;
