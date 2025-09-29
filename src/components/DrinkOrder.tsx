import { Beer, Coffee, Milk, Wine, Droplets, Grape, Apple, Cherry, CheckCircle, RotateCcw, Minus, Plus, Martini, Flame, Sparkles, GlassWater, Sun, Soup, IceCream, Flower, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Order, CompletedOrder } from "@/pages/Index";
import { OrderHistory } from "@/components/OrderHistory";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

export interface DrinkItem {
  name: string;
  icon: string;
  color: string;
}

interface DrinkOrderProps {
  currentOrder: Order;
  drinks: DrinkItem[];
  onAddDrink: (drink: string) => void;
  onDecreaseDrink: (drink: string) => void;
  onSwipeRight: () => void;
  onReset: () => void;
  onSubmit: () => void;
  orderHistory: CompletedOrder[];
}

export const defaultDrinks: DrinkItem[] = [
  { name: "Beer", icon: "Beer", color: "text-amber-500" },
  { name: "Duvel", icon: "Beer", color: "text-yellow-300" },
  { name: "Zero", icon: "Beer", color: "text-blue-400" },
  { name: "Cola", icon: "Droplets", color: "text-orange-900" },
  { name: "Still Water", icon: "Droplets", color: "text-blue-500" },
  { name: "Sparkling W", icon: "Sparkles", color: "text-cyan-400" },
  { name: "Coffee", icon: "Coffee", color: "text-orange-800" },
  { name: "Deca", icon: "Coffee", color: "text-orange-600" },
  { name: "Thee", icon: "Soup", color: "text-green-600" },
  { name: "Fanta", icon: "Sparkles", color: "text-orange-500" },
  { name: "Ice Tea", icon: "Soup", color: "text-amber-600" },
  { name: "Fruit Juice", icon: "Apple", color: "text-red-500" },
  { name: "Cava", icon: "Sparkles", color: "text-yellow-300" },
  { name: "White wine", icon: "Wine", color: "text-yellow-400" },
  { name: "Rose wine", icon: "Wine", color: "text-pink-500" },
  { name: "Red wine", icon: "Wine", color: "text-red-600" },
  { name: "0.0 Beer", icon: "Beer", color: "text-slate-400" },
  { name: "Liquor", icon: "Flame", color: "text-purple-500" },
];

export const DrinkOrder = ({ currentOrder, drinks, onAddDrink, onDecreaseDrink, onSwipeRight, onReset, onSubmit, orderHistory }: DrinkOrderProps) => {
  const navigate = useNavigate();
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

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className={className} strokeWidth={1.5} /> : null;
  };

  return (
    <div 
      className="min-h-screen p-6 pb-24"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">This round is from me</h1>
            <p 
              className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={onSwipeRight}
            >
              Tap here to review order →
            </p>
          </div>
          {totalItems > 0 && (
            <Badge 
              className="text-base px-3 py-1.5 bg-primary text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onSwipeRight}
            >
              {totalItems} items
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {drinks.map((drink, index) => {
            const count = currentOrder[drink.name] || 0;
            
            return (
              <Card
                key={`${drink.name}-${index}`}
                className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-2"
              >
                <div className="p-2 flex flex-col items-center gap-2">
                  <div 
                    className="flex flex-col items-center justify-center space-y-1 flex-1 cursor-pointer active:scale-95 transition-transform w-full"
                    onClick={() => onAddDrink(drink.name)}
                  >
                    <div className="relative">
                      {renderIcon(drink.icon, `w-6 h-6 ${drink.color}`)}
                      {count > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-secondary text-secondary-foreground animate-bounce-in text-[10px]"
                        >
                          {count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground text-center leading-tight">{drink.name}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDecreaseDrink(drink.name);
                      }}
                      disabled={count === 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-full bg-primary/10 hover:bg-primary/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDrink(drink.name);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {totalItems > 0 && (
          <div className="space-y-2 mb-4">
            <Button
              className="w-full h-12 text-base"
              onClick={onSubmit}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Order
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Order
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/manage-drinks")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Drinks
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide" : "View"} Order History ({orderHistory.length})
          </Button>
        </div>

        {showHistory && (
          <div className="mt-6 animate-scale-in">
            <OrderHistory orders={orderHistory} />
          </div>
        )}
      </div>
    </div>
  );
};
