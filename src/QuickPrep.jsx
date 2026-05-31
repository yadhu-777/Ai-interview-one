import { useContext } from "react";
import Form from "./Form";
import ReactMarkdown from "react-markdown";
import Mycontext from "../Context";
import Loader from "./Loader";
export default function QuickPrep() {
    const{ show,SetShow,text2,loading, setLoading} = useContext(Mycontext);
    function handleClick(){
SetShow(prev=>!prev)
    }
  return (
   <div className="outerQuickPrep">
    <div className="innerQuickPrep1">
        { show &&<Form/>}
<h1 className="heade" >
    <span className="highlight">Quick Preparation</span>
    <button onClick={handleClick} className="btn btn-primary" > Enter your Domain</button>
</h1>
    </div>
    <div className="div2">
         <div className="innerQuickPrep2">
  {loading && <Loader/>}
      <ReactMarkdown>{text2}</ReactMarkdown>
    </div>
    </div>
   </div>
  );
}