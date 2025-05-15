import { useEffect } from 'react';
import { HashRouter, Outlet, Route, Routes } from 'react-router';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AppContextProvider, useAppContext } from './utils/app.context';
import ChatScreen from './components/ChatScreen';
import SettingDialog from './components/SettingDialog';

function App() {
  return (
    <HashRouter>
      <div className="flex flex-row drawer lg:drawer-open">
        <AppContextProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/chat/:convId" element={<ChatScreen />} />
              <Route path="*" element={<ChatScreen />} />
            </Route>
          </Routes>
        </AppContextProvider>
      </div>
    </HashRouter>
  );
}

function AppLayout() {
  const { showSettings, setShowSettings } = useAppContext();

  // <<< yjlee 시작 >>>
  useEffect(() => {
    const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
      const urloff = `http://${location.hostname}/llm?enable=off`;
      console.log(`[handleBeforeUnload] 요청 URL: ${urloff}`);
      fetch(urloff, { method: 'GET', keepalive: true })
        .then(response => {
          console.log(`[handleBeforeUnload] fetch 응답 수신. 상태: ${response.status}`);
          if (!response.ok) {}
        })
        .catch(_err => {
        });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Cleanup 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  // <<< yjlee 끝 >>>

  return (
    <>
      <Sidebar />
      <div
        className="drawer-content grow flex flex-col h-screen w-screen mx-auto px-4 overflow-auto bg-base-100"
        id="main-scroll"
      >
        <Header />
        <Outlet />
      </div>
      {
        <SettingDialog
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
      }
    </>
  );
}

export default App;
