// src/components/Quiz.jsx (Final Updated Version for "One-and-Done")
import React, { useState, useEffect, useRef } from "react";
import { questions } from "../quizData";
import { useNavigate } from "react-router";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false); // Flag for quiz logic, not necessarily for completion status in storage
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("currentUser") || "Guest";

  // Function to update the user's hasCompletedQuiz status in localStorage
  const markQuizAsCompletedInStorage = () => {
    const users = JSON.parse(localStorage.getItem("quizUsers")) || [];
    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        // Ensure hasCompletedQuiz is set to true
        return { ...user, hasCompletedQuiz: true };
      }
      return user;
    });
    localStorage.setItem("quizUsers", JSON.stringify(updatedUsers));
  };

  useEffect(() => {
    // Check if the user has already completed the quiz. If so, redirect them immediately.
    const users = JSON.parse(localStorage.getItem("quizUsers")) || [];
    const currentUserData = users.find((u) => u.username === username);
    if (currentUserData && currentUserData.hasCompletedQuiz) {
      alert("You have already completed this quiz and cannot retake it.");
      navigate("/results", {
        state: {
          score: "N/A", // Indicate no score as it was already completed
          totalQuestions: questions.length,
          username: username,
        },
      });
      return; // Prevent quiz from starting
    }

    // Initialize quiz and timer only if it's the first attempt
    if (!quizFinished && !currentUserData?.hasCompletedQuiz) {
      setShuffledQuestions(shuffleArray([...questions]));

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setQuizFinished(true); // Signal internal quiz state change
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Cleanup function for the timer
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizFinished, username, navigate]); // Add navigate to dependency array

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const [shuffledOptions, setShuffledOptions] = useState([]);
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray([...currentQuestion.options]));
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  // This function handles navigation to results *and* marking as completed
  const finalizeQuizSession = () => {
    clearInterval(timerRef.current); // Always stop the timer
    markQuizAsCompletedInStorage(); // Always mark as completed in storage

    // Navigate to results page with current score
    navigate("/results", {
      state: {
        score: score,
        totalQuestions: shuffledQuestions.length,
        username: username,
      },
    });
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer(null);

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // User submitted the last question
      finalizeQuizSession();
    }
  };

  // Effect to handle quiz ending due to timer
  useEffect(() => {
    if (quizFinished && timeLeft === 0) {
      // Quiz finished because time ran out
      finalizeQuizSession();
    }
  }, [quizFinished, timeLeft]);

  // Handler for quitting the quiz prematurely
  const handleQuitQuiz = () => {
    if (
      window.confirm(
        "Are you sure you want to quit the quiz? Your current progress will be lost, and you will not be able to retake it."
      )
    ) {
      markQuizAsCompletedInStorage(); // Mark as completed even if quitting
      clearInterval(timerRef.current);
      navigate("/"); // Go back to the home page (or a "Quit" confirmation page)
    }
  };

  if (!shuffledQuestions.length) {
    return <div className="text-center text-xl mt-10">Loading quiz...</div>;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded shadow-md p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} / {shuffledQuestions.length}
          </h2>
          <div className="text-red-600 font-bold text-lg">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        <p className="text-lg mb-6">{currentQuestion.question}</p>
        <div className="space-y-4">
          {shuffledOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`block w-full text-left p-4 rounded border-2 transition-colors duration-200
                ${
                  selectedAnswer === option
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-50 hover:bg-gray-200 border-gray-300"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleQuitQuiz}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Quit Quiz
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`py-3 px-6 rounded text-white font-bold transition-colors duration-200
              ${
                selectedAnswer === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              }`}
          >
            {currentQuestionIndex === shuffledQuestions.length - 1
              ? "Submit Quiz"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
