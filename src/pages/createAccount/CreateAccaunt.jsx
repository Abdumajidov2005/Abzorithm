import React, { useState } from "react";
import "./CreateAccaunt.css";
import { baseUrl } from "../services/config";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

function CreateAccaunt() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  const createAccaunt = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: username,
      email: email,
      password: password,
      // bio: bio,
      country: country,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${baseUrl}/users/register/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result.username) && result.username[0]) {
          toast.error(result.username[0]);
        } else if (Array.isArray(result.email) && result.email[0]) {
          toast.error(result.email[0]);
        } else if (result.detail) {
          toast.error(result.detail);
        } else {
          toast.success("Accaunt yaratildi ✅");
          navigate("/signIn");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="create-accaunt">
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAccaunt();
            }}
            className="accaunt-settings"
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
              <label htmlFor="">Email:</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                required
                placeholder="Email"
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

            <div className="settings">
              <label htmlFor="">Country</label>
              <input
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                type="text"
                placeholder="Country"
              />
            </div>
            <div className="accaunt-btns">
              <Button
                onClick={() => {
                  navigate("/");
                }}
                className="btns"
                type="button"
                variant="contained"
              >
                Cancel
              </Button>
              <Button className="btns" type="submit" variant="contained">
                Submit
              </Button>
              <Link to={"/signIn"}>Kirish</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateAccaunt;
