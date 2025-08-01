
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Bird } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Trash2, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

const birdFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  species: z.string().min(1, "Species is required."),
  gender: z.enum(["Male", "Female"]),
  imageUrl: z.string().url("Must be a valid URL.").or(z.literal("")),
  weight: z.coerce.number().positive("Weight must be a positive number."),
  dateCaptured: z.date({ required_error: "A date is required." }),
});

type BirdFormValues = z.infer<typeof birdFormSchema>;

interface ManageBirdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birds: Bird[];
  onSave: (birds: Bird[]) => void;
}

export function ManageBirdsDialog({ open, onOpenChange, birds: initialBirds, onSave }: ManageBirdsDialogProps) {
  const [birds, setBirds] = useState(initialBirds);
  const [editingBird, setEditingBird] = useState<Bird | null>(null);

  const form = useForm<BirdFormValues>({
    resolver: zodResolver(birdFormSchema),
    defaultValues: {
      name: "",
      species: "",
      gender: "Male",
      imageUrl: "",
      weight: 0,
      dateCaptured: new Date(),
    },
  });

  const handleFormSubmit = (values: BirdFormValues) => {
    const birdData = {
        ...values,
        dateCaptured: values.dateCaptured.toISOString(),
    };

    if (editingBird) {
      // Update existing bird
      const updatedBirds = birds.map(b => b.id === editingBird.id ? { ...editingBird, ...birdData } : b);
      setBirds(updatedBirds);
    } else {
      // Add new bird
      const newBird: Bird = {
        ...birdData,
        id: `b${Date.now()}`,
      };
      setBirds([...birds, newBird]);
    }
    setEditingBird(null);
    form.reset({ name: "", species: "", gender: "Male", imageUrl: "", weight: 0, dateCaptured: new Date() });
  };

  const handleEdit = (bird: Bird) => {
    setEditingBird(bird);
    form.reset({
        ...bird,
        dateCaptured: new Date(bird.dateCaptured),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this bird? This will delete all associated data.")) {
        setBirds(birds.filter(b => b.id !== id));
    }
  };
  
  const handleCancelEdit = () => {
    setEditingBird(null);
    form.reset({ name: "", species: "", gender: "Male", imageUrl: "", weight: 0, dateCaptured: new Date() });
  }

  const handleSaveChanges = () => {
    onSave(birds);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Birds</DialogTitle>
          <DialogDescription>
            Add, edit, or remove birds from your journal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                 <h3 className="text-lg font-medium mb-4">{editingBird ? "Edit Bird" : "Add New Bird"}</h3>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="species" render={({ field }) => (
                            <FormItem><FormLabel>Species</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="gender" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem><FormLabel>Weight (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="dateCaptured" render={({ field }) => (
                             <FormItem className="flex flex-col">
                                <FormLabel>Date Captured</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/400x400.png" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="flex justify-end gap-2">
                            {editingBird && <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                            <Button type="submit">{editingBird ? 'Update Bird' : 'Add Bird'}</Button>
                        </div>
                    </form>
                 </Form>
            </div>
            <div>
                 <h3 className="text-lg font-medium mb-4">Your Birds</h3>
                <ScrollArea className="h-[28rem] border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Bird</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {birds.map(bird => (
                            <TableRow key={bird.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={bird.imageUrl} alt={bird.name} data-ai-hint="falcon bird" />
                                    <AvatarFallback>{bird.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {bird.name}
                            </TableCell>
                            <TableCell>{bird.species}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(bird)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(bird.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
        
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
