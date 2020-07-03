import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

const ExpansionContext = createContext<
  [number | null, Dispatch<SetStateAction<number | null>>] | null
>(null);

export function useExpandedItem(id: number) {
  const context = useContext(ExpansionContext);

  if (context === undefined || context === null)
    throw Error("ExpansionContext not found.");

  const [expandedItem, setExpandedItem] = context;

  const isExpanded = id === expandedItem;

  const toggleExpansion = useCallback(() => {
    if (isExpanded) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  }, [isExpanded, id, setExpandedItem]);

  return {
    toggleExpansion,
    isExpanded,
  };
}

const OpenedAccordionProvider: React.FC = ({ children }) => {
  const value = useState<number | null>(null);

  return (
    <ExpansionContext.Provider value={value}>
      {children}
    </ExpansionContext.Provider>
  );
};

export default OpenedAccordionProvider;
