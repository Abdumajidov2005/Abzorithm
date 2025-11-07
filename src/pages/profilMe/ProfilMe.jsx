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

  useEffect(() => {
    getProfilMe()?.then(setProfil);
  }, [setProfil]);

  const editProfil = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${getToken}`);

    const formdata = new FormData();
    formdata.append("bio", "2005-yil andijon marhamat");
    formdata.append("avatar", fileInput.files[0], "[PROXY]");
    formdata.append("country", "uzbekistan");

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${baseUrl}/users/me/update/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
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
              <p className="external-info_bio">
                <span>Bio:</span>
                <span>{profil?.bio}</span>
              </p>
              <p>
                <span>Score:</span> <span>{profil?.score}</span>
              </p>
              <p>
                <span>Country:</span> <span>{profil?.country}</span>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className={`edit_info-bases ${editInformation ? "active" : ""}`}
            >
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
              <p>edit information</p>
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
