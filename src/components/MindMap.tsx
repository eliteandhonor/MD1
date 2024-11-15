import React, { useRef, useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';
import { Node } from './Node';
import { Toolbar } from './Toolbar';
import { X } from 'lucide-react';

const MindMap: React.FC = () => {
  const { nodes, connections, addNode, deleteConnection, globalColor } = useMindMapStore();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target === svgRef.current) {
        addNode(e.clientX, e.clientY);
      }
    };

    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('click', handleClick);
      return () => svg.removeEventListener('click', handleClick);
    }
  }, [addNode]);

  return (
    <div className="fixed inset-0">
      <Toolbar />
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: 'crosshair' }}
      >
        {connections.map(conn => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          return (
            <g key={conn.id}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={globalColor}
                strokeWidth="2"
                className="connection-line"
              />
              <g
                transform={`translate(${midX}, ${midY})`}
                onClick={() => deleteConnection(conn.id)}
                className="cursor-pointer"
              >
                <circle
                  r="12"
                  fill="black"
                  fillOpacity="0.8"
                  stroke={globalColor}
                  strokeWidth="2"
                />
                <X
                  size={16}
                  style={{
                    transform: 'translate(-8px, -8px)',
                    pointerEvents: 'none',
                    color: globalColor
                  }}
                />
              </g>
            </g>
          );
        })}
      </svg>
      {nodes.map(node => (
        <Node
          key={node.id}
          id={node.id}
          content={node.content}
          x={node.x}
          y={node.y}
          color={node.color}
          scale={node.scale}
          width={node.width}
          height={node.height}
        />
      ))}
    </div>
  );
};

export default MindMap;