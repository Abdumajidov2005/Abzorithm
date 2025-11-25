import React, { useEffect, useRef, useState } from "react";
import "./ProfilMe.css";
import { getProfilMe } from "../services/app";
import { GrCircleInformation } from "react-icons/gr";
import { AiOutlineEdit } from "react-icons/ai";
import Button from "@mui/material/Button";

import { baseUrl } from "../services/config";
import { getToken } from "../services/token";
import { FiCamera } from "react-icons/fi";

function ProfilMe({ profil, setProfil, setProfilMe }) {
  const [editInformation, setEditInformation] = useState(false);

  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [country, setCountry] = useState("");

  const fileInput = useRef();

  useEffect(() => {
    if (!getToken()) return; // ❗ TOKEN YO‘Q -> FETCH QILMA!
    getProfilMe()?.then((data) => {
      setProfil(data);
      setBio(data?.bio || "");
      setCountry(data?.country || "");
      setAvatarPreview(data?.avatar || "/imgs/icons.png");
    });
  }, [setProfil]);

  const editProfil = () => {
    const myHeaders = new Headers();
    getToken() ? myHeaders.append("Authorization", `Bearer ${getToken()}`) : "";
    const formdata = new FormData();
    formdata.append("bio", bio);
    formdata.append("country", country);
    if (fileInput.current?.files[0]) {
      formdata.append("avatar", fileInput.current.files[0]);
    }

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
        getProfilMe()?.then(setProfilMe);
        setEditInformation(false);
      })
      .catch((error) => console.error(error));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profil-me">
      <div className="avatar-lines">
        <div className="container">
          <div className="avatar-box">
            <img
              src={avatarPreview || "/imgs/icons.png"}
              alt="Avatar"
              className="avatar-img"
            />
            {editInformation && (
              <div
                className="avatar-edit-overlay"
                onClick={() => fileInput.current.click()}
              >
                <FiCamera className="camera-icon" />
                <span>Change photo</span>
              </div>
            )}

            {/* Fayl input — ko‘rinmaydi */}
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
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
                <span>Yo'nalishi:</span> <span>{country}</span>
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
                <span>Yo'nalishi:</span>
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
                <Button
                  onClick={() => {
                    setEditInformation(false);
                  }}
                  className="btn_edit"
                  type="button"
                  variant="outlined"
                  color="error"
                >
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
