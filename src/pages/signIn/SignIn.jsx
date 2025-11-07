import React, { useState } from "react";
import "./SignIn.css";
import { baseUrl } from "../services/config";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/token";
import { getProfilMe } from "../services/app";

function SignIn({ setTokens, setProfilMe }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loderSignIn, setLoaderSignIn] = useState(false);

  const signIn = () => {
    setLoaderSignIn(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/token/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.detail) {
          toast.error(result?.detail);
        } else if (result?.access) {
          setToken(result?.access);
          setTokens(getToken());
          getProfilMe()?.then(setProfilMe);
          toast.success("Muvofaqqiyatli kirdingiz");
          navigate("/");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoaderSignIn(false);
      });
  };

  return (
    <>
      <div className={`loadingEffect ${loderSignIn ? "active" : ""}`}>
        <p>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
        </p>
      </div>
      <div className="create-accaunt sign-in">
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}
            className="accaunt-settings signin"
          >
            <div className="settings">
              <label htmlFor="">Username:</label>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                required
                placeholder="Username"
              />
            </div>
            <div className="settings">
              <label htmlFor="">Password</label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="text"
                required
                placeholder="Password"
              />
            </div>
            <div className="but-btns">
              <Button variant="contained" type="submmit">
                Kirish
              </Button>
              <Link to={"/create accaunt"}>Create accaunt</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
