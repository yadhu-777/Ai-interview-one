import { useContext, useRef, useState, useEffect } from "react";
import Mycontext from "../Context";
import Form2 from "./From2";
import { ToastContainer, toast } from "react-toastify";

export default function Interview() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStart, setShowStart] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef(null);

  const [feedbackData, setFeedbackData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
const [showTip, setShowTip] = useState(true);
  // FIX 1: Start with empty array instead of [{ user: "", ai: "" }]
  const [convo, setConvo] = useState([]);
  // FIX 2: Use a ref to always have the latest convo in async callbacks
  const convoRef = useRef([]);

  const {
    showDomain,
    setShowDomain,
    domainText,
    interviewActive,
    setInterviewActive,
  } = useContext(Mycontext);

  const recognitionRef = useRef(null);
  // FIX 3: Ref to track if interview has already ended (prevent double calls)
  const hasEndedRef = useRef(false);

  // Keep convoRef in sync with convo state
  useEffect(() => {
    convoRef.current = convo;
  }, [convo]);

  // FIX 4: Only trigger endInterview from this effect when interview is truly active
  useEffect(() => {
    if (!interviewActive && showStart && !showModal && !hasEndedRef.current) {
      endInterview();
    }
  }, [interviewActive]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showStart) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showStart]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  useEffect(() => {
    if (timeLeft === 60) {
      toast("⚠️ 1 minute left!", { position: "top-center" });
    }
  }, [timeLeft]);

  const startListening = () => {
    if (!domainText) {
      toast("⚠️ Domain not selected! Please select a domain before starting.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (isSpeaking) return;

    setShowStart(true);
    setInterviewActive(true);
    hasEndedRef.current = false; // reset ended flag on new start

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            endInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sendAnswer(transcript);
        }
      }
      setText(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const sendAnswer = async (answer) => {
    try {
      recognitionRef.current?.stop();
      setListening(false);

      // FIX 5: Update both state and ref together
      const newConvo = [...convoRef.current, { user: answer }];
      convoRef.current = newConvo;
      setConvo(newConvo);

      const res = await fetch("https://ai-interview-backend-bj0k.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, domainText }),
      });

      const data = await res.json();
      if (!data.audio) return;

      // FIX 6: Append AI reply to the ref too
      const updatedConvo = [...convoRef.current, { ai: data.reply }];
      convoRef.current = updatedConvo;
      setConvo(updatedConvo);

      const audioBytes = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onplay = () => setIsSpeaking(true);
      await audio.play();
      audio.onended = () => {
        setIsSpeaking(false);
        startListening();
      };
    } catch (err) {
      console.error(err);
    }
  };

  const endInterview = async () => {
    // FIX 7: Guard against double calls
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    try {
      clearInterval(timerRef.current);
      timerRef.current = null;
      recognitionRef.current?.stop();
      setListening(false);
      setIsSpeaking(false);
      setShowStart(false);
      setInterviewActive(false);
      setLoadingFeedback(true);
      setShowModal(true);

      // FIX 8: Use convoRef.current instead of stale convo state
      const latestConvo = convoRef.current;

      // FIX 9: Guard — if convo is empty, show a friendly message
      if (latestConvo.length === 0) {
        setFeedbackData({
          feedback: "No conversation was recorded. Please speak during the interview for feedback.",
          rating: 0,
        });
        setLoadingFeedback(false);
        return;
      }

      const res = await fetch("https://ai-interview-backend-bj0k.onrender.com/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convo: latestConvo, domainText }),
      });

      // FIX 10: Handle non-OK HTTP responses
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setFeedbackData(data);
      setLoadingFeedback(false);
    } catch (err) {
      console.error(err);
      setFeedbackData({
        feedback: "Could not fetch feedback. Please check your connection and try again.",
        rating: null,
      });
      setLoadingFeedback(false);
    }
  };

  function ShowDomain() {
    setShowDomain((prev) => !prev);
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return "rating-green";
    if (rating >= 5) return "rating-yellow";
    return "rating-red";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 9) return "Excellent! 🏆";
    if (rating >= 7) return "Good Job! 👍";
    if (rating >= 5) return "Average 📈";
    return "Needs Work 💪";
  };

  return (
    <div className="interview">
      <ToastContainer />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {loadingFeedback ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Analyzing your interview...</p>
              </div>
            ) : feedbackData ? (
              <>
                <h2 className="modal-title">Interview Complete 🎉</h2>

                {/* FIX 11: Only show rating circle if rating is a valid number */}
                {feedbackData.rating !== null && feedbackData.rating !== undefined && (
                  <>
                    <div className={`rating-circle ${getRatingColor(feedbackData.rating)}`}>
                      <span className="rating-number">{feedbackData.rating}</span>
                      <span className="rating-denominator">/10</span>
                    </div>
                    <p className={`rating-label ${getRatingColor(feedbackData.rating)}`}>
                      {getRatingLabel(feedbackData.rating)}
                    </p>
                  </>
                )}

                <div className="feedback-box">
                  <p className="feedback-text">{feedbackData.feedback}</p>
                </div>

                <button
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    setFeedbackData(null);
                    // FIX 12: Reset convo and timer for next interview
                    setConvo([]);
                    convoRef.current = [];
                    setTimeLeft(300);
                    hasEndedRef.current = false;
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <p className="error-text">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      )}

      <div className="innerInterview">
        <div className="innerInterview1">

          <h3 className={`timer ${timeLeft <= 60 ? "timer-warning" : ""}`}>
            ⏱️ {formatTime(timeLeft)}
          </h3>

          {showDomain && !showStart && <Form2 />}

          {!showStart && (
            <div className="btnstart">
              <button className="btn btn-danger" onClick={ShowDomain}>
                Domain
              </button>
              <button
                className="btn btn-danger"
                onClick={startListening}
                disabled={listening || isSpeaking}
              >
                Start 🎙️
              </button>
            </div>
          )}

          {showStart && (
            <div className="btnstart">
              <button className="btn btn-danger" onClick={endInterview}>
                End 🎙️
              </button>
            </div>
          )}

          <h2>AI Mock Interview</h2>
{showTip && (
  <div className="tip-banner">
    <span>🎧 For best experience, use headphones and sit in a quiet environment</span>
    <button className="tip-close" onClick={() => setShowTip(false)}>✕</button>
  </div>
)}

<button
  className="btn btn-primary mic-btn"
  onClick={startListening}
  disabled={listening || isSpeaking || !domainText}
>
  {listening ? "🔴 Listening..." : "🎙️ Click to Speak"}
</button>
          <button
            className="btn btn-primary"
            onClick={startListening}
            disabled={listening || isSpeaking || !domainText}
          >
            {listening ? "Listening..." : "Continue"}
          </button>

          <div className="text">
            {text || "Your speech will appear here..."}
          </div>

          <div className="avatar-container">
            {isSpeaking && <div className="pulse-ring2"></div>}
            {isSpeaking && <div className="pulse-ring2 delay-1"></div>}

            <img
              src="/av1.png"
              alt="AI Avatar"
              className={isSpeaking ? "avatar talking" : "avatar"}
            />

            {isSpeaking && <div className="wave"></div>}
          </div>
        </div>

        <div className="innerInterview2">
          <div className="chat-box">
            {convo.map((c, i) => (
              <div key={i} className="chat-row">
                {c.ai && (
                  <div className="chat ai">
                    <p>{c.ai}</p>
                  </div>
                )}
                {c.user && (
                  <div className="chat user">
                    <p>{c.user}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}