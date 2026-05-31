import { useContext, useState } from "react";
import Mycontext from "../Context";

export default function Form(){
     const{ show,SetShow,text2,setText2, loading, setLoading} = useContext(Mycontext);
     const[text,setText] = useState("");
    function handleBtn(){
         setText2("");
        SetShow(prev=>!prev);
        setLoading(prev=>!prev);
        fetch(" http://127.0.0.1:8000/QuickPrep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
      .then((res)=>res.json())
      .then((data)=>{
       setLoading(prev=>!prev);
        setText2(data.msg);
         console.log(data.msg);
      })

    }
    function handleText(e){
setText(e.target.value);
    }
  
    return(
        <div className="outerForm">
          
            <div className="innerForm">
               <div onClick={handleBtn} className="icon"> <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
  <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></div>
                <label style={{color:"black",marginTop:"1rem",marginBottom:"1rem"}} for="exampleFormControlInput1" class="form-label">Domian</label>
  <input onChange={handleText} value={text} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Your domain"></input>
                <button onClick={handleBtn} style={{marginTop:"0.5rem"}} className="btn btn-primary"> Submit</button>
            </div>
        </div>
    )
}