export interface CanvasConfig {
  // 基础功能
  enableGrid?: boolean;
  enableShapes?: boolean;
  
  // 交互功能
  enableSelection?: boolean;
  enableDrag?: boolean;
  enablePan?: boolean;
  enableZoom?: boolean;
  
  // 编辑功能
  enableEdit?: boolean;
  enableCopy?: boolean;
  enablePaste?: boolean;
  enableUndo?: boolean;
  
  // 工具栏相关
  enableToolbar?: boolean;
  enabledTools?: string[];
  
  // 键盘快捷键
  enableKeyboardShortcuts?: boolean;
}

export const DEFAULT_CONFIG: CanvasConfig = {
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