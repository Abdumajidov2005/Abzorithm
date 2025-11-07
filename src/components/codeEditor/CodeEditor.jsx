import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { baseUrl } from "../../pages/services/config";
import { getToken } from "../../pages/services/token";
import { getMasala, getProblems, getProfilMe } from "../../pages/services/app";
import "./CodeEditor.css";

export default function CodeEditor({
  codeBy,
  setCodeBy,
  profil,
  setProfil,
  setProblemData,
  setOutput,
  setRunTimeWatch,
  setTestCaseWatch,
  setLoaderRunTime,
  filteredCases,
}) {
  const [language, setLanguage] = useState("python");
  const [selection, setSelection] = useState("Python");
  const [opening, setOpening] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const optionRef = useRef(null);
  const editorRef = useRef(null);

  const options = ["Python", "JavaScript"];

  useEffect(() => {
    getProfilMe()?.then(setProfil);
    getMasala()?.then(setCodeBy);
  }, []);

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

  const getCreateSubmition = () => {
    setLoaderRunTime(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getToken()}`);

    const raw = JSON.stringify({
      user: profil?.id,
      problem: codeBy?.problem,
      code: codeBy?.template_code,
      language,
    });

    fetch(`${baseUrl}/submissions/create/`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
    })
      .then((r) => r.json())
      .then((result) => {
        // 1. Rangni statusga qarab belgilovchi funksiya
        const getStatusColor = (status = "") => {
          const s = status.toLowerCase();

          if (s.includes("accepted")) return "green";
          if (s.includes("wrong")) return "red";
          if (s.includes("runtime")) return "orange";
          if (s.includes("time limit")) return "purple";

          return "gray";
        };

        // 2. Outputni to‘liq shakllantirish
        const makeOutput = (result) => {
          const time = Math.floor((result?.execution_time || 0) * 1000) / 1000;

          return {
            id: result?.id,
            status: result?.status || "Unknown",
            time,
            color: getStatusColor(result?.status),
            failed_test: result?.failed_test ?? "-",
            error_input: result?.error_input ?? "-",
            error_expected: result?.error_expected ?? "-",
            error_output: result?.error_output ?? "-",
          };
        };

        // 3. setOutput orqali natijani chiqarish
        const output = makeOutput(result);
        setOutput(output);

        // 4. Agar “Accepted” bo‘lsa, keyingi masalani olish
        if (result?.status?.toLowerCase().includes("accepted")) {
          getProblems()
            ?.then((data) => data && setProblemData(data))
            .catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoaderRunTime(false);
      });
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCleanCode = () => {
    if (!editorRef.current) return;

    try {
      const code = editorRef.current.getValue();
      const lines = code.split("\n");

      const cleanedLines = [];
      let previousEmpty = false;

      for (let line of lines) {
        // 1️⃣ Satr boshidagi indentni aniqlaymiz
        const indentMatch = line.match(/^\s*/);
        let indent = indentMatch ? indentMatch[0] : "";

        // 2️⃣ Tabni 4-space ga o‘girib, bo‘sh joylarni standart qilamiz
        indent = indent.replace(/\t/g, "    ");

        // 3️⃣ Satr oxiridagi bo'sh joylarni o'chiramiz
        const trimmedContent = line.trimEnd();

        if (trimmedContent === "") {
          if (!previousEmpty) {
            cleanedLines.push("");
            previousEmpty = true;
          }
        } else {
          // 4️⃣ Satr boshidagi ortiqcha bo‘sh joylarni olib tashlaymiz
          cleanedLines.push(indent + trimmedContent.trimStart());
          previousEmpty = false;
        }
      }

      const cleanedCode = cleanedLines.join("\n");

      editorRef.current.setValue(cleanedCode);
      setCodeBy((prev) => ({
        ...(prev || {}),
        template_code: cleanedCode,
      }));
    } catch (e) {
      console.error("Clean Code error:", e);
    }
  };

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        optionRef.current &&
        !optionRef.current.contains(e.target)
      ) {
        setOpening(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="code-boxs">
      <div className="submitions">
        <div className="submit-inputs">
          {/* Custom Select */}
          <div ref={optionRef} className="select-box">
            <div
              ref={ref}
              className="selected"
              onClick={() => setOpening(!opening)}
            >
              {selection}
              <span className={`arrow ${opening ? "up" : "down"}`} />
            </div>

            {opening && (
              <div className="options1 show">
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                {filtered.length > 0 ? (
                  filtered.map((option, idx) => (
                    <div
                      key={idx}
                      className="option"
                      onClick={() => {
                        setSelection(option);
                        setLanguage(option.toLowerCase());
                        setOpening(false);
                        setSearch("");
                      }}
                    >
                      {option}
                    </div>
                  ))
                ) : (
                  <div className="no-option">Topilmadi</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              getCreateSubmition();
              setRunTimeWatch(true);
              setTestCaseWatch(false);
            }}
            className="run-btn"
          >
            Submit
          </button>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleCleanCode}
            className="clean-btn"
            title="Clean code (auto format)"
          >
            Clean Code
          </button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        width="100%"
        height="400px"
        defaultLanguage={language}
        beforeMount={beforeMount}
        onMount={handleEditorMount}
        theme="myCustomTheme"
        value={codeBy?.template_code || ""}
        onChange={(value) =>
          setCodeBy((prev) => ({ ...prev, template_code: value || "" }))
        }
        options={{
          colorDecorators: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}
