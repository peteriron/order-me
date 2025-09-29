import { Card } from "@/components/ui/card";
import { CompletedOrder } from "@/pages/Index";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface OrderHistoryProps {
  orders: CompletedOrder[];
}

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  if (orders.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">No previous orders yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const totalItems = Object.values(order.items).reduce((sum, count) => sum + count, 0);
        
        return (
          <Card key={order.id} className="p-4 border-2">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {format(order.timestamp, "MMM d, yyyy 'at' h:mm a")}
              </div>
              <div className="text-sm font-semibold text-primary">
                {totalItems} items
              </div>
            </div>
            
            <div className="space-y-2">
              {Object.entries(order.items).map(([drink, count]) => (
                <div key={drink} className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{drink}</span>
                  <span className="text-muted-foreground">×{count}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
