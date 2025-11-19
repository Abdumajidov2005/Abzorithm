import React, { useEffect, useState } from "react";
import "./CodePanels.css";
import { FaNoteSticky } from "react-icons/fa6";
import CodeEditor from "../../components/codeEditor/CodeEditor";
import { GiSandsOfTime } from "react-icons/gi";

import {
  getMasala,
  getProblems,
  getProblemsDetails,
  getTestCase,
} from "../services/app";
import { useParams } from "react-router-dom";

function CodePanels({ profil, setProfil, setProblemData }) {
  const { slug } = useParams();
  const [loaderRunTime, setLoaderRunTime] = useState(false);

  const [details, setDetails] = useState(null);
  const [index, setIndex] = useState(null);
  const [codeBy, setCodeBy] = useState(null);
  const [testCase, setTestCase] = useState([]);
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [output, setOutput] = useState("");

  const [testCaseWatch, setTestCaseWatch] = useState(true);
  const [runTimeWatch, setRunTimeWatch] = useState(false);

  const [loadingCoding, setLoadingCoding] = useState(false);

  // 🔹 Problems va details olish
  useEffect(() => {
    const fetchProblems = async () => {
      setLoadingCoding(true);
      try {
        const list = await getProblems();
        if (Array.isArray(list)) {
          const foundIndex = list.findIndex((item) => item.slug === slug);
          if (foundIndex !== -1) setIndex(foundIndex + 1);
        }

        const data = await getProblemsDetails(slug);
        setDetails(data || null);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoadingCoding(false);
      }
    };

    fetchProblems();
  }, [slug]);

  // 🔹 Masala va test case’larni olish
  // 🔹 Masala va test case’larni olish
  useEffect(() => {
    if (!details?.id) return;

    const fetchMasalaAndCases = async () => {
      try {
        // ❗ Tillar ro‘yxati (backenddan keladi)
        const languages = details?.languages || details?.language_options;

        // ❗ Avtomatik default til
        const selectedLanguage = languages?.[0] || "python";

        // ❗ Tilni frontend state’da saqlaymiz
        setCodeBy((prev) => ({ ...prev, selectedLanguage }));

        // ❗ GET template (til bilan birga!)
        const [masala, cases] = await Promise.all([
          getMasala(details.id, selectedLanguage),
          getTestCase(),
        ]);

        setCodeBy(masala || null);

        if (Array.isArray(cases)) {
          setTestCase(cases);

          const filtered = cases.filter(
            (c) => c.problem === details.id && c.is_hidden === false
          );

          if (filtered.length > 0) setActiveCaseId(filtered[0].id);
        }
      } catch (error) {
        console.error("Error fetching masala or test cases:", error);
      }
    };

    fetchMasalaAndCases();
  }, [details]);

  // 🔎 Filterlangan test case’lar
  const filteredCases =
    testCase
      ?.filter(
        (item) => item.problem === details?.id && item.is_hidden === false
      )
      ?.sort((a, b) => a.order - b.order) || [];

  // 🔎 Hozir aktiv case
  const activeCase = filteredCases.find((item) => item.id === activeCaseId);

  return (
    <div className="codePanels">
      <div className="container">
        <div className="coding">
          {loadingCoding ? (
            <div className="loadingCoding">
              {[...Array(7)].map((_, i) => (
                <span key={i}></span>
              ))}
            </div>
          ) : (
            <div className="block">
              <h1 className="coding-titles">
                <span>{index}.</span> {details?.title}
              </h1>
              <div className="leveles">
                <span
                  className={`difficultys ${details?.difficulty?.toLowerCase()}`}
                >
                  {details?.difficulty}
                </span>
              </div>
              <p className="description">{details?.description}</p>

              {details?.examples?.map((item, index) => (
                <div key={index} className="example">
                  <h2>
                    Example <span>{index + 1}</span>:
                  </h2>
                  <h4>
                    Input: <span>{item?.ex_input}</span>
                  </h4>
                  <h4>
                    Output: <span>{item?.ex_output}</span>
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="submitions-borderss">
          <div className="editor-boxs">
            <CodeEditor
              codeBy={codeBy}
              setCodeBy={setCodeBy}
              profil={profil}
              setProfil={setProfil}
              setOutput={setOutput}
              setRunTimeWatch={setRunTimeWatch}
              setTestCaseWatch={setTestCaseWatch}
              setLoaderRunTime={setLoaderRunTime}
              problemId={details?.id}
            />
          </div>

          <div className="submition">
            <div className="testings">
              <p
                className={testCaseWatch ? "active" : ""}
                onClick={() => {
                  setTestCaseWatch(true);
                  setRunTimeWatch(false);
                }}
              >
                <FaNoteSticky />
                Testcase
              </p>
              <p
                className={runTimeWatch ? "active" : ""}
                onClick={() => {
                  setRunTimeWatch(true);
                  setTestCaseWatch(false);
                }}
              >
                <span>
                  <GiSandsOfTime />
                </span>
                Run time
              </p>
            </div>

            <div className={`case-blocktest ${testCaseWatch ? "active" : ""}`}>
              <div className="case-list">
                {filteredCases.length > 0 ? (
                  filteredCases.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveCaseId(item.id)}
                      className={`case ${
                        activeCaseId === item.id ? "active" : ""
                      }`}
                    >
                      <p>case {idx + 1}</p>
                    </div>
                  ))
                ) : (
                  <div className="loadingCases">
                    <span className="lodes"></span>
                    <span className="lodes"></span>
                    <span className="lodes"></span>
                  </div>
                )}
              </div>

              {activeCase && (
                <div className="testCase-contents-wide">
                  <p>
                    <strong>Input:</strong> {activeCase.input_data}
                  </p>
                  <p>
                    <strong>Expected:</strong> {activeCase.expected_output}
                  </p>
                </div>
              )}
            </div>

            <div className={`output-box ${runTimeWatch ? "active" : ""}`}>
              {loaderRunTime ? (
                <div className="loader_output">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : output.length == 0 ? (
                <p className="not-watch_output">You must run your code first</p>
              ) : (
                <div>
                  {output && (
                    <div className="get-result">
                      <p style={{ color: output.color }}>
                        Status: {output.status}
                      </p>
                      <p className="times">Time: {output.time}s</p>
                      {output.failed_test && (
                        <p>Failed Test: {output.failed_test}</p>
                      )}
                      {output.error_input && <p>Input: {output.error_input}</p>}
                      {output.error_expected && (
                        <p>Expected: {output.error_expected}</p>
                      )}
                      {output.error_output && (
                        <p> Output:{output.error_output}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePanels;
