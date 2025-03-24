import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, ArrowLeft, Save, Award, AlertTriangle, ThumbsUp } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const feedback = location.state?.feedback;
  const score = location.state?.score;  // ✅ Get actual feedback from the backend
  const [copied, setCopied] = React.useState(false);

  if (!feedback) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">No feedback available. Please upload a submission first.</p>
      </div>
    );
  }
// ✅ Extract the topic from the feedback text
  const extractTopic = (feedback) => {
    const match = feedback.match(/\*\*Topic:\*\* (.+)/);
    return match ? match[1] : "Unknown Topic";
  };
  
  const topic = extractTopic(feedback);

  const handleCopy = () => {
    navigator.clipboard.writeText(feedback);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    const submission = {
      title: topic, // Can be dynamic based on the feedback or user
      feedback: feedback,
      date: new Date().toLocaleString(),
    };

    const existingHistory = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
    existingHistory.push(submission);
    localStorage.setItem('feedbackHistory', JSON.stringify(existingHistory));
    alert('Feedback saved to history!');
  };
const renderFormattedFeedback = (feedback) => {
  if (!feedback) return null;

  return feedback.split("\n").map((line, index) => {
    // Convert section titles to bold headers
    if (line.startsWith("**")) {
      return (
        <h3 key={index} className="text-lg font-bold mt-6 text-gray-900">
          {line.replace(/\*\*/g, "")}  {/* Remove ** from title */}
        </h3>
      );
    }
    // Convert bullet points to list items
    else if (line.startsWith("* ")) {
      return (
        <li key={index} className="ml-6 list-disc text-gray-700">
          {line.replace("* ", "")}  {/* Remove * from bullet point */}
        </li>
      );
    }
    // Convert normal text into paragraphs
    else if (line.trim() !== "") {
      return (
        <p key={index} className="text-gray-700 mt-2 leading-relaxed">
          {line}
        </p>
      );
    }
    return null; // Ignore empty lines
  });
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4"
    >
      <button
        onClick={() => navigate('/upload')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 group"
      >
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Upload</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold text-gray-900"
          >
            Feedback Results
          </motion.h2>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors space-x-2"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveToHistory}
              className="flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save to History</span>
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Detailed Feedback</h3>
                <p className="text-gray-600">Generated by AI</p>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-indigo-600" />
                <span className="text-4xl font-bold text-indigo-600">{score}/100✔️</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Feedback Content</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
  {renderFormattedFeedback(feedback)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Results;

