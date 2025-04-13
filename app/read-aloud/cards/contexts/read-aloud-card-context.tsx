import { HttpResponse } from "@/infrastructure/httpClient/types";
import { CardReadAloud } from "@/main/entities/card-read-aloud.type";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../page";
import { httpCardService } from "@/infrastructure/cards";
import { createContext, useContext } from "react";
import { useUser } from "@/main/UserContext/UserContext";

type CardsDataContextType = {
    data: HttpResponse<CardReadAloud[]> | undefined;
    isLoading: boolean;
    error: unknown;
  };
  
  export const CardsDataContext = createContext<CardsDataContextType | undefined>(undefined);
  
  export const CardsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const userId = user?.body?.data?.id;

    const { data, isLoading: isLoadingCards, error } = useQuery({
      queryKey: [QueryKeys.CARDS],
      enabled: !!userId,
      queryFn: () => httpCardService.getAll(userId),
    });
  
    const isLoadingArray = [isLoadingCards];
    const isLoading = isLoadingArray.some((loading) => loading);
  
    return (
      <CardsDataContext.Provider value={{ data, isLoading, error }}>
        {children}
      </CardsDataContext.Provider>
    );
  };
  
  export const useCardsData = (): CardsDataContextType => {
    const context = useContext(CardsDataContext);
    if (!context) {
      throw new Error("useCardsData must be used within a CardsDataProvider");
    }
    return context;
  };