import React, { createContext, ReactNode, useContext, useState } from "react";

interface RecommendationData {
  formData: any;
  recommendations: any;
}

interface RecommendationContextType {
  data: RecommendationData | null;
  setData: (data: RecommendationData) => void;
  clearData: () => void;
}

const RecommendationContext = createContext<
  RecommendationContextType | undefined
>(undefined);

export const RecommendationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setDataState] = useState<RecommendationData | null>(null);

  const setData = (newData: RecommendationData) => {
    setDataState(newData);
  };

  const clearData = () => {
    setDataState(null);
  };

  return (
    <RecommendationContext.Provider value={{ data, setData, clearData }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error(
      "useRecommendation must be used within RecommendationProvider",
    );
  }
  return context;
};
