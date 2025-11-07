import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FaCoins, FaRegUser } from "react-icons/fa";
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

  return (
    <>
      <div className="navbar">
        <div className="container">
          <Link to={"/"} className="logo">
            <div className="logo-img">
              <img src="/imgs/logo.jpg" alt="" />
            </div>
            {/* <h1 className="outlined ">Abzorithm</h1> */}
          </Link>
          <ul className="links">
            <NavLink to={"/"}>Problems</NavLink>
            <NavLink to={"/leaderboard"}>LeaderBoard</NavLink>
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
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <img src={profilMe?.avatar || "/imgs/icons.png"} alt="" />
              </div>
            ) : (
              ""
            )}
            <div className={`modal ${showModal ? "active" : ""}`}>
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
                <FaRegUser />
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
