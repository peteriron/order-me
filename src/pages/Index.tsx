import { useState, useEffect } from "react";
import { DrinkOrder, defaultDrinks, DrinkItem } from "@/components/DrinkOrder";
import { OrderSummary } from "@/components/OrderSummary";
import { OrderHistory } from "@/components/OrderHistory";
import { useToast } from "@/hooks/use-toast";

export interface Order {
  [key: string]: number;
}

export interface CompletedOrder {
  id: string;
  timestamp: Date;
  items: Order;
}

const Index = () => {
  const [currentOrder, setCurrentOrder] = useState<Order>({});
  const [showSummary, setShowSummary] = useState(false);
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const { toast } = useToast();

  // Load custom drinks
  useEffect(() => {
    const customDrinks = localStorage.getItem("customDrinks");
    if (customDrinks) {
      const parsed = JSON.parse(customDrinks);
      setDrinks([...defaultDrinks, ...parsed]);
    } else {
      setDrinks(defaultDrinks);
    }

    // Listen for changes to custom drinks
    const handleStorageChange = () => {
      const customDrinks = localStorage.getItem("customDrinks");
      if (customDrinks) {
        const parsed = JSON.parse(customDrinks);
        setDrinks([...defaultDrinks, ...parsed]);
      } else {
        setDrinks(defaultDrinks);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load order history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("orderHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrderHistory(parsed.map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      })));
    }
  }, []);

  // Save order history to localStorage
  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addDrink = (drink: string) => {
    setCurrentOrder((prev) => ({
      ...prev,
      [drink]: (prev[drink] || 0) + 1,
    }));
  };

  const decreaseDrink = (drink: string) => {
    setCurrentOrder((prev) => {
      const currentCount = prev[drink] || 0;
      if (currentCount <= 1) {
        const { [drink]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [drink]: currentCount - 1,
      };
    });
  };

  const resetOrder = () => {
    setCurrentOrder({});
    setShowSummary(false);
    toast({
      title: "Order reset",
      description: "Ready for a new order!",
    });
  };

  const completeOrder = () => {
    if (Object.keys(currentOrder).length === 0) {
      toast({
        title: "Empty order",
        description: "Add some drinks first!",
        variant: "destructive",
      });
      return;
    }

    const newOrder: CompletedOrder = {
      id: Date.now().toString(),
      timestamp: new Date(),
      items: { ...currentOrder },
    };

    setOrderHistory((prev) => [newOrder, ...prev]);
    setCurrentOrder({});
    setShowSummary(false);
    
    toast({
      title: "Order completed!",
      description: "Order saved to history",
    });
  };

  const handleSwipeRight = () => {
    if (Object.keys(currentOrder).length > 0) {
      setShowSummary(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {!showSummary ? (
        <DrinkOrder
          currentOrder={currentOrder}
          drinks={drinks}
          onAddDrink={addDrink}
          onDecreaseDrink={decreaseDrink}
          onSwipeRight={handleSwipeRight}
          onReset={resetOrder}
          onSubmit={completeOrder}
          orderHistory={orderHistory}
        />
      ) : (
        <OrderSummary
          order={currentOrder}
          onBack={() => setShowSummary(false)}
          onReset={resetOrder}
          onComplete={completeOrder}
        />
      )}
    </div>
  );
};

export default Index;
