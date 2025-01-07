import './App.css'
import { Routes, Route } from "react-router-dom";
import Chat from './pages/Chat';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { useSession } from './context/SessionContext';

function App() {
  const session = useSession();
  return (
    <main>
      <Routes>
        {
          session?.sessionId &&
          <Route path="/chat" element={<Chat />} />
        }
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
