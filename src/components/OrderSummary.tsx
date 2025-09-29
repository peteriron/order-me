import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Order } from "@/pages/Index";

interface OrderSummaryProps {
  order: Order;
  onBack: () => void;
  onReset: () => void;
  onComplete: () => void;
}

export const OrderSummary = ({ order, onBack, onReset, onComplete }: OrderSummaryProps) => {
  const orderItems = Object.entries(order).filter(([_, count]) => count > 0);
  const totalItems = Object.values(order).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen p-6 animate-slide-in-right">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Summary</h1>
          <p className="text-muted-foreground">Show this to the bartender</p>
        </div>

        <Card className="p-6 mb-6 border-2">
          <div className="space-y-4">
            {orderItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No items in order</p>
            ) : (
              <>
                {orderItems.map(([drink, count]) => (
                  <div
                    key={drink}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <span className="text-2xl font-semibold text-foreground">{drink}</span>
                    <span className="text-3xl font-bold text-primary">×{count}</span>
                  </div>
                ))}
                <div className="pt-4 border-t-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">Total Items</span>
                    <span className="text-3xl font-bold text-primary">{totalItems}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            className="w-full h-14 text-lg"
            onClick={onComplete}
            disabled={orderItems.length === 0}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Complete Order
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-14 text-lg"
            onClick={onReset}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset Order
          </Button>
        </div>
      </div>
    </div>
  );
};
