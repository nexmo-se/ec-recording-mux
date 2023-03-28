
import { useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AppStateProvider from './state';
import { VideoProvider } from './components/VideoProvider';
import ErrorDialog from './components/ErrorDialog';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { useAppState } from './state';
import "./App.css";

const VideoApp = () => {
  const { error, setError, isAuthReady, user, ecRender } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  const toLoginPage = useCallback(() => {
    const loginUrl = `/login${ecRender ? window.location.search : ''}`
    navigate(loginUrl, { state: { from: location } });
  }, [navigate, ecRender, location])

  useEffect(() => {
    if (!user || !isAuthReady) {
      toLoginPage()
    }
  }, [isAuthReady, user, toLoginPage])

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