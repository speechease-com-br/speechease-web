import { HttpResponse } from "@/infrastructure/http/types";
import { CardReadAloud } from "@/domain/entities/card-read-aloud.type";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../page";
import { HttpCardRepository } from "@/infrastructure/repositories/cards-infra";
import { createContext, useContext } from "react";
import { useAuth } from "@/presentation/hooks/useAuth";

type CardsDataContextType = {
    data: CardReadAloud[] | undefined;
    isLoading: boolean;
    error: unknown;
  };
  
  export const CardsDataContext = createContext<CardsDataContextType | undefined>(undefined);
  
  export const CardsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id;
    const cardRepository = new HttpCardRepository();

    const { data, isLoading: isLoadingCards, error } = useQuery({
      queryKey: [QueryKeys.CARDS],
      enabled: !!userId,
      queryFn: () => cardRepository.getCards(),
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