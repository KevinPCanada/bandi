import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play, Trash2, Edit3, Save, AlertTriangle } from "lucide-react";
// Using relative paths to ensure resolution across different build environments
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import Loader from "../../components/Loader";
import { api } from "../../services/api";
import { toast } from "sonner"; // Assuming sonner is available for feedback

const EditDeckPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [originalCards, setOriginalCards] = useState([]); // For change detection
  const [deletedCardIds, setDeletedCardIds] = useState([]); // Track existing cards to delete
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // --- Navigation Guard State ---
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

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
        const fetchedCards = result.data.cards || [];
        setCards(fetchedCards);
        setOriginalCards(JSON.parse(JSON.stringify(fetchedCards)));
        setNewDeckName(result.data.deck.name);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    fetchDeck();
  }, [id]);

  // --- Change Detection ---
  const hasChanges =
    JSON.stringify(cards) !== JSON.stringify(originalCards) ||
    deletedCardIds.length > 0;

  // --- Browser-Level Guard (Tab Close/Refresh) ---
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // --- Navigation Guard Handlers ---
  const handleProtectedNavigation = (path) => {
    if (hasChanges) {
      setPendingPath(path);
      setShowNavigationDialog(true);
    } else {
      navigate(path);
    }
  };

  const handleDiscardAndLeave = () => {
    setShowNavigationDialog(false);
    navigate(pendingPath);
  };

  const handleSaveAndLeave = async () => {
    await handleSaveChanges();
    setShowNavigationDialog(false);
    navigate(pendingPath);
  };

  // --- Card Operations (Local State Only) ---

  const handleAddCard = () => {
    const newCard = {
      _id: `temp-${Date.now()}`, // Temporary ID for client-side tracking
      front: "",
      back: "",
    };
    setCards([...cards, newCard]);
    handleEditCard(newCard); // Immediately enter edit mode for the new card
  };

  const handleEditCard = (card) => {
    setEditingCardId(card._id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  // This replaces handleSaveCard: Updates local state instead of calling API
  const handleUpdateCardInState = () => {
    setCards(
      cards.map((card) =>
        card._id === editingCardId
          ? { ...card, front: editFront, back: editBack }
          : card
      )
    );
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleDeleteCard = (cardId) => {
    if (confirm("Are you sure you want to delete this card?")) {
      // If it's a real card (not a temp one), track for DB deletion
      if (!cardId.toString().startsWith("temp-")) {
        setDeletedCardIds([...deletedCardIds, cardId]);
      }
      setCards(cards.filter((card) => card._id !== cardId));
    }
  };

  // --- Bulk Sync Operation ---
  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Split cards into new and existing
    const cardsToCreate = cards
      .filter((c) => c._id.toString().startsWith("temp-"))
      .map(({ front, back }) => ({ front, back }));

    const cardsToUpdate = cards
      .filter((c) => !c._id.toString().startsWith("temp-"))
      .map(({ _id, front, back }) => ({ _id, front, back }));

    const syncData = {
      cardsToCreate,
      cardsToUpdate,
      cardsToDelete: deletedCardIds,
    };

    const result = await api.syncDeck(id, syncData);

    if (result.success) {
      toast.success("Changes saved successfully!");
      // Update state with fresh data from server (real IDs for new cards)
      const syncedCards = result.data.cards;
      setCards(syncedCards);
      setOriginalCards(JSON.parse(JSON.stringify(syncedCards)));
      setDeletedCardIds([]);
    } else {
      toast.error("Failed to save changes.");
      console.error("Sync error:", result.error);
    }
    setIsSaving(false);
  };

  // --- Deck Operations ---

  const handleDeleteDeck = async () => {
    const result = await api.deleteDeck(id);
    if (result.success) {
      setShowDeleteDialog(false);
      navigate("/");
    } else {
      console.error("Failed to delete deck:", result.error);
      setShowDeleteDialog(false);
    }
  };

  const handleRenameDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim() || newDeckName.trim() === deck.name) {
      setIsRenameDialogOpen(false);
      return;
    }
    const result = await api.updateDeck(id, { name: newDeckName.trim() });
    if (result.success) {
      setDeck(result.data);
      setIsRenameDialogOpen(false);
    } else {
      console.error("Failed to rename deck:", result.error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-background">
        <Loader className="text-background" text="Loading deck..." />
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!deck) return <div className="p-8">Deck not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Defining a custom "bob" animation here so it's self-contained. 
        This will make the Save Changes button move slightly up and down.
      */}
      <style>
        {`
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bob {
            animation: bob 2s ease-in-out infinite;
          }
        `}
      </style>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-8">
        <div className="w-full md:w-auto justify-self-center md:justify-self-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleProtectedNavigation("/")}
            className="flex items-center gap-2 text-primary-foreground hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Decks
          </Button>
        </div>
        <div className="text-center order-first md:order-none">
          <Dialog
            open={isRenameDialogOpen}
            onOpenChange={setIsRenameDialogOpen}
          >
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
                    <Label htmlFor="deck-name" className="text-right">
                      Name
                    </Label>
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
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-primary hover:border-primary"
                    onClick={() => setIsRenameDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <p className="text-primary-foreground">{cards.length} cards</p>
        </div>
        <div className="w-full md:w-auto justify-self-center md:justify-self-end flex justify-center gap-3">
          <Button
            onClick={() => handleProtectedNavigation(`/decks/${id}/review`)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Start Review
          </Button>
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card
              key={card._id}
              className={`hover:shadow-md transition-shadow bg-white text-foreground ${
                card._id.toString().startsWith("temp-")
                  ? "border-primary border-2"
                  : ""
              }`}
            >
              <CardContent className="p-6">
                {editingCardId === card._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Front
                      </label>
                      <Textarea
                        value={editFront}
                        onChange={(e) => setEditFront(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="e.g., 'Hello' or a definition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Back
                      </label>
                      <Textarea
                        value={editBack}
                        onChange={(e) => setEditBack(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="e.g., '안녕하세요' or the term"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateCardInState}>
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Front
                      </h4>
                      <p className="text-foreground font-medium">
                        {card.front || (
                          <span className="italic text-muted-foreground text-xs">
                            (Empty)
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Back
                      </h4>
                      <p className="text-foreground">
                        {card.back || (
                          <span className="italic text-muted-foreground text-xs">
                            (Empty)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditCard(card)}
                        className="flex items-center gap-2 bg-background hover:border-primary"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteCard(card._id)}
                        className="flex items-center gap-2 text-foreground hover:bg-red-600 bg-card hover:text-white hover:border-red-600"
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
                For the best AI quiz experience, enter the English word on the
                'Front' and the Korean translation on the 'Back'.
              </p>
              <Button
                onClick={handleAddCard}
                variant="outline"
                className="flex items-center gap-2 mt-6 hover:bg-card hover:text-foreground"
              >
                <Plus className="w-4 h-4" /> Add First Card
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-12 flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            onClick={handleAddCard}
            variant="outline"
            className="flex items-center gap-2 hover:border-card hover:bg-card hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </Button>

          {/* "Save Changes" button, only visible when changes exist */}
          {hasChanges && (
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`flex items-center gap-2 bg-primary animate-in fade-in zoom-in-95 shadow-md cursor-pointer transition-all ${
                !isSaving ? "animate-bob" : ""
              }`}
            >
              {isSaving ? (
                <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          )}
        </div>

        <Button
          onClick={() => setShowDeleteDialog(true)}
          variant="destructive"
          className="flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 " />
          Delete Deck
        </Button>
      </div>

      {/* --- NEW: Navigation Guard Dialog --- */}
      <Dialog open={showNavigationDialog} onOpenChange={setShowNavigationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" /> Unsaved Changes
            </DialogTitle>
            <DialogDescription className="py-2 text-base text-foreground">
              You have unsaved modifications in <strong>{deck?.name}</strong>. Would you like to save them before leaving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handleDiscardAndLeave} 
              className="sm:mr-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              Discard Changes
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowNavigationDialog(false)}
            >
              Stay Here
            </Button>
            <Button 
              onClick={handleSaveAndLeave} 
              className="bg-primary text-primary-foreground"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deck</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deck?.name}"? This action cannot
              be undone and will permanently delete all {cards.length} cards in
              this deck.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-background border-card text-foreground hover:border-primary hover:text-background"
              onClick={() => setShowDeleteDialog(false)}
            >
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