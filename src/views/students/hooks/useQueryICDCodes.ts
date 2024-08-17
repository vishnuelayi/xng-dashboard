import { useEffect, useState } from "react";

const useQueryICDCodes = () => {
  const [icdCodes, setIcdCodes] = useState<string[]>([]);
  const [isLoading_IcdCodes, setIsLoading] = useState(false);
  const [error_IcdCodes, setError] = useState(false);

  useEffect(() => {
    const icdCodesFile = "/icd10cm_codes_2024.txt";
    fetch(icdCodesFile)
      .then((response) => {
        setIsLoading(true);
        return response.text();
      })
      .then((text) => {
        const codes = text.split("\n");
        setIcdCodes(codes);
        // console.log("codes: ", codes[0]);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { icdCodes, isLoading_IcdCodes, error_IcdCodes };
};

export default useQueryICDCodes;
