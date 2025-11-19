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

  const optionRef = useRef(null);
  const editorRef = useRef(null);

  // Backend tillarni to'g'ri normalize qilish
  const normalizeLanguages = (langs) => {
    if (!langs) return [];
    if (Array.isArray(langs)) return langs;  // BU YER YETADI
    return [];
  };

  // Template yuklash
  const loadTemplate = async (lang) => {
    const res = await getMasala(problemId, lang);

    if (!res) {
      console.error("❌ Template load ERROR");
      return;
    }

    // backenddan kelgan tillar
    const langs = normalizeLanguages(res.languages);
    setLanguages(langs);

    // agar til hali tanlanmagan bo‘lsa — 1-tilni olamiz
    if (!language && langs.length > 0) {
      setLanguage(langs[0]);
    }

    setCodeBy(res);
  };

  // Boshlang‘ich yuklash
  useEffect(() => {
    if (!problemId) return;

    getProfilMe()?.then(setProfil);

    // birinchi yuklashda python bo'ladi (fallback)
    loadTemplate(language ?? "python");
  }, [problemId]);

  // Kodni backendga yuborish
  const submitCode = async () => {
    if (!codeBy?.template_code) return;

    setLoaderRunTime(true);

    try {
      const response = await fetch(`${baseUrl}/submissions/create/`, {
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
      });

      const res = await response.json();

      const s = (res.status || "").toLowerCase();
      const color = s.includes("accepted")
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
        color,
        time: Math.floor((res.execution_time || 0) * 1000) / 1000,
        failed_test: res.failed_test ?? "-",
        error_input: res.error_input ?? "-",
        error_expected: res.error_expected ?? "-",
        error_output: res.error_output ?? "-",
      });
    } catch (err) {
      setOutput({
        status: "Error",
        color: "red",
        error_output: err.message,
      });
    } finally {
      setLoaderRunTime(false);
    }
  };

  // Kodni tozalash
  const cleanCode = () => {
    if (!editorRef.current) return;

    const cleaned = editorRef.current
      .getValue()
      .split("\n")
      .map((l) => l.replace(/\t/g, "    ").trimEnd())
      .join("\n");

    editorRef.current.setValue(cleaned);
    setCodeBy((prev) => ({ ...prev, template_code: cleaned }));
  };

  // Outside click — selectni yopish
  useEffect(() => {
    const closeDropdown = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
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

          {/* Language Select */}
          <div ref={optionRef} className="select-box">
            <div
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
                      loadTemplate(lang);
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
        beforeMount={(monaco) => {
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
        }}
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
