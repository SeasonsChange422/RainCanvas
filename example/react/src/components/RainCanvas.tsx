import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'canvas-board';
import './RainCanvas.css';

interface RainCanvasProps {
  width?: number;
  height?: number;
}

const RainCanvas: React.FC<RainCanvasProps> = ({
  width = 1920,
  height = 1080
}) => {
  const canvasRef = useRef<HTMLDrawableElement>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState('tool-select');
  //@ts-ignore
  const [canUndo, setCanUndo] = useState(false);
  //@ts-ignore
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    try {
      canvasInstanceRef.current = new Canvas({
        el: '#rain-canvas',
        width,
        height
      });

      // 监听命令管理器状态变化
      const commandManager = canvasInstanceRef.current.commandManager;
      const updateUndoRedo = () => {
        setCanUndo(commandManager.canUndo());
        setCanRedo(commandManager.canRedo());
      };

      updateUndoRedo();

    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }

    return () => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
    };
  }, [width, height]);

  const handleToolChange = (toolId: string) => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.toolManager?.setTool(toolId);
      setCurrentTool(toolId);
    }
  };

  const handleUndo = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.commandManager.undo();
      setCanUndo(canvasInstanceRef.current.commandManager.canUndo());
      setCanRedo(canvasInstanceRef.current.commandManager.canRedo());
    }
  };

  const handleRedo = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.commandManager.redo();
      setCanUndo(canvasInstanceRef.current.commandManager.canUndo());
      setCanRedo(canvasInstanceRef.current.commandManager.canRedo());
    }
  };

  const handleCopy = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.selectionManager.copy();
    }
  };

  const handlePaste = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.selectionManager.paste();
      setCanUndo(canvasInstanceRef.current.commandManager.canUndo());
      setCanRedo(canvasInstanceRef.current.commandManager.canRedo());
    }
  };

  const handleDelete = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.selectionManager.deleteShapes();
      setCanUndo(canvasInstanceRef.current.commandManager.canUndo());
      setCanRedo(canvasInstanceRef.current.commandManager.canRedo());
    }
  };

  return (
    <div className="rain-canvas-container">
      {/* 工具栏 */}
      <div className="toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${currentTool === 'tool-select' ? 'active' : ''}`}
            onClick={() => handleToolChange('tool-select')}
            title="选择工具"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 2l4 10 2-4 4-2L2 2z" fill="currentColor" />
            </svg>
          </button>
          <button
            className={`tool-btn ${currentTool === 'tool-pan' ? 'active' : ''}`}
            onClick={() => handleToolChange('tool-pan')}
            title="平移工具"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2l2 2-2 2-2-2 2-2zm0 12l-2-2 2-2 2 2-2 2zm6-6l-2-2-2 2 2 2 2-2zM2 8l2-2 2 2-2 2-2-2z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="tool-group">
          <button
            className="tool-btn"
            onClick={handleUndo}
            title="撤销 (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M3 8a5 5 0 015-5h4v2H8a3 3 0 000 6h4v2H8a5 5 0 01-5-5z" fill="currentColor" />
              <path d="M5 6L3 8l2 2V6z" fill="currentColor" />
            </svg>
          </button>
          <button
            className="tool-btn"
            onClick={handleRedo}
            title="重做 (Ctrl+Y)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M13 8a5 5 0 00-5-5H4v2h4a3 3 0 010 6H4v2h4a5 5 0 005-5z" fill="currentColor" />
              <path d="M11 6l2 2-2 2V6z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="tool-group">
          <button
            className="tool-btn"
            onClick={handleCopy}
            title="复制 (Ctrl+C)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M4 2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h8v8H4V4z" fill="currentColor" />
              <path d="M6 0a2 2 0 00-2 2h2V0z" fill="currentColor" />
            </svg>
          </button>
          <button
            className="tool-btn"
            onClick={handlePaste}
            title="粘贴 (Ctrl+V)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 0a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2V2a2 2 0 012-2zM4 6v8h8V6H4z" fill="currentColor" />
            </svg>
          </button>
          <button
            className="tool-btn"
            onClick={handleDelete}
            title="删除 (Delete)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 2V1a1 1 0 011-1h2a1 1 0 011 1v1h4v2H2V2h4zM3 4v9a1 1 0 001 1h8a1 1 0 001-1V4H3z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* 画布 */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          id="rain-canvas"
        />
      </div>

      {/* 状态栏 */}
      <div className="status-bar">
        <span>当前工具: {currentTool === 'tool-select' ? '选择' : '平移'}</span>
        <span>快捷键: 空格键临时切换到平移工具</span>
      </div>
    </div>
  );
};

export default RainCanvas;