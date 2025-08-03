

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Checkbox } from "./ui/checkbox";

const birdFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  species: z.string().min(1, "Species is required."),
  gender: z.enum(["Male", "Female"]),
  imageUrl: z.string().url().optional().or(z.literal('')),
  weight: z.coerce.number().positive("Weight must be a positive number."),
  dateCaptured: z.date({ required_error: "A date is required." }),
  isHidden: z.boolean().default(false),
});

type BirdFormValues = z.infer<typeof birdFormSchema>;

interface ManageBirdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birds: Bird[];
  onSave: (birds: Bird[]) => void;
  onDeleteBird: (birdId: string, deleteLogs: boolean) => void;
}

export function ManageBirdsDialog({ open, onOpenChange, birds: initialBirds, onSave, onDeleteBird }: ManageBirdsDialogProps) {
  const [birds, setBirds] = useState(initialBirds);
  const [editingBird, setEditingBird] = useState<Bird | null>(null);
  const [birdToDelete, setBirdToDelete] = useState<Bird | null>(null);
  const [deleteLogs, setDeleteLogs] = useState(true);

  useEffect(() => {
    setBirds(initialBirds);
  }, [initialBirds, open]);

  const form = useForm<BirdFormValues>({
    resolver: zodResolver(birdFormSchema),
    defaultValues: {
      name: "",
      species: "",
      gender: "Male",
      imageUrl: "",
      weight: 0,
      dateCaptured: new Date(),
      isHidden: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (values: BirdFormValues) => {
    let updatedBirds;
    if (editingBird) {
      updatedBirds = birds.map(b => 
        b.id === editingBird.id 
          ? { ...b, ...values, dateCaptured: values.dateCaptured.toISOString() } 
          : b
      );
    } else {
      const newBird: Bird = {
        ...values,
        id: `b${Date.now()}`,
        dateCaptured: values.dateCaptured.toISOString(),
      };
      updatedBirds = [...birds, newBird];
    }
    setBirds(updatedBirds);
    setEditingBird(null);
    form.reset({ name: "", species: "", gender: "Male", imageUrl: "", weight: 0, dateCaptured: new Date(), isHidden: false });
  };
  
  const handleToggleVisibility = (birdId: string) => {
    const updatedBirds = birds.map(b => b.id === birdId ? { ...b, isHidden: !b.isHidden } : b);
    setBirds(updatedBirds);
  }

  const handleEdit = (bird: Bird) => {
    setEditingBird(bird);
    form.reset({
        ...bird,
        dateCaptured: parseISO(bird.dateCaptured),
    });
  };

  const confirmDelete = () => {
    if (birdToDelete) {
        onDeleteBird(birdToDelete.id, deleteLogs);
        setBirdToDelete(null);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingBird(null);
    form.reset({ name: "", species: "", gender: "Male", imageUrl: "", weight: 0, dateCaptured: new Date(), isHidden: false });
  }

  const handleSaveChanges = () => {
    onSave(birds);
    onOpenChange(false);
  }
  
  const handleClose = () => {
    setEditingBird(null);
    form.reset({ name: "", species: "", gender: "Male", imageUrl: "", weight: 0, dateCaptured: new Date(), isHidden: false });
    onOpenChange(false);
  }

  return (
    <>
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Birds</DialogTitle>
          <DialogDescription>
            Add, edit, or remove birds from your journal. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
            <ScrollArea className="pr-4">
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="weight" render={({ field }) => (
                                <FormItem><FormLabel>Initial Weight (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
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
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image (Optional)</FormLabel>
                              <FormControl>
                                 <Input type="file" accept="image/*" onChange={handleImageChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                            {editingBird && <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>}
                            <Button type="submit">{editingBird ? 'Update Bird' : 'Add Bird'}</Button>
                        </div>
                    </form>
                 </Form>
            </ScrollArea>
            <ScrollArea className="pr-4">
                 <h3 className="text-lg font-medium mb-4">Your Birds</h3>
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
                        <TableRow key={bird.id} className={cn(bird.isHidden && "opacity-50")}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={bird.imageUrl} alt={bird.name} data-ai-hint="falcon bird" />
                                <AvatarFallback>{bird.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {bird.name}
                        </TableCell>
                        <TableCell>{bird.species}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleToggleVisibility(bird.id)}>
                                {bird.isHidden ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(bird)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setBirdToDelete(bird)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
        
        <DialogFooter className="mt-auto pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AlertDialog open={!!birdToDelete} onOpenChange={(isOpen) => !isOpen && setBirdToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete {birdToDelete?.name}. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center space-x-2 my-4">
                <Checkbox id="delete-logs" checked={deleteLogs} onCheckedChange={(checked) => setDeleteLogs(!!checked)} />
                <label
                    htmlFor="delete-logs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Delete all associated log data for this bird.
                </label>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

    