import { useContext, useState } from "react";
import Loader from "./Loader";
import Mycontext from "../Context";

function FileApp2() {
  const { loading, setLoading } = useContext(Mycontext);
  const [file, setFile] = useState(null);
const[text,setText] = useState("");

const handleUpload = async () => {
  if (!file) return alert("Select a file");

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file); // ✅ important

  try {
   const res = await fetch("https://ai-interview-backend-bj0k.onrender.com/uploadRes", {
  method: "POST",
  body: formData,
});

const contentType = res.headers.get("content-type");

if (!res.ok || contentType !== "application/pdf") {
  const text = await res.text();
  console.error(text);
  alert("Error: " + text);
  return;
}

const blob = await res.blob();

const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "AI_Resume.pdf";
a.click();
    a.remove();

    setFile(null);
    setLoading(false);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
    setLoading(false);
  }
};
  const handlePasteUpload = async () => {
    if (!text || text.trim().length === 0) {
  alert("Please paste your resume content");
  setLoading(false);
  return;
}
  if (!text) return alert("Paste your resume");

  setLoading(true);

  try {
    
    const res = await fetch("https://ai-interview-backend-bj0k.onrender.com/pasteResume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Server error");
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setText("");
    setLoading(false);
  } catch (err) {
    console.error(err);
    alert("Failed");
    setLoading(false);
  }
};

  return (
    <div className="outerFileApp">
      <div className="heade2">
        <h1>
          <span className="highlight">Create Your Resume</span>
        </h1>
      </div>

      <div className="innerFileApp2">
        <div className="fileUpload2">
          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
            <p>Click to choose file</p>
            <span className="upload-btn">Browse File</span>
          </label>

        
          {file && <p className="file-name">Selected: {file.name}</p>}

          <br />
          <br />

       <button style={{marginTop:"-4rem"}}  className="btn btn-primary" onClick={handleUpload}>Upload </button>
      
        </div>
        <div className="FileUpload3">

    
          <textarea
            className="custom-textarea"
            placeholder="Or paste your resume content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
              <button style={{marginBottom:"4rem"}}  className="btn btn-primary" onClick={handlePasteUpload}>Upload </button>
     
        </div>
      </div>
        { loading &&    <  Loader/>}
    </div>
  );
}

export default FileApp2;
