import React, { useEffect, useState } from "react";
import "./Problems.css";
import { Link, useNavigate } from "react-router-dom";
import { getProblems } from "../services/app";
import { getToken } from "../services/token";
import { FaFilter } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { baseUrl } from "../services/config";

function Problems({ problemData, setProblemData }) {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // LOAD DEFAULT DATA ONLY ONCE
  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = () => {
    setLoader(true);
    getProblems()
      ?.then((data) => setProblemData(data))
      .finally(() => setLoader(false));
  };

  // GET FILTERED DATA
  const getFilterData = () => {
    setLoader(true);

    const params = new URLSearchParams({
      search,
      difficulty,
    });

    fetch(`${baseUrl}/problems/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProblemData(data))
      .catch(console.error)
      .finally(() => setLoader(false));
  };

  // SMART FILTER (ONLY TRIGGER WHEN SEARCH OR DIFFICULTY IS NOT EMPTY)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search || difficulty) {
        getFilterData();
      } else {
        loadProblems(); // reset to default
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search, difficulty]);

  return (
    <>
      <div className="problems">
        <div className="container">

          {/* SEARCH PANEL */}
          <div className="search_panel">
            <div className="search_panel-title">
              <div className="search_panel-title_content">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  id="searchs"
                  placeholder="Search problems..."
                />
                <label htmlFor="searchs">
                  <FiSearch />
                </label>
              </div>

              {/* DIFFICULTY FILTER */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="difficulty-filter"
              >
                <option value="">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <p>
                <FaFilter />
              </p>
            </div>
          </div>

          {/* PROBLEMS LIST */}
          <div className="problems-panel">
            <ul className="problems_questions">
              {loader ? (
                <div className="loader-border">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="loader"></div>
                  ))}
                </div>
              ) : (
                problemData?.map((item, index) => (
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

                      {/* SOLVED CHECK */}
                      <div className="sloved">
                        {item?.is_solved && (
                          <div className="slove">
                            <span></span>
                            <span></span>
                          </div>
                        )}
                      </div>

                      <span>{index + 1}.</span>
                      <h3>{item?.title}</h3>
                    </div>

                    <div className="icons-problems">
                      <p
                        className={`difficulty ${item?.difficulty?.toLowerCase()}`}
                      >
                        {item?.difficulty}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problems;
