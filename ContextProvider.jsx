import { useState } from "react";
import Mycontext from "./Context";

export default function MycontextProvider({ children }) {
const[show,SetShow] = useState(false);
    const[text2,setText2] = useState("");
     const [interviewActive, setInterviewActive] = useState(false); 
     const [loading, setLoading] = useState(false);
     const[showDomain,setShowDomain] = useState(false);
         const[domainText,setDomainText] = useState("");
  return (
    <Mycontext.Provider
      value={{
       show,SetShow,
       showDomain,setShowDomain,
       domainText,setDomainText,
     text2,setText2,
      interviewActive, setInterviewActive,
     loading, setLoading
      }}
    >
      {children}
    </Mycontext.Provider>
  );
}