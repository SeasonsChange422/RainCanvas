import { CanvasConfig } from '../types/config';

// 只读模式 - 仅展示内容
export const READ_ONLY_CONFIG: CanvasConfig = {
  enableGrid: true,
  enableShapes: true,
  enableSelection: false,
  enableDrag: false,
  enablePan: true,
  enableZoom: true,
  enableEdit: false,
  enableCopy: false,
  enablePaste: false,
  enableUndo: false,
  enableToolbar: false,
  enabledTools: ['tool-pan'],
  enableKeyboardShortcuts: false
};

// 基础编辑模式
export const BASIC_EDIT_CONFIG: CanvasConfig = {
  enableGrid: true,
  enableShapes: true,
  enableSelection: true,
  enableDrag: true,
  enablePan: true,
  enableZoom: true,
  enableEdit: true,
  enableCopy: true,
  enablePaste: true,
  enableUndo: true,
  enableToolbar: false,
  enabledTools: ['tool-select', 'tool-pan'],
  enableKeyboardShortcuts: true
};

// 完整功能模式（包含工具栏）
export const FULL_FEATURED_CONFIG: CanvasConfig = {
  enableGrid: true,
  enableShapes: true,
  enableSelection: true,
  enableDrag: true,
  enablePan: true,
  enableZoom: true,
  enableEdit: true,
  enableCopy: true,
  enablePaste: true,
  enableUndo: true,
  enableToolbar: true,
  enabledTools: ['tool-select', 'tool-pan'],
  enableKeyboardShortcuts: true
};