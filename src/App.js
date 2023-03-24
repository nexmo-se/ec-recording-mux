
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(document.location.search);
  const role = searchParams.get('role');

  useEffect(() => {
    if (!user || !isAuthReady) {
      const loginUrl = `/login${role === process.env.REACT_APP_EC_NAME ? window.location.search : ''}`
      navigate(loginUrl, { state: { from: location } });
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