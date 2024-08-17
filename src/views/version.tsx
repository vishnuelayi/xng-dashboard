import React, { useEffect, useState } from 'react';
import { initializeFeatureFlags } from '../context/slices/featureFlagsSlice';
import { useXNGDispatch, useXNGSelector } from "../context/store";


type BuildInfo = {
  buildNumber: string;
  buildId: string;
  branchName: string;
  commitHash: string;
};

const BuildInfoScreen: React.FC = () => {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const dispatch = useXNGDispatch();
  useEffect(() => {
    fetch('/buildinfo.json')
      .then(response => response.json())
      .then(data => setBuildInfo(data as BuildInfo));
  }, []);
    // Fetch Feature Flags
  // useEffect(() => {
  //   console.log("Fetching Feature Flags");
  //   dispatch(initializeFeatureFlags());
  // }, []);
  return (
    <div>
      {buildInfo ? (
        <>
          <p>Build Number: {buildInfo.buildNumber}</p>
          <p>Build ID: {buildInfo.buildId}</p>
          <p>Branch Name: {buildInfo.branchName}</p>
          <p>Commit Hash: {buildInfo.commitHash}</p>
        </>
      ) : (
        <p>Loading build info...</p>
      )}
    </div>
  );
};

export default BuildInfoScreen;
