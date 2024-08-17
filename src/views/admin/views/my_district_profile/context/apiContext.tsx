import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_FINANCIAL_DASHBOARD_REPORT } from '../../../../../api/api';
import { FinancialDashboardReport } from '@xng/reporting';

// Define the shape of your API response
interface financialDashboardReport {
  accountDistrictID: number;
  serviceCategory: string;
  goal: number;
  billed: number;
  paid: number;
  progress: number;
  totalPaidLastYear: number;
}

// Define the shape of your context
interface ApiContextType {
  apiValue: FinancialDashboardReport | null;
  setApiValue: React.Dispatch<React.SetStateAction<FinancialDashboardReport | null>>;
  isLoading: boolean;
  error: string | null;
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Props for the ApiProvider component
interface ApiProviderProps {
  children: ReactNode;
}

// Create a provider component
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [apiValue, setApiValue] = useState<FinancialDashboardReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to call the API
    const fetchApiValue = async () => {
      try {
        setIsLoading(true);
        const financialDashboardReport: FinancialDashboardReport =
        await API_FINANCIAL_DASHBOARD_REPORT.v1FinancialDashboardReportFinancialDashboardReportGetReportGet(
          { accountName: "TXBLUM" },
        );
        
        setApiValue(financialDashboardReport);
        setError(null);
      } catch (error) {
        console.error('Error fetching API value:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiValue();
  }, []);

  return (
    <ApiContext.Provider value={{ apiValue, setApiValue, isLoading, error }}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the API context
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};