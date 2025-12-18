import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { FaCode, FaCoins, FaUserShield } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { getProfilMe } from "../../pages/services/app";
import { IoExitOutline } from "react-icons/io5";
import Button from "@mui/material/Button";

function Navbar({ tokens, setTokens, profilMe, setProfilMe }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getProfilMe()?.then(setProfilMe);
  }, []);

  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // agar na panel, na button bosilmasa -> yopiladi
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getCodialCoins = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getToken()}`);

    const raw = JSON.stringify({
      description: "test",
      date: "2025-12-17",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/send-points/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="navbar">
        <div className="container">
          <Link to={"/"} className="logo">
            <p>
              <FaCode />
            </p>
            <h1>
              abzorithm
              <span>From Junior to Google Engineer </span>
            </h1>
          </Link>
          <ul className="links">
            <li>
              <NavLink to={"/"}>Problems</NavLink>
            </li>
            <li>
              <NavLink to={"/leaderboard"}>LeaderBoard</NavLink>
            </li>
          </ul>
          <div className="icons">
            {tokens ? (
              ""
            ) : (
              <Button
                className="btnssubmitions"
                variant="contained"
                onClick={() => {
                  navigate("/create accaunt");
                }}
              >
                Create accaunt
              </Button>
            )}
            {tokens ? (
              ""
            ) : (
              <Button
                className="btnssubmitions"
                variant="contained"
                onClick={() => {
                  navigate("/signIn");
                }}
              >
                SignIn
              </Button>
            )}
            {tokens ? (
              <button
                onClick={() => {
                  getCodialCoins();
                }}
                className="codial_point"
              >
                Send codial
              </button>
            ) : (
              ""
            )}
            {tokens ? (
              <div className="coins">
                <span className="coins-count">
                  {profilMe
                    ? isNaN(profilMe?.score)
                      ? "0"
                      : profilMe?.score * 10
                    : "0"}
                </span>
                <p className="coin_svg">
                  <FaCoins />
                </p>
              </div>
            ) : (
              ""
            )}

            {tokens ? (
              <div
                className="userIcon"
                ref={buttonRef}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <img src={profilMe?.avatar || "/imgs/icons.png"} alt="" />
              </div>
            ) : (
              ""
            )}
            {tokens ? (
              <div
                ref={panelRef}
                className={`modal ${showModal ? "active" : ""}`}
              >
                <p
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="xmark"
                >
                  <FaXmark />
                </p>
                <div className="user-profil-status">
                  <div className="status-img">
                    <img src={profilMe?.avatar || "/imgs/icons.png"} alt="" />
                  </div>
                  <h2>{profilMe?.username}</h2>
                </div>
                <Link
                  to={"/profil"}
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="list-profil"
                >
                  <FaUserShield />
                  Personal Information
                </Link>
                <span
                  className="list-profil"
                  onClick={() => {
                    localStorage.clear();
                    setTokens(null);
                    setShowModal(false);
                    navigate("/create accaunt");
                  }}
                >
                  <IoExitOutline />
                  Sign Out
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
