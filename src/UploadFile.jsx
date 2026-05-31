import { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import Loader from "./Loader";
import Mycontext from "../Context";
function FileApp() {
   const{ show,SetShow,text2,setText2, loading, setLoading} = useContext(Mycontext);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file");
setLoading(prev=>!prev);
    const formData = new FormData();
  formData.append("file", file);

    try {
      const res = await fetch("https://ai-interview-backend-bj0k.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
console.log(data)
      if (data.error) {
        alert(data.error);
      } else {
        setLoading(prev=>!prev);
        setResult(data.result);
        setFile(null)
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="outerFileApp">
        <div className="heade2">
              <h1>
              <span className="highlight"> Upload Resume</span>
             </h1>
             </div>
      <div className="innerFileApp">

           
        <div className="fileUpload">
     

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

          {/* File Name */}
          {file && <p className="file-name">Selected: {file.name}</p>}

          <br />
          <br />

          <button  className="btn btn-primary" onClick={handleUpload}>Upload & Analyze  </button>
 { loading &&    <  Loader/>}
         
        </div>
      </div>
      <div className="innerFileApp2">
      
       <div className="result-box">
  
  <ReactMarkdown>{result}</ReactMarkdown>
</div>
      </div>
    </div>
  );
}

export default FileApp;
