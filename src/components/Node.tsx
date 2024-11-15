import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Trash2, Link, Edit3, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Palette } from 'lucide-react';
import ColorPicker from './ColorPicker';

interface NodeProps {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
  width?: number;
  height?: number;
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

const renderTextWithUrls = (text: string, color: string) => {
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  let matchIndex = 0;

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      const url = matches[matchIndex++];
      return (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
          style={{ color }}
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      );
    }
  });
};

export const Node: React.FC<NodeProps> = ({ 
  id, 
  content, 
  x, 
  y, 
  color, 
  scale = 1,
  width = 200,
  height = 100
}) => {
  const {
    deleteNode,
    updateNode,
    moveNode,
    startConnection,
    connectMode,
    connectingFrom,
    completeConnection,
    updateNodeScale,
    updateNodeSize,
    updateNodeColor
  } = useMindMapStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      moveNode(id, dragStart.current.nodeX + dx, dragStart.current.nodeY + dy);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, moveNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing || e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: x,
      nodeY: y
    };
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    if (connectMode && connectingFrom && connectingFrom !== id) {
      e.stopPropagation();
      completeConnection(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editContent.trim()) {
      updateNode(id, editContent);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    startConnection(id);
  };

  const handleScale = (increase: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const scaleDelta = increase ? 0.1 : -0.1;
    updateNodeScale(id, scale + scaleDelta);
  };

  const handleResize = (dimension: 'width' | 'height', increase: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const delta = increase ? 50 : -50;
    if (dimension === 'width') {
      updateNodeSize(id, width + delta, height);
    } else {
      updateNodeSize(id, width, height + delta);
    }
  };

  const toggleColorPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowColorPicker(!showColorPicker);
  };

  return (
    <div
      ref={nodeRef}
      className="absolute select-none touch-none"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging || showColorPicker ? 1000 : 1,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleNodeClick}
    >
      <div
        className={`p-4 rounded-lg border-2 bg-black bg-opacity-90 transition-all duration-200
          ${connectMode && connectingFrom !== id ? 'cursor-pointer' : ''}`}
        style={{ 
          borderColor: color,
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'auto'
        }}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleBlur();
              }
            }}
            className="bg-transparent border-none outline-none resize-none w-full h-full"
            style={{ color }}
          />
        ) : (
          <div className="whitespace-pre-wrap h-full" style={{ color }}>
            {renderTextWithUrls(content, color)}
          </div>
        )}
        
        <div className="absolute -top-12 left-0 flex gap-2 bg-black bg-opacity-90 p-2 rounded-lg border-2" style={{ borderColor: color }}>
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-opacity-100 transition-colors"
            style={{ color }}
            title="Delete node"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleConnect}
            className={`p-1 rounded hover:bg-opacity-100 transition-colors ${
              connectMode && connectingFrom === id ? 'ring-2' : ''
            }`}
            style={{ color, ringColor: color }}
            title="Connect nodes"
          >
            <Link size={16} />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-opacity-100 transition-colors"
            style={{ color }}
            title="Edit content"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={toggleColorPicker}
            className={`p-1 rounded hover:bg-opacity-100 transition-colors ${
              showColorPicker ? 'ring-2' : ''
            }`}
            style={{ color, ringColor: color }}
            title="Change color"
          >
            <Palette size={16} />
          </button>
          <button
            onClick={handleScale(true)}
            className="p-1 rounded hover:bg-opacity-100 transition-colors"
            style={{ color }}
            title="Increase scale"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleScale(false)}
            className="p-1 rounded hover:bg-opacity-100 transition-colors"
            style={{ color }}
            title="Decrease scale"
          >
            <ZoomOut size={16} />
          </button>
          <div className="flex gap-1">
            <button
              onClick={handleResize('width', false)}
              className="p-1 rounded hover:bg-opacity-100 transition-colors"
              style={{ color }}
              title="Decrease width"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleResize('width', true)}
              className="p-1 rounded hover:bg-opacity-100 transition-colors"
              style={{ color }}
              title="Increase width"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleResize('height', false)}
              className="p-1 rounded hover:bg-opacity-100 transition-colors"
              style={{ color }}
              title="Decrease height"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={handleResize('height', true)}
              className="p-1 rounded hover:bg-opacity-100 transition-colors"
              style={{ color }}
              title="Increase height"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {showColorPicker && (
          <div className="absolute top-12 left-0">
            <ColorPicker
              color={color}
              onChange={(newColor) => {
                updateNodeColor(id, newColor);
                setShowColorPicker(false);
              }}
              title="Node Color"
            />
          </div>
        )}
      </div>
    </div>
  );
};