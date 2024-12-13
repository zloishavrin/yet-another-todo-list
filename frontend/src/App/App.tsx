import { Auth } from "../Page/Auth/Auth"
import { NextUIProvider } from '@nextui-org/react';
import { useContext } from "react";
import type { NavigateOptions } from "react-router-dom";
import { useNavigate, useHref, Routes, Route, Navigate } from "react-router-dom";
import { Context } from "../main";
import { Registration } from "../Page/Registration/Registration";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App() {
  const nagigate = useNavigate();
  const { store } = useContext(Context);

  return (
    <>
      <NextUIProvider navigate={nagigate} useHref={useHref}>
        <main className="dark text-foreground bg-background">
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/registration" element={<Registration />} />
            <Route 
              path="/*" 
              element={
                store.isAuth ? (
                  <div>Главная Страница</div>
                ) : (
                  <Navigate to="/login" replace />
              )}
            />
          </Routes>
        </main>
      </NextUIProvider>
    </>
  )
}

export default App
