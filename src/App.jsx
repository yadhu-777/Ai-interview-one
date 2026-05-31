import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

import Interview from "./Interview";
 import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./Nav";
import Working from "./Working";
import FileApp from "./UploadFile";
import FileApp2 from "./FileApp2";
import MycontextProvider from "../ContextProvider";
import QuickPrep from "./QuickPrep";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function App() {
  return (
    <>
    <BrowserRouter>
      <MycontextProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/working"
            element={
              <>
                <SignedIn>
                  <Working />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
                <Route
            path="/upload2"
            element={
              <>
                <SignedIn>
                  <FileApp2 />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
                    <Route
            path="/QuickPrep"
            element={
              <>
                <SignedIn>
                  <QuickPrep />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <FileApp />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/interview"
            element={
              <>
                <SignedIn>
                  <Interview />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          
        </Routes>
      </MycontextProvider>
    </BrowserRouter>
         <ToastContainer />
         </>
  );
}
