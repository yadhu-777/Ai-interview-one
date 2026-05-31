import { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Mycontext from "../Context";
import Header from "./Header";
 
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
 

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
 
  const { interviewActive, setInterviewActive } = useContext(Mycontext);
  const navigate = useNavigate();
 
  const toggleMenu = () => setIsOpen(!isOpen);
 

  const handleNavClick = (e, to) => {
    if (interviewActive) {
      e.preventDefault();          
      setPendingPath(to);           
      setShowLeaveModal(true);     
    } else {
      setIsOpen(false);           
    }
  };
 
 
  const handleLeaveYes = () => {
    setShowLeaveModal(false);
    setInterviewActive(false);     
    setIsOpen(false);
    navigate(pendingPath);         
    setPendingPath(null);
  };
 
  
  const handleLeaveNo = () => {
    setShowLeaveModal(false);
    setPendingPath(null);
  };
 
  const navLinks = [
    { to: "/",          label: "Home" },
    { to: "/working",   label: "How AI Works" },
    { to: "/interview", label: "Interview Practice" },
    { to: "/upload",    label: "Resume Analyzer" },
    { to: "/upload2",   label: "Create Resume" },
    { to: "/QuickPrep", label: "Quick Prep" },
  ];
 
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
 
          <Link
            to="/"
            className="nav-logo"
            onClick={(e) => handleNavClick(e, "/")}
          >
            <span>AI</span>Prep.
          </Link>
 
          <div
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
 
          <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
            {navLinks.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "nav-links active" : "nav-links"
                  }
                  onClick={(e) => handleNavClick(e, to)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
 
            <li className="nav-item">
              <Header />
            </li>
          </ul>
        </div>
      </nav>
 
     
      {showLeaveModal && (
        <div className="leave-modal-overlay">
          <div className="leave-modal-box">
            <div className="leave-icon">🚪</div>
            <h2 className="leave-modal-title">Leave Interview?</h2>
            <p className="leave-modal-subtitle">
              Your interview is still in progress. If you leave now, it will end
              and your session will be lost.
            </p>
            <div className="leave-actions">
              <button className="leave-btn-yes" onClick={handleLeaveYes}>
                Yes, Leave
              </button>
              <button className="leave-btn-no" onClick={handleLeaveNo}>
                No, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}