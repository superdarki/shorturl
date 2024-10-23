import { createRoot } from 'react-dom/client';
//import App from './components/App';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function App() {
    return (
      <div>
        <h1>My React App</h1>
        <p>If you see this, the component is rendering!</p>
      </div>
    );
}  

root.render(<App/>)