import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Import the Input component
import { Label } from "@/components/ui/label"; // Import the Label component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import { api } from "@/services/api";

const EditDeckPage = () => {
  const { id } = useParams(); // Get deck ID from the URL
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for inline card editing
  const [editingCardId, setEditingCardId] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  // State to manage the delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for the rename deck dialog
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  // Fetch the deck and its cards on component load
  useEffect(() => {
    const fetchDeck = async () => {
      setLoading(true);
      const result = await api.getDeckById(id);
      if (result.success) {
        setDeck(result.data.deck);
        setCards(result.data.cards);
        setNewDeckName(result.data.deck.name);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    fetchDeck();
  }, [id]);

  const handleBack = () => navigate("/");
  const handleStartReview = (e) => {
    e.stopPropagation();
    navigate(`/decks/${deck._id}/review`);
  };

  // --- Card CRUD Operations ---

  const handleAddCard = async () => {
    const result = await api.addCard({
      front: "",
      back: "",
      deckId: id,
    });
    if (result.success) {
      const newCard = result.data;
      setCards([...cards, newCard]);
      handleEditCard(newCard); // Immediately enter edit mode for the new card
    } else {
      console.error("Failed to add card:", result.error);
    }
  };

  const handleEditCard = (card) => {
    setEditingCardId(card._id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const handleSaveCard = async () => {
    const result = await api.updateCard(editingCardId, {
      front: editFront,
      back: editBack,
    });
    if (result.success) {
      setCards(
        cards.map((card) =>
          card._id === editingCardId
            ? { ...card, front: editFront, back: editBack }
            : card
        )
      );
      handleCancelEdit();
    } else {
      console.error("Failed to save card:", result.error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleDeleteCard = async (cardId) => {
    if (confirm("Are you sure you want to delete this card?")) {
        const result = await api.deleteCard(cardId);
        if (result.success) {
            setCards(cards.filter((card) => card._id !== cardId));
        } else {
            console.error("Failed to delete card:", result.error);
        }
    }
  };

  // handler for deleting the entire deck
  const handleDeleteDeck = async () => {
    const result = await api.deleteDeck(id);
    if (result.success) {
      setShowDeleteDialog(false);
      navigate("/"); // Navigate back to the dashboard after deletion
    } else {
      console.error("Failed to delete deck:", result.error);
      setShowDeleteDialog(false);
    }
  };

  // Handler for renaming the deck 
    const handleRenameDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim() || newDeckName.trim() === deck.name) {
      setIsRenameDialogOpen(false);
      return;
    }
    const result = await api.updateDeck(id, { name: newDeckName.trim() });
    if (result.success) {
      setDeck(result.data); // Update the deck state with the new data
      setIsRenameDialogOpen(false);
    } else {
      console.error("Failed to rename deck:", result.error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="text-background" text="Loading deck..." />
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!deck) return <div className="p-8">Deck not found.</div>;

return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-8">
        <div className="w-full md:w-auto justify-self-center md:justify-self-start">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Decks
          </Button>
        </div>
        <div className="text-center order-first md:order-none">
          <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogTrigger asChild>
              <h1 className="relative inline-block text-3xl font-bold text-primary-foreground group cursor-pointer p-2">
                {deck?.name}
                <Edit3 className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Deck</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRenameDeck}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deck-name" className="text-right">Name</Label>
                    <Input
                      id="deck-name"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      className="col-span-3"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" className="hover:bg-primary hover:border-primary" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <p className="text-primary-foreground">{cards.length} cards</p>
        </div>
        <div className="w-full md:w-auto justify-self-center md:justify-self-end flex justify-center gap-3">
          <Button onClick={() => navigate(`/decks/${id}/review`)} className="flex items-center gap-2 cursor-pointer">
            <Play className="w-4 h-4" />
            Start Review
          </Button>
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card._id} className="hover:shadow-md transition-shadow bg-white text-foreground">
              <CardContent className="p-6">
                {editingCardId === card._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Front</label>
                      <Textarea value={editFront} onChange={(e) => setEditFront(e.target.value)} className="min-h-[80px]" placeholder="e.g., 'Hello' or a definition"/>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Back</label>
                      <Textarea value={editBack} onChange={(e) => setEditBack(e.target.value)} className="min-h-[80px]" placeholder="e.g., '안녕하세요' or the term"/>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveCard}>Save</Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Front</h4>
                      <p className="text-foreground font-medium">{card.front}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Back</h4>
                      <p className="text-foreground">{card.back}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" onClick={() => handleEditCard(card)} className="flex items-center gap-2 bg-background hover:border-primary"
>
                        <Edit3 className="w-4 h-4" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteCard(card._id)}
                        className="flex items-center gap-2 text-foreground hover:bg-red-600 bg-card hover:text-white
                          hover:border-red-600"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <Card className="border-dashed border-2 bg-white/10">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold text-primary-foreground">
                Let's Add Your First Card!
              </h3>
              <p className="text-primary-foreground/80 mt-2 max-w-sm">
                For the best AI quiz experience, enter the English word on the 'Front' and the Korean translation on the 'Back'.
              </p>
              <Button onClick={handleAddCard} variant="outline" className="flex items-center gap-2 mt-6 hover:bg-card hover:text-foreground">
                <Plus className="w-4 h-4" />
                Add First Card
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-12 flex justify-between items-center">
        <Button onClick={handleAddCard} variant="outline" className="flex items-center gap-2 hover:border-card hover:bg-card hover:text-foreground">
          <Plus className="w-4 h-4" />
          Add Card
        </Button>

        <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" className="flex items-center gap-2 cursor-pointer">
          <Trash2 className="w-4 h-4 " />
          Delete Deck
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deck</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deck?.name}"? This action cannot be undone and will permanently delete all {cards.length} cards in this deck.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-background border-card text-foreground hover:border-primary hover:text-background" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeck}>
              Delete Deck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDeckPage;
