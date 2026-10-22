
import { useIsAuthenticated } from "./nhost/useIsAuthentificated";
import { LoginModal } from "./components/LoginModal/LoginModal";
import { NotesPage } from "./pages/NotesPage/NotesPage";
import { MainPage } from "./pages/MainPage/MainPage";
import { NotePage } from "./pages/NotePage/NotePage";
import { Header } from "./components/Header/Header";
import { nhostClient } from "./nhost/nhostClient";
import { Route, Routes } from "react-router-dom";
import { NhostProvider } from "react-nhost";
import { useState } from "react";
import "./App.css";

function App() {
  const isUserAuthentificated = useIsAuthenticated().isAuthenticated;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const signOut = async() => await nhostClient.auth.signOut({}).then(() => window.location.href = "/Todo-List/").catch(err => console.log(err));

  return (
    <>
      <div className="App">
        <NhostProvider nhostClient={nhostClient}>
          <>
            <Header isUserAuthorized={isUserAuthentificated} onClickLoginBtn={openLoginModal} onClickSignOutBtn={signOut} />
            <Routes>
              <Route index path="/Todo-List/" element={<MainPage isUserAuthorized={isUserAuthentificated} onClickLoginBtn={openLoginModal} />} />
              {isUserAuthentificated && <Route index path="/Todo-List/notes" element={<NotesPage />} />}
              {isUserAuthentificated && <Route index path="/Todo-List/note/:id" element={<NotePage />} />}
            </Routes>
          </>
        </NhostProvider>
      </div>
      {isLoginModalOpen && <LoginModal isLoginModalOpen={isLoginModalOpen} closeLoginModal={closeLoginModal} />}
    </>
  );
};

export default App;