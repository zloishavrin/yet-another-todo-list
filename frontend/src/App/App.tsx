import { Auth } from "../Page/Auth/Auth"
import { NextUIProvider } from '@nextui-org/react';
import { useContext } from "react";
import type { NavigateOptions } from "react-router-dom";
import { useNavigate, useHref, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Context } from "../main";
import { Registration } from "../Page/Registration/Registration";
import DocsLeftImage from "../assets/docs-left.png";
import DocsRightImage from "../assets/docs-right.png";
import styles from "./App.module.css";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Main } from "../Page/Main/Main";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App() {
  const nagigate = useNavigate();
  const { store } = useContext(Context);
  const location = useLocation();

  return (
    <>
      <NextUIProvider navigate={nagigate} useHref={useHref}>
        <main className="dark text-foreground">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Auth />
                </motion.div>
              } />
              <Route path="/registration" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Registration />
                </motion.div>  
                } />
              <Route
                path="/*" 
                element={
                  store.isAuth ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Main />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Navigate to="/login" replace />
                    </motion.div>
                )}
              />
            </Routes>
          </AnimatePresence>
        </main>
        <div className={styles.docsContainer}>
          <img className={styles.docsLeft} src={DocsLeftImage} alt="docs-left" />
          <img className={styles.docsRight} src={DocsRightImage} alt="docs-right" />
        </div>
      </NextUIProvider>
    </>
  )
}

export default App
