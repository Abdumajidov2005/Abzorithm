import React, { useEffect, useState } from "react";
import "./Problems.css";
import { Link, useNavigate } from "react-router-dom";
import { getProblems } from "../services/app";
import { getToken } from "../services/token";
import { FaFilter } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { baseUrl } from "../services/config";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { LuFilter } from "react-icons/lu";
// import FilterListIcon from "@mui/icons-material/FilterList";

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
                  type="search"
                  id="searchs"
                  placeholder="Search problems..."
                />
                {search ? (
                  <span
                    className="search_favicons"
                    onClick={() => setSearch("")}
                  >
                    ✕
                  </span>
                ) : (
                  <label htmlFor="searchs">
                    <FiSearch />
                  </label>
                )}
              </div>

              <FormControl className="form_control">
                <InputLabel id="demo-select-label">Filter</InputLabel>

                <Select
                  className="select-filter"
                  labelId="demo-select-label"
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <LuFilter />
                        </InputAdornment>
                      }
                      label="Filter"
                    />
                  }
                  defaultValue={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* PROBLEMS LIST */}
          <div className="problems-panel">
            <ul className="problems_questions">
              {search ? (
                <div className="search_gif">
                  <img src="imgs/no-result.gif" alt="" />
                </div>
              ) : loader ? (
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
