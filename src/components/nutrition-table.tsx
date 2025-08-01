
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NutritionInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  foodType: z.string().min(1, "Food type is required."),
  proteinPer100g: z.coerce.number().min(0, "Protein value must be a positive number."),
});

type FormValues = z.infer<typeof formSchema>;

interface NutritionTableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: NutritionInfo[];
  onSave: (data: NutritionInfo[]) => void;
}

export function NutritionTable({ open, onOpenChange, initialData, onSave }: NutritionTableProps) {
  const [nutritionData, setNutritionData] = useState(initialData);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodType: "",
      proteinPer100g: 0,
    },
  });

  const handleAdd = (values: FormValues) => {
    const newItem: NutritionInfo = {
      id: `n${Date.now()}`,
      ...values,
    };
    setNutritionData([...nutritionData, newItem]);
    form.reset();
  };

  const handleDelete = (id: string) => {
    setNutritionData(nutritionData.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave(nutritionData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nutrition Table</DialogTitle>
          <DialogDescription>
            Manage protein values for different food types.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="grid grid-cols-3 gap-4 items-end">
            <FormField
              control={form.control}
              name="foodType"
              render={({ field }) => (
                <FormItem className="col-span-3 sm:col-span-1">
                  <FormLabel>Food Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proteinPer100g"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Protein (g) / 100g</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 22" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="col-span-1">Add</Button>
          </form>
        </Form>
        
        <ScrollArea className="h-60 mt-4 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Type</TableHead>
                <TableHead>Protein/100g</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutritionData.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.foodType}</TableCell>
                  <TableCell>{item.proteinPer100g}g</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
