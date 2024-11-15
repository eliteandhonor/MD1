import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface Node {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

interface MindMapState {
  nodes: Node[];
  connections: Connection[];
  selectedNode: string | null;
  connectMode: boolean;
  connectingFrom: string | null;
  globalColor: string;
  addNode: (x: number, y: number) => void;
  updateNode: (id: string, content: string) => void;
  moveNode: (id: string, x: number, y: number) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  toggleConnectMode: () => void;
  startConnection: (fromId: string) => void;
  completeConnection: (toId: string) => void;
  deleteConnection: (id: string) => void;
  updateNodeScale: (id: string, scale: number) => void;
  updateNodeSize: (id: string, width: number, height: number) => void;
  updateNodeColor: (id: string, color: string) => void;
  updateGlobalColor: (color: string) => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [{
    id: nanoid(),
    content: 'Main Idea\n(Click to edit)',
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    color: '#00ff00',
    scale: 1,
    width: 200,
    height: 100
  }],
  connections: [],
  selectedNode: null,
  connectMode: false,
  connectingFrom: null,
  globalColor: '#00ff00',

  addNode: (x, y) => set(state => ({
    nodes: [...state.nodes, {
      id: nanoid(),
      content: 'New Node\n(Click to edit)',
      x,
      y,
      color: state.globalColor,
      scale: 1,
      width: 200,
      height: 100
    }]
  })),

  updateNode: (id, content) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, content } : node
    )
  })),

  moveNode: (id, x, y) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, x, y } : node
    )
  })),

  deleteNode: (id) => set(state => ({
    nodes: state.nodes.filter(node => node.id !== id),
    connections: state.connections.filter(conn => 
      conn.from !== id && conn.to !== id
    )
  })),

  setSelectedNode: (id) => set({ selectedNode: id }),

  toggleConnectMode: () => set(state => ({ 
    connectMode: !state.connectMode,
    connectingFrom: null 
  })),

  startConnection: (fromId) => set({ 
    connectingFrom: fromId,
    connectMode: true 
  }),

  completeConnection: (toId) => set(state => {
    if (!state.connectingFrom || state.connectingFrom === toId) {
      return { connectingFrom: null, connectMode: false };
    }

    const exists = state.connections.some(conn =>
      (conn.from === state.connectingFrom && conn.to === toId) ||
      (conn.from === toId && conn.to === state.connectingFrom)
    );

    if (exists) {
      return { connectingFrom: null, connectMode: false };
    }

    return {
      connections: [...state.connections, {
        id: nanoid(),
        from: state.connectingFrom,
        to: toId
      }],
      connectingFrom: null,
      connectMode: false
    };
  }),

  deleteConnection: (id) => set(state => ({
    connections: state.connections.filter(conn => conn.id !== id)
  })),

  updateNodeScale: (id, scale) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, scale: Math.max(0.5, Math.min(2, scale)) } : node
    )
  })),

  updateNodeSize: (id, width, height) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { 
        ...node, 
        width: Math.max(100, Math.min(800, width)),
        height: Math.max(60, Math.min(600, height))
      } : node
    )
  })),

  updateNodeColor: (id, color) => set(state => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, color } : node
    )
  })),

  updateGlobalColor: (color) => set({ globalColor: color })
}));