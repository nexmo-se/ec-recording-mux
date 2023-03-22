
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppStateProvider from './state';
import { VideoProvider } from './components/VideoProvider';
import ErrorDialog from './components/ErrorDialog';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { useAppState } from './state';
import "./App.css";
import { useEffect } from 'react';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const { isAuthReady, user } = useAppState();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !isAuthReady) {
       navigate('/login');
    }
  }, [isAuthReady, user, navigate])

  return (
    <VideoProvider onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
          <MainPage />
    </VideoProvider>
  );
};

function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route exact path="/" element={<VideoApp />}>
        </Route>
        <Route path="/room/:URLRoomName" element={<VideoApp />}>
        </Route>
        <Route path="/login" element={<LoginPage />}>
        </Route>
      </Routes>
    </AppStateProvider>
  )
}

export default App;