import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit } from "lucide-react";

const DeckCard = ({ deck }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStartReview = (e) => {
    e.stopPropagation();
    navigate(`/decks/${deck._id}/review`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/decks/${deck._id}/edit`);
  };

  return (
    // The perspective wrapper creates the 3D space for the flip effect.
    <div className="relative w-full h-32 [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onClick={handleCardClick}
      >
        {/* Front side of the card */}
        <Card className="bg-background absolute inset-0 [backface-visibility:hidden] hover:shadow-lg transition-shadow">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <h3 className="font-semibold text-lg text-secondary-foreground mb-2">
              {deck.name}
            </h3>
          </CardContent>
        </Card>

        {/* Back side of the card */}
        <Card className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-card">
          <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-3">
            <Button
              onClick={handleStartReview}
              className="w-full bg-background text-primary hover:bg-background hover:shadow-xl"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Review
            </Button>
            <Button
              onClick={handleEdit}
              className="w-full bg-muted-foreground text-background"
            >
              <Edit className="w-4 h-4 mr-2" />
              View Deck
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeckCard;

