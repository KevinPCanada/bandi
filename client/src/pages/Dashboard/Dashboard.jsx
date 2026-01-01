import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { api } from "../../services/api";
import DeckCard from "../../components/DeckCard"; // 1. Import the new component
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Loader from "../../components/Loader";

import { Card, CardContent } from "../../components/ui/card";

export default function Dashboard() {
  // Set up state to hold decks, loading status, and errors
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the "Create Deck" dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  // state to control the delete account dialog.
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get the deleteAccount function from the context.
  const { deleteAccount } = useAuth();

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        const fetchedDecks = await api.getMyDecks(); // Assumes api.js has this function
        if (fetchedDecks.success) {
          setDecks(fetchedDecks.data);
        } else {
          setError("Failed to fetch decks.");
        }
      } catch (err) {
        setError("An error occurred while fetching decks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []); // The empty array [] means this effect runs once on mount

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    const result = await api.createDeck({ name: newDeckName.trim() });
    if (result.success) {
      // Add the new deck to the state for an instant UI update
      setDecks([...decks, result.data]);
      setNewDeckName(""); // Reset input field
      setIsDialogOpen(false); // Close the dialog
    } else {
      // You could set an error state here to show in the dialog
      console.error("Failed to create deck:", result.error);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      setIsDeleteDialogOpen(false);
      // No need to navigate, as the AuthContext will log the user out,
      // and the ProtectedRoute will automatically redirect to /login.
    } else {
      console.error("Failed to delete account:", result.error);
      // You could show an error toast here.
    }
  };

  // Render different UI based on the state
  if (loading) {
    return ( 
      <div className="text-primary-foreground w-full h-full flex items-center justify-center p-10">
        <Loader text="Loading your decks..." className="text-primary-foreground" />
      </div>
    );
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-foreground">My Decks</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                  <Button className="hover:bg-card hover:text-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Deck
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                      <DialogTitle>Create New Deck</DialogTitle>
                      <DialogDescription>
                          Enter a name for your new flashcard deck. You can add cards to it later.
                      </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateDeck}>
                      <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="deck-name" className="text-right">
                                  Name
                              </Label>
                              <Input
                                  id="deck-name"
                                  value={newDeckName}
                                  onChange={(e) => setNewDeckName(e.target.value)}
                                  placeholder="e.g., Korean Chapter 1"
                                  className="col-span-3"
                                  autoFocus
                              />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button type="button" className="hover:bg-destructive hover:text-background" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                          </Button>
                          <Button type="submit" disabled={!newDeckName.trim()}>
                              Create Deck
                          </Button>
                      </DialogFooter>
                  </form>
              </DialogContent>
          </Dialog>
      </div>

      {decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {decks.map((deck) => (
                  <DeckCard key={deck._id} deck={deck} />
              ))}
          </div>
      ) : (
          <div className="text-center p-10 border-2 border-dashed rounded-lg bg-card/10">
              <h2 className="text-xl font-semibold text-primary-foreground">No decks found</h2>
              <p className="text-background mt-2">
                  Click "Create New Deck" to get started!
              </p>
          </div>
      )}

      <div className="absolute bottom-8 right-8">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <button className="text-xs text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors underline">
              Delete Account
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure? This action cannot be undone and all your decks and
                cards will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" className="hover:bg-primary hover:border-primary" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
