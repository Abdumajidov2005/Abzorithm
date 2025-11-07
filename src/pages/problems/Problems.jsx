import React, { useEffect, useState } from "react";
import "./Problems.css";
import { Link, useNavigate } from "react-router-dom";
import { getProblems } from "../services/app";
import { getToken } from "../services/token";

function Problems({ problemData, setProblemData}) {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true);
    getProblems()
      ?.then((data) => {
        setProblemData(data);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <div className="problems">
        <div className="container">
          <div className="problems-panel">
            <ul className="problems_questions">
              {loader ? (
                <div className="loader-border">
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                  <div className="loader"></div>
                </div>
              ) : (
                problemData?.map((item, index) => {
                  return (
                    <Link
                      className="card-problem"
                      key={item?.id}
                      to={`/codepanels/${item?.slug}`}
                      onClick={(e) => {
                        if (!getToken()) {
                          e.preventDefault();
                          navigate("/create accaunt");
                        }
                      }}
                    >
                      <div className="title-problems">
                        <div className="sloved">
                          {item?.is_solved && (
                            <div className="slove">
                              <span></span>
                              <span></span>
                            </div>
                          )}
                        </div>
                        <span>{index + 1}.</span> <h3>{item?.title}</h3>
                      </div>
                      <div className="icons-problems">
                        <p>10%</p>
                        <p
                          className={`difficulty ${item?.difficulty?.toLowerCase()}`}
                        >
                          {item?.difficulty}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problems;
