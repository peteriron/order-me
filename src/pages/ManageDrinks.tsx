import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as Icons from "lucide-react";

export interface Drink {
  name: string;
  icon: string;
  color: string;
}

const availableIcons = [
  "Beer", "Wine", "Coffee", "Droplets", "Grape", "Apple", "Milk", "Cherry",
  "Flame", "Sparkles", "GlassWater", "Flower", "Martini", "Sun", "Soup", "IceCream"
];

const availableColors = [
  { name: "Amber", value: "text-amber-500" },
  { name: "Red", value: "text-red-500" },
  { name: "Orange", value: "text-orange-800" },
  { name: "Blue", value: "text-blue-500" },
  { name: "Purple", value: "text-purple-500" },
  { name: "Green", value: "text-green-500" },
  { name: "Pink", value: "text-pink-500" },
  { name: "Cyan", value: "text-cyan-400" },
  { name: "Yellow", value: "text-yellow-400" },
  { name: "Emerald", value: "text-emerald-400" },
  { name: "Lime", value: "text-lime-500" },
  { name: "Teal", value: "text-teal-400" },
  { name: "Fuchsia", value: "text-fuchsia-500" },
];

const ManageDrinks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newDrink, setNewDrink] = useState<Drink>({
    name: "",
    icon: "Beer",
    color: "text-amber-500"
  });

  useEffect(() => {
    const stored = localStorage.getItem("allDrinks");
    if (stored) {
      setDrinks(JSON.parse(stored));
    }
  }, []);

  const saveDrinks = (updatedDrinks: Drink[]) => {
    localStorage.setItem("allDrinks", JSON.stringify(updatedDrinks));
    setDrinks(updatedDrinks);
    window.dispatchEvent(new Event("storage"));
  };

  const addDrink = () => {
    if (!newDrink.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a drink name",
        variant: "destructive",
      });
      return;
    }

    const updated = [...drinks, newDrink];
    saveDrinks(updated);
    setNewDrink({ name: "", icon: "Beer", color: "text-amber-500" });
    toast({
      title: "Drink added",
      description: `${newDrink.name} has been added to your list`,
    });
  };

  const removeDrink = (index: number) => {
    const updated = drinks.filter((_, i) => i !== index);
    saveDrinks(updated);
    setEditingIndex(null);
    toast({
      title: "Drink removed",
      description: "Drink has been removed from your list",
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  const saveEdit = (index: number, updatedDrink: Drink) => {
    const updated = [...drinks];
    updated[index] = updatedDrink;
    saveDrinks(updated);
    setEditingIndex(null);
    toast({
      title: "Drink updated",
      description: `${updatedDrink.name} has been updated`,
    });
  };

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Manage Drinks</h1>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Drink</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="drink-name">Drink Name</Label>
              <Input
                id="drink-name"
                value={newDrink.name}
                onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                placeholder="e.g., Mojito"
              />
            </div>

            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {availableIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setNewDrink({ ...newDrink, icon: iconName })}
                    className={`p-2 rounded border-2 transition-all ${
                      newDrink.icon === iconName
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {renderIcon(iconName, "w-5 h-5")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewDrink({ ...newDrink, color: color.value })}
                    className={`p-3 rounded border-2 transition-all ${
                      newDrink.color === color.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {renderIcon(newDrink.icon, `w-5 h-5 ${color.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={addDrink} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Drink
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Drinks ({drinks.length})</h2>
          
          {drinks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No drinks yet. Add your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {drinks.map((drink, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <Input
                        value={drink.name}
                        onChange={(e) => {
                          const updated = [...drinks];
                          updated[index] = { ...updated[index], name: e.target.value };
                          setDrinks(updated);
                        }}
                        placeholder="Drink name"
                      />
                      <div>
                        <Label className="text-sm">Icon</Label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                          {availableIcons.map((iconName) => (
                            <button
                              key={iconName}
                              onClick={() => {
                                const updated = [...drinks];
                                updated[index] = { ...updated[index], icon: iconName };
                                setDrinks(updated);
                              }}
                              className={`p-2 rounded border-2 transition-all ${
                                drink.icon === iconName
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {renderIcon(iconName, "w-4 h-4")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Color</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {availableColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => {
                                const updated = [...drinks];
                                updated[index] = { ...updated[index], color: color.value };
                                setDrinks(updated);
                              }}
                              className={`p-2 rounded border-2 transition-all ${
                                drink.color === color.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {renderIcon(drink.icon, `w-4 h-4 ${color.value}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => saveEdit(index, drink)} className="flex-1">
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {renderIcon(drink.icon, `w-6 h-6 ${drink.color}`)}
                        <span className="font-medium">{drink.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEditing(index)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeDrink(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageDrinks;
