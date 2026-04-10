import React from 'react';

const getColor = (score) => {
  if (score >= 75) return '#22d3b8';
  if (score >= 50) return '#4f7ef8';
  if (score >= 25) return '#f5a623';
  return '#f05d5e';
};

const ScoreBar = ({ score }) => (
  <div className="score-bar">
    <div className="score-bar-track">
      <div
        className="score-bar-fill"
        style={{ width: `${score}%`, background: getColor(score) }}
      />
    </div>
    <span className="score-num" style={{ color: getColor(score) }}>{score}</span>
  </div>
);

export default ScoreBar;
