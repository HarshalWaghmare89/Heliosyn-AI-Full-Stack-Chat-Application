import { BrowserRouter, Routes, Route } from "react-router-dom";

import OAuthSuccess from "../pages/OAuthSuccess";
import SharedChatPage from "../pages/SharedChatPage";
import MainLayout from "../shared/layouts/MainLayout";
import ChatPage from "../pages/ChatPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ------>>> PUBLIC OAUTH */}

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/*  ------->>>>  PUBLIC SHARED CHAT */}

        <Route path="/share/:shareId" element={<SharedChatPage />} />

        {/*------>>>  NORMAL APPLICATION */}

        <Route path="/" element={<MainLayout />}>
          <Route index element={<ChatPage />} />

          <Route path="c/:chatId" element={<ChatPage />} />
        </Route>

        {/* ----->>>> 404 — PAGE NOT FOUND  */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
