// src/components/Results.jsx (Fixed NaN issue)
import React from "react";
import { useLocation, useNavigate } from "react-router";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure with default empty object to avoid errors if state is null/undefined
  const { score, totalQuestions, username } = location.state || {};

  // --- Start of improved data handling ---
  const isQuizCompletedProperly =
    typeof score === "number" && typeof totalQuestions === "number";

  let displayScore = "N/A";
  let displayTotalQuestions = "N/A";
  let displayIncorrectAnswers = "N/A";
  let displayPercentage = "N/A";

  if (isQuizCompletedProperly) {
    displayScore = score;
    displayTotalQuestions = totalQuestions;
    displayIncorrectAnswers = totalQuestions - score;
    displayPercentage = ((score / totalQuestions) * 100).toFixed(2);
  } else if (score === "N/A") {
    // This case handles when the user was redirected because they already took the quiz
    displayScore = score;
    displayTotalQuestions = totalQuestions; // will also be N/A
    displayIncorrectAnswers = "N/A";
    displayPercentage = "N/A";
  }
  // --- End of improved data handling ---

  // Handle cases where essential data is missing (e.g., direct navigation, or incomplete state)
  if (!username) {
    // Username is a critical piece of information for results
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded shadow-md p-8 w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">No Quiz Data Available</h2>
          <p className="mb-6">Please complete the quiz to see your results.</p>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded shadow-md p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          Quiz Results
        </h2>

        <p className="text-xl text-gray-800 mb-6">
          Hello, <span className="font-bold text-blue-600">{username}</span>!
        </p>

        <div className="mb-8 space-y-3">
          <p className="text-2xl font-semibold">
            Total Questions:{" "}
            <span className="font-bold text-blue-600">
              {displayTotalQuestions}
            </span>
          </p>
          <p className="text-2xl font-semibold">
            Correct Answers:{" "}
            <span className="font-bold text-green-600">{displayScore}</span>
          </p>
          <p className="text-2xl font-semibold">
            Incorrect Answers:{" "}
            <span className="font-bold text-red-600">
              {displayIncorrectAnswers}
            </span>
          </p>
          <p className="text-xl text-gray-700 mt-4">
            Your Score Percentage:{" "}
            <span className="font-bold">{displayPercentage}%</span>
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline text-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
