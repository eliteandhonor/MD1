import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  title?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, title }) => {
  const matrixColors = [
    '#00ff00', // Classic Matrix green
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#ffff00', // Yellow
    '#ff0000', // Red
    '#0000ff', // Blue
    '#ffffff', // White
    '#FFA500', // Orange
    '#800080', // Purple
    '#40E0D0', // Turquoise
  ];

  return (
    <div className="p-2 bg-black bg-opacity-90 rounded-lg border-2 shadow-lg" style={{ borderColor: color }}>
      {title && (
        <div className="mb-2 text-center font-bold" style={{ color }}>
          {title}
        </div>
      )}
      <div className="grid grid-cols-5 gap-2 p-1">
        {matrixColors.map((c) => (
          <button
            key={c}
            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${
              color === c ? 'border-white' : 'border-transparent'
            }`}
            style={{ backgroundColor: c }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;