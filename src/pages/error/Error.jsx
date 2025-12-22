import React from "react";
import "./Error.css";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  return (
    <>
      <div className="error_page">
        <div className="container">
          <div className="error_page_picture">
            <img src="imgs/error.gif" alt="" />
            <button onClick={()=>{
              navigate("/")
            }} className="error_btn">
              Return To Problems
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Error;
