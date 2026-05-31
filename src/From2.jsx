import { useContext, useState } from "react";
import Mycontext from "../Context";
  import { ToastContainer, toast } from 'react-toastify';

export default function Form2(){
     const{showDomain,setShowDomain,domainText,setDomainText } = useContext(Mycontext);
   function handleFrom2(e){
setDomainText(e.target.value)
console.log(domainText);
   }
   function handleBtn(){
    setShowDomain(prev=>!prev);
  toast("Domain Selected  ✅",
     {
  position: "top-center",
  autoClose: 3000,
  theme: "dark"
}
  )
   }
  
    return(
        <div className="outerForm2">
          
            <div className="innerForm2">
               <div onClick={handleBtn} className="icon"> <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
  <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></div>
                <label htmlFor="exampleFormControlInput1" style={{color:"black",marginTop:"1rem",marginBottom:"1rem"}}  className="form-label">Domian</label>
  <input onChange={handleFrom2} value={domainText} type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Your domain"></input>
                <button onClick={handleBtn} style={{marginTop:"0.5rem"}} className="btn btn-primary"> Submit</button>
            </div>
        </div>
    )
}