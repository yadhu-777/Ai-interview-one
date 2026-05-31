
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <section className="hero">
        <div className="hero-content">
          <span className="badge"></span>
          <h1>
            Master Your Interview in{" "}
            <span className="highlight">Minutes</span>
          </h1>
          <p>
            An AI-powered mock interview system with voice interaction,
            domain-based questions, resume analysis, and instant performance
            feedback to prepare you for real-world interviews.
          </p>
          <div className="cta-group">
            <button
              className="primary-btn"
              onClick={() => navigate("/interview")}
            >
              Start Mock Interview
            </button>
            <button   onClick={() => navigate("/working")} className="secondary-btn">How it works</button>
          </div>
        </div>

        <div className="hero-visual">
        <div className="avatar-container2">
  <div className="pulse-wrapper">
    <div className="pulse-ring"></div>
    <div className="pulse-ring delay-1"></div>
  </div>

  <div className="avatar-preview">
    <img src="la3.jpeg" alt="AI Interviewer" />
  </div>
</div>
        </div>
      </section>
    </div>
  );
}
