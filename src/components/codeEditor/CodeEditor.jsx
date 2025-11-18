import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { getMasala, getProfilMe } from "../../pages/services/app";
import { getToken } from "../../pages/services/token";
import { baseUrl } from "../../pages/services/config";
import "./CodeEditor.css";

export default function CodeEditor({
  codeBy,
  setCodeBy,
  profil,
  setProfil,
  problemId,
  setOutput,
  setRunTimeWatch,
  setTestCaseWatch,
  setLoaderRunTime,
}) {
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState(null);
  const [selectionOpen, setSelectionOpen] = useState(false);

  const ref = useRef(null);
  const optionRef = useRef(null);
  const editorRef = useRef(null);

  // 🔥 backend formatiga moslash
  const normalizeLanguages = (langs) => {
    if (!langs) return [];
    if (!Array.isArray(langs)) return [];
    return langs.map((l) => (Array.isArray(l) ? l[0] : l));
  };

  const loadTemplate = async (lang) => {
    const res = await getMasala(problemId, lang);
    console.log("🔥 TEMPLATE RESPONSE:", res);

    // backenddan tillarni olish
    const langs = normalizeLanguages(res?.languages);
    setLanguages(langs);

    // default language tanlash
    if (!language && langs.length > 0) {
      setLanguage(langs[0]);
    }

    setCodeBy(res);
  };

  useEffect(() => {
    if (!problemId) return;

    getProfilMe()?.then(setProfil);

    loadTemplate(language ?? "python"); // recursionni oldini oladi
  }, [problemId]);

  const beforeMount = (monaco) => {
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs",
      inherit: false,
      rules: [
        { token: "keyword", foreground: "#ff3300ff" },
        { token: "string", foreground: "#137613ff" },
        { token: "comment", foreground: "#aaaaaaff", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#FAF8F8",
        "editor.foreground": "#1b31bdff",
      },
    });
  };

  const submitCode = () => {
    if (!codeBy?.template_code) return;

    setLoaderRunTime(true);

    fetch(`${baseUrl}/submissions/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        user: profil?.id,
        problem: problemId,
        code: codeBy.template_code,
        language,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        const s = (res.status || "").toLowerCase();
        const statusColor = s.includes("accepted")
          ? "green"
          : s.includes("wrong")
          ? "red"
          : s.includes("runtime")
          ? "orange"
          : s.includes("time limit")
          ? "purple"
          : "gray";

        setOutput({
          id: res.id,
          status: res.status,
          color: statusColor,
          time: Math.floor((res.execution_time || 0) * 1000) / 1000,
          failed_test: res.failed_test ?? "-",
          error_input: res.error_input ?? "-",
          error_expected: res.error_expected ?? "-",
          error_output: res.error_output ?? "-",
        });
      })
      .finally(() => setLoaderRunTime(false));
  };

  const cleanCode = () => {
    if (!editorRef.current) return;
    const cleaned = editorRef.current
      .getValue()
      .split("\n")
      .map((line) => line.replace(/\t/g, "    ").trimEnd())
      .join("\n");

    editorRef.current.setValue(cleaned);
    setCodeBy((prev) => ({ ...prev, template_code: cleaned }));
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        optionRef.current &&
        !optionRef.current.contains(e.target)
      ) {
        setSelectionOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div className="code-boxs">
      <div className="submitions">
        <div className="submit-inputs">
          {/* 🔥 LANGUAGE SELECT */}
          <div ref={optionRef} className="select-box">
            <div
              ref={ref}
              className="selected"
              onClick={() => setSelectionOpen(!selectionOpen)}
            >
              {language || "Select language"}
              <span className={`arrow ${selectionOpen ? "up" : "down"}`} />
            </div>

            {selectionOpen && (
              <div className="options1 show">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="option"
                    onClick={() => {
                      setLanguage(lang);
                      setSelectionOpen(false);
                      loadTemplate(lang); //🔥 template dynamic changelanadi
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="run-btn"
            onClick={() => {
              submitCode();
              setRunTimeWatch(true);
              setTestCaseWatch(false);
            }}
          >
            Submit
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={cleanCode} className="clean-btn">
            Clean Code
          </button>
        </div>
      </div>

      <Editor
        width="100%"
        height="400px"
        language={language}
        theme="myCustomTheme"
        beforeMount={beforeMount}
        onMount={(editor) => (editorRef.current = editor)}
        value={codeBy?.template_code || ""}
        onChange={(value) =>
          setCodeBy((prev) => ({ ...prev, template_code: value || "" }))
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
}
