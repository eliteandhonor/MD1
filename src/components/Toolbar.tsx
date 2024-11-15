import React, { useState } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Download, Palette } from 'lucide-react';
import ColorPicker from './ColorPicker';

export const Toolbar: React.FC = () => {
  const { nodes, connections, updateGlobalColor } = useMindMapStore();
  const globalColor = useMindMapStore((state) => state.globalColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleExport = () => {
    const data = {
      nodes,
      connections,
      version: '1.0'
    };
    
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `mindmap-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed top-4 left-4 flex items-center gap-4 z-50">
      <button
        onClick={handleExport}
        className="p-2 bg-black bg-opacity-90 border-2 rounded-lg hover:bg-opacity-100 transition-colors"
        style={{ borderColor: globalColor, color: globalColor }}
        title="Export Mind Map"
      >
        <Download size={20} />
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 bg-black bg-opacity-90 border-2 rounded-lg hover:bg-opacity-100 transition-colors"
          style={{ borderColor: globalColor, color: globalColor }}
          title="Change Theme Color"
        >
          <Palette size={20} />
        </button>
        
        {showColorPicker && (
          <div className="absolute top-12 left-0">
            <ColorPicker
              color={globalColor}
              onChange={(newColor) => {
                updateGlobalColor(newColor);
                setShowColorPicker(false);
              }}
              title="Theme Color"
            />
          </div>
        )}
      </div>
    </div>
  );
};