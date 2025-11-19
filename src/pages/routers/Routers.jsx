import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";

import Navbar from "../../components/navbar/Navbar";
import Problems from "../problems/Problems";
import CodePanels from "../codePanels/CodePanels";
import Scrolltop from "../../components/scroltop/Scrolltop";
import CreateAccaunt from "../createAccount/CreateAccaunt";
import { ToastContainer } from "react-toastify";
import SignIn from "../signIn/SignIn";
import { getToken } from "../services/token";
import ProfilMe from "../profilMe/ProfilMe";
import LeaderBoard from "../leaderboard/LeaderBoard";
import Error from "../error/Error";

function Routers() {
  const [profil, setProfil] = useState(null);
  const [problemData, setProblemData] = useState([]);
  const [ratingUser, setRatingUser] = useState(null);
  const [profilMe, setProfilMe] = useState(null);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const token = getToken();
    setTokens(token);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Helmet>
          {/* Default statik OG meta */}
          <title>Abzorithm</title>
          <meta property="og:title" content="Abzorithm" />
          <meta
            property="og:description"
            content="From junior to Google Engineer. Ushbu saytda siz dasturlash masalalarini yeching."
          />
          <meta property="og:image" content="https://ibb.co/HT4B2bMq" />
          <meta property="og:url" content="https://www.abzorithm.site/" />
          <meta property="og:type" content="website" />
        </Helmet>

        <Navbar
          tokens={tokens}
          setTokens={setTokens}
          profilMe={profilMe}
          setProfilMe={setProfilMe}
        />

        <ToastContainer autoClose={1000} />
        <Scrolltop />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Abzorithm - Masalalar</title>
                  <meta property="og:title" content="Abzorithm - Masalalar" />
                  <meta
                    property="og:description"
                    content="Dasturlash masalalarini yeching va bilimlaringizni oshiring."
                  />
                  <meta
                    property="og:image"
                    content="https://abzorithm.site/logo.jpg"
                  />
                  <meta
                    property="og:url"
                    content="https://www.abzorithm.site/"
                  />
                </Helmet>
                <Problems
                  setProblemData={setProblemData}
                  problemData={problemData}
                />
              </>
            }
          />
          <Route
            path="/codepanels/:slug"
            element={
              <>
                <Helmet>
                  <title>Abzorithm - Code Panel</title>
                  <meta property="og:title" content="Abzorithm - Code Panel" />
                  <meta
                    property="og:description"
                    content="Dasturlash masalalarini yechish paneli."
                  />
                  <meta
                    property="og:image"
                    content="https://abzorithm.site/logo.jpg"
                  />
                </Helmet>
                <CodePanels
                  profil={profil}
                  setProfil={setProfil}
                  setProblemData={setProblemData}
                />
              </>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <>
                <Helmet>
                  <title>Abzorithm - Leaderboard</title>
                  <meta property="og:title" content="Abzorithm - Leaderboard" />
                  <meta
                    property="og:description"
                    content="Eng yaxshi dasturchilar reytingi."
                  />
                  <meta
                    property="og:image"
                    content="https://abzorithm.site/logo.jpg"
                  />
                </Helmet>
                <LeaderBoard
                  ratingUser={ratingUser}
                  setRatingUser={setRatingUser}
                />
              </>
            }
          />
          <Route
            path="/signIn"
            element={
              <>
                <Helmet>
                  <title>Abzorithm - Sign In</title>
                </Helmet>
                <SignIn setTokens={setTokens} setProfilMe={setProfilMe} />
              </>
            }
          />
          <Route path="/create accaunt" element={<CreateAccaunt />} />
          <Route
            path="/profil"
            element={
              <>
                <Helmet>
                  <title>Abzorithm - Profil</title>
                </Helmet>
                <ProfilMe
                  profil={profil}
                  setProfil={setProfil}
                  setProfilMe={setProfilMe}
                />
              </>
            }
          />
          {/* 404 error page */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Routers;
