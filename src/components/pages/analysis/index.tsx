"use client";

import { useState } from "react";

// Style
import "@/styles/analysis-old.css";
import Stepper, { Step } from "@/components/common/components/Stepper";
import FileUploader from "./sections/FileUploader";
import CriteriaManager from "./sections/CriteriaManager";
import Results from "./sections/Results";

interface FileItem {
  name: string;
  size: number;
  type: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  // const [fileContents, setFileContents] = useState<string[]>([]);
  const [criterias, setCriterias] = useState<string[]>([""]);
  const [currentStep, setCurrentStep] = useState(0);



  return (
    <div className="container mx-auto p-5">
      <h1 className="text-purple-700">File Analysis Tool</h1>


      <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep}>

        <Step label="Step 1">
          <FileUploader files={files} setFiles={setFiles} />
        </Step>

        <Step label="Step 2">
          <CriteriaManager criterias={criterias} setCriterias={setCriterias} />
        </Step>

        <Step label="Analysis Results">
          <Results files={files} criterias={criterias} />
        </Step>

      </Stepper>

    </div>
  );
};

export default Index;

