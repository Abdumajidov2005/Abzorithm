import React, { useEffect, useState } from "react";
import "./LeaderBoard.css";
import { getLeaderBoard } from "../services/app";

function LeaderBoard({ ratingUser, setRatingUser }) {
  const [loaderLederboard, setLoaderLeaderboard] = useState(false);

  useEffect(() => {
    setLoaderLeaderboard(true);
    getLeaderBoard()
      ?.then(setRatingUser)
      .finally(() => {
        setLoaderLeaderboard(false);
      });
  }, []);

  return (
    <>
      <div className="leaderboard">
        <div className="container">
          <ul className="user-title">
            <li>Avatar</li>
            <li>Username</li>
            <li>Bios </li>
            <li>Points</li>
            <li>Score</li>
          </ul>
          <ul className="leaderboard-contents">
            {loaderLederboard ? (
              <div className="loderLeaders">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              ratingUser?.map((item, index) => {
                return (
                  <div key={item?.id} className="user-levles">
                    <li>
                      <div className="avatar">
                        <span
                          className={`rating-records ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          {index + 1}
                        </span>
                        <img
                          src={item?.avatar || "/imgs/icons.png"}
                          onError={(e) => {
                            e.target.onerror = null; // loopdan saqlanish
                            e.target.src = "/imgs/icons.png";
                          }}
                          alt={item?.username}
                        />
                        n
                      </div>
                    </li>
                    <li>
                      <h1>
                        {item?.username.length > 15
                          ? item?.username?.slice(0, 10) + "..."
                          : item?.username}
                      </h1>
                      <p>{item?.course.length == 0 ? "-" : item?.course}</p>
                    </li>
                    <li>
                      <p>
                        {item?.bio?.length == 0
                          ? "-"
                          : item?.bio?.length > 40
                          ? item?.bio?.slice(0, 40) + "..."
                          : item?.bio}
                      </p>
                    </li>
                    <li>{item?.score * 10}</li>
                    <li>
                      <p>{item?.score}</p>
                    </li>
                  </div>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default LeaderBoard;
