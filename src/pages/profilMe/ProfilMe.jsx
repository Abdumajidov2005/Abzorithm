import React, { useEffect, useState } from "react";
import "./ProfilMe.css";
import { getProfilMe } from "../services/app";
import { GrCircleInformation } from "react-icons/gr";
import { AiOutlineEdit } from "react-icons/ai";
import Button from "@mui/material/Button";

import { baseUrl } from "../services/config";
import { getToken } from "../services/token";

function ProfilMe({ profil, setProfil }) {
  const [editInformation, setEditInformation] = useState(false);

  const [bio, setBio] = useState(profil?.bio);
  // const [avatar, setAvatar] = useState(profil?.avatar);
  const [country, setCountry] = useState(profil?.country);

  useEffect(() => {
    getProfilMe()?.then(setProfil);
  }, [setProfil]);

  const editProfil = () => {
    const myHeaders = new Headers();
    getToken() ? myHeaders.append("Authorization", `Bearer ${getToken()}`) : "";
    const formdata = new FormData();
    formdata.append("bio", bio);
    formdata.append("avatar", fileInput.files[0], "[PROXY]");
    formdata.append("country", country);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${baseUrl}/users/me/update/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="profil-me">
      <div className="avatar-lines">
        <div className="container">
          <div className="avatar-box">
            <img
              src={profil?.avatar || "/imgs/icons.png"}
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <div className="users-infos">
            <h2>{profil?.username}</h2>
            <p>{profil?.country}</p>  
          </div>
        </div>
      </div>
      <div className="profil-information">
        <div className="container">
          <ul className="basic-informtion">
            <li
              className={!editInformation ? "active" : ""}
              onClick={() => {
                setEditInformation(false);
              }}
            >
              <GrCircleInformation />
              Basic information
            </li>
            <li
              className={editInformation ? "active" : ""}
              onClick={() => {
                setEditInformation(true);
              }}
            >
              <AiOutlineEdit />
              Edit information
            </li>
          </ul>
          <div></div>

          <div className="external-info">
            <div
              className={`basic_info-bases ${editInformation ? "active" : ""}`}
            >
              <h4>Basic info</h4>
              <p>
                <span>Username:</span> <span>{profil?.username}</span>
              </p>
              <p>
                <span>Email:</span> <span>{profil?.email}</span>
              </p>
              <p className="basic-info_bio">
                <span>Bio:</span>
                <span>{bio}</span>
              </p>
              <p>
                <span>Score:</span> <span>{profil?.score}</span>
              </p>
              <p>
                <span>Country:</span> <span>{country}</span>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editProfil();
              }}
              className={`edit_info-bases ${editInformation ? "active" : ""}`}
            >
              <h4>Edit Information</h4>
              <div className="creates">
                <span>Username:</span> <span>{profil?.username}</span>
              </div>
              <div className="creates">
                <span>Email:</span> <span>{profil?.email}</span>
              </div>
              <div className="creates">
                <span>Bio:</span>
                <span>
                  <textarea
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                    name=""
                    id=""
                  ></textarea>
                </span>
              </div>
              <div className="creates">
                <span>Country:</span>
                <span>
                  <input
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                    type="text"
                  />
                </span>
              </div>
              <div className="submit_btns">
                <Button className="btn_edit" type="button" variant="contained">
                  Cancel
                </Button>
                <Button className="btn_edit" type="submit" variant="contained">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilMe;
