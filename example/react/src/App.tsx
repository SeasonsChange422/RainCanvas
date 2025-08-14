import RainCanvas from './components/RainCanvas';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>RainCanvas React 示例</h1>
        <p>画布组件示例</p>
      </header>
      
      <main className="app-main">
        <RainCanvas width={window.innerWidth} height={window.innerHeight} />
      </main>
      
      <footer className="app-footer">
        <div className="instructions">
          <h3>使用说明：</h3>
          <ul>
            <li><strong>选择工具</strong>: 点击和拖拽选择图形，支持多选</li>
            <li><strong>平移工具</strong>: 拖拽画布进行平移</li>
            <li><strong>鼠标滚轮</strong>: 缩放画布</li>
            <li><strong>空格键</strong>: 临时切换到平移工具</li>
            <li><strong>方向键</strong>: 微调选中图形位置</li>
            <li><strong>Delete</strong>: 删除选中图形</li>
            <li><strong>Ctrl+Z/Y</strong>: 撤销/重做</li>
            <li><strong>Ctrl+C/V</strong>: 复制/粘贴</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
