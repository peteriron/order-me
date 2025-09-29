import { Beer, Coffee, Milk, Wine, Droplets, Grape, Apple, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Order, CompletedOrder } from "@/pages/Index";
import { OrderHistory } from "@/components/OrderHistory";
import { useState } from "react";

interface DrinkOrderProps {
  currentOrder: Order;
  onAddDrink: (drink: string) => void;
  onSwipeRight: () => void;
  orderHistory: CompletedOrder[];
}

const drinks = [
  { name: "Beer", icon: Beer, color: "text-amber-500" },
  { name: "Wine", icon: Wine, color: "text-red-500" },
  { name: "Coffee", icon: Coffee, color: "text-orange-800" },
  { name: "Water", icon: Droplets, color: "text-blue-500" },
  { name: "Juice", icon: Grape, color: "text-purple-500" },
  { name: "Soda", icon: Apple, color: "text-green-500" },
  { name: "Milk", icon: Milk, color: "text-slate-100" },
  { name: "Cocktail", icon: Cherry, color: "text-pink-500" },
];

export const DrinkOrder = ({ currentOrder, onAddDrink, onSwipeRight, orderHistory }: DrinkOrderProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchEnd - touchStart;
    
    if (diff > 100) { // Swipe right threshold
      onSwipeRight();
    }
    
    setTouchStart(null);
  };

  const totalItems = Object.values(currentOrder).reduce((sum, count) => sum + count, 0);

  return (
    <div 
      className="min-h-screen p-6 pb-24"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Drink Orders</h1>
            <p className="text-muted-foreground">Tap drinks, swipe right to review →</p>
          </div>
          {totalItems > 0 && (
            <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
              {totalItems} items
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {drinks.map((drink) => {
            const Icon = drink.icon;
            const count = currentOrder[drink.name] || 0;
            
            return (
              <Card
                key={drink.name}
                className="relative overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer border-2"
                onClick={() => onAddDrink(drink.name)}
              >
                <div className="p-6 flex flex-col items-center justify-center space-y-3">
                  <div className="relative">
                    <Icon className={`w-12 h-12 ${drink.color}`} strokeWidth={1.5} />
                    {count > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 flex items-center justify-center bg-secondary text-secondary-foreground animate-bounce-in"
                      >
                        {count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-foreground">{drink.name}</span>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide" : "View"} Order History ({orderHistory.length})
        </Button>

        {showHistory && (
          <div className="mt-6 animate-scale-in">
            <OrderHistory orders={orderHistory} />
          </div>
        )}
      </div>
    </div>
  );
};
