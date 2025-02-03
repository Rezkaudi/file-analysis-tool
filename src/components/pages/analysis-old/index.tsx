"use client";

import { useState } from "react";

// Style
import "@/styles/analysis-old.css";

// Types
interface AnalysisResult {
  fileName: string;
  criteria: Record<string, string>;
  score: number;
  analysis: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<string[]>([""]);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addCriteria = () => {
    setCriteria([...criteria, ""]);
  };

  const updateCriteria = (index: number, value: string) => {
    const newCriteria = [...criteria];
    newCriteria[index] = value;
    setCriteria(newCriteria);
  };

  const analyzeFile = () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulating analysis with setTimeout
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          fileName: file.name,
          criteria: criteria.reduce<Record<string, string>>((acc, curr, idx) => {
            acc[`criteria${idx + 1}`] = curr;
            return acc;
          }, {}),
          score: Math.floor(Math.random() * 100),
          analysis:
            "Detailed analysis of the file content based on provided criteria",
        },
        {
          fileName: file.name,
          criteria: criteria.reduce<Record<string, string>>((acc, curr, idx) => {
            acc[`criteria${idx + 1}`] = `Result for ${curr}`;
            return acc;
          }, {}),
          score: Math.floor(Math.random() * 100),
          analysis: "Additional analysis results with different scoring",
        },
      ];

      setResults(mockResults);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="container">
      <h1>File Analysis Tool</h1>

      {/* File Upload Section */}
      <div className="section">
        <h2>1. Upload File</h2>
        <input type="file" onChange={handleFileChange} className="file-input" />
        {file && <div className="selected-file">Selected file: {file.name}</div>}
      </div>

      {/* Criteria Section */}
      <div className="section">
        <h2>2. Add Analysis Criteria</h2>
        {criteria.map((criterion, index) => (
          <div key={index} className="criteria-input" data-number={`#${index + 1}`}>
            <input
              type="text"
              value={criterion}
              onChange={(e) => updateCriteria(index, e.target.value)}
              placeholder={`Enter criteria ${index + 1}`}
              className="text-input"
            />
          </div>
        ))}
        <button onClick={addCriteria} className="button">
          Add Criteria
        </button>
      </div>

      {/* Analysis Button */}
      <div className="section">
        <button
          onClick={analyzeFile}
          disabled={!file || criteria.some((c) => !c) || isAnalyzing}
          className="button analyze-button"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze File"}
        </button>
      </div>

      {/* Results Table */}
      {results && (
        <div className="section results-section">
          <h2>3. Analysis Results</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="sticky-header">File Name</th>
                  {criteria.map((criterion, index) => (
                    <th key={index} className="sticky-header">
                      Criteria {index + 1}
                      <div className="criteria-label">{criterion}</div>
                    </th>
                  ))}
                  <th className="sticky-header">Score</th>
                  <th className="sticky-header">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="file-name-cell">{result.fileName}</td>
                    {criteria.map((_, idx) => (
                      <td key={idx} className="criteria-cell">
                        {result.criteria[`criteria${idx + 1}`]}
                      </td>
                    ))}
                    <td className="score-cell">
                      <div className="score-wrapper">
                        <div
                          className="score-bar"
                          style={{ width: `${result.score}%` }}
                        />
                        <span>{result.score}%</span>
                      </div>
                    </td>
                    <td className="analysis-cell">{result.analysis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
