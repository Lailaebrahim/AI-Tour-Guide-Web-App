import './App.css'
import { Routes, Route } from "react-router-dom";
import Chat from './pages/Chat';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { useSession } from './context/SessionContext';

function App() {
  const session = useSession();
  return (
    <main>
      <Routes>
        {
          session?.sessionId &&
          <Route path="/" element={<Chat />} />
        }
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
