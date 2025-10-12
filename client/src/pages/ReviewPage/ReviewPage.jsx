import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FlippableFlashcard from "@/components/FlippableFlashcard";
import Loader from "@/components/Loader";
import { RateLimitNotification } from "@/components/RateLimitNotification";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

// a helper function to shuffle the order of an array.
// used to randomize the order of cards and multiple-choice options.
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// the main component for the entire review session page.
export default function ReviewPage() {
  // --- Hooks Initialization ---
  // gets the deck's ID from the URL and functions from the AuthContext.
  const { id } = useParams();
  const { updateUser } = useAuth();
  // a ref to track which card indexes have had questions generated.
  // this prevents the double API call issue caused by React's Strict Mode.
  const generatedIndexes = useRef(new Set());

  // --- State Management ---
  // holds all data that can change during the component's lifecycle.
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isSessionOver, setIsSessionOver] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rateLimitHit, setRateLimitHit] = useState(false);

  // --- Data Fetching Effect ---
  // runs once when the component first loads to fetch the deck and its cards.
  useEffect(() => {
    const fetchDeckData = async () => {
      setLoading(true);
      const result = await api.getDeckById(id);
      if (result.success) {
        setDeck(result.data.deck);
        if (result.data.cards && result.data.cards.length > 0) {
          setCards(shuffleArray([...result.data.cards]));
        } else {
          setError("This deck has no cards to review.");
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    fetchDeckData();
  }, [id]);

  // --- Question Generation Effect ---
  // runs whenever the user moves to a new card.
  // generates the AI sentence stem and the multiple-choice options.
  useEffect(() => {
    const generateQuestion = async () => {
      if (cards.length > 0 && currentCardIndex < cards.length) {
        if (generatedIndexes.current.has(currentCardIndex)) return;
        setIsGenerating(true);
        generatedIndexes.current.add(currentCardIndex);

        const currentCard = cards[currentCardIndex];
        const otherCards = cards.filter((c) => c._id !== currentCard._id);
        let incorrectOptions = [];
        if (otherCards.length >= 2) {
          const shuffledOthers = shuffleArray([...otherCards]);
          incorrectOptions = [shuffledOthers[0].back, shuffledOthers[1].back];
        } else {
          incorrectOptions = ["Sample Term 1", "Sample Term 2"];
        }

        let questionText;
        if (rateLimitHit) {
          questionText = currentCard.front;
        } else {
          const aiResult = await api.generateSentenceStem(
            currentCard,
            incorrectOptions
          );
          if (aiResult.success) {
            questionText = aiResult.data.sentenceStem;
            updateUser({ apiCallCount: aiResult.data.apiCallCount });
          } else {
            if (
              aiResult.error &&
              typeof aiResult.error === "string" &&
              aiResult.error.includes("daily limit")
            ) {
              if (!rateLimitHit) {
                toast.error("AI Limit Reached", {
                  description: "Continuing with standard front/back review.",
                  icon: <AlertCircle className="h-4 w-4" />,
                });
                setRateLimitHit(true);
              }
            }
            console.error("AI generation failed, using fallback question.");
            questionText = currentCard.front;
          }
        }

        const options = shuffleArray([currentCard.back, ...incorrectOptions]);
        setCurrentQuestion({
          questionText,
          correctAnswer: currentCard.back,
          fullAnswerText: `${currentCard.back} - ${currentCard.front}`,
          options,
        });
        setIsGenerating(false);
      } else if (cards.length > 0 && currentCardIndex >= cards.length) {
        setIsSessionOver(true);
      }
    };
    generateQuestion();
  }, [currentCardIndex, cards, rateLimitHit]);

  // --- Event Handlers ---
  // functions called when the user interacts with the page.

  // called when a user clicks one of the answer buttons.
  const handleAnswerClick = (selectedAnswer) => {
    if (feedback) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    setIsFlipped(true);
  };

  // called when the user clicks the "Next Card" button.
  const handleNextCard = () => {
    setFeedback(null);
    setIsFlipped(false);
    setCurrentCardIndex(currentCardIndex + 1);
  };

  // called from the "Session Over" screen to restart the quiz.
  const handleRestart = () => {
    generatedIndexes.current.clear();
    setScore(0);
    setCurrentCardIndex(0);
    setIsSessionOver(false);
    setCards(shuffleArray([...cards]));
  };

  // --- Main Return Statement ---
  // contains a persistent layout with conditional rendering inside
  // to prevent the "white flash" issue between states.
  return (
    // persistent layout container with a white background.
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-background">
      {/* conditionally renders content based on the application's state. */}
      {loading ? (
        // displays a loader while fetching initial deck data.
        <Loader text="Loading review session..." className="text-foreground" />
      ) : error ? (
        // displays an error message if data fetching fails.
        <div className="text-center text-red-500">
          <p>Error: {JSON.stringify(error)}</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      ) : isSessionOver ? (
        // displays the final score screen when the review is complete.
        <div className="w-full max-w-md flex flex-col justify-between items-center text-center">
          <h1 className="text-3xl font-bold mb-4">Review Complete!</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your score: <span className="font-bold text-primary">{score}</span>{" "}
            out of {cards.length}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart}>Review Again</Button>
            <Button asChild variant="outline">
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      ) : isGenerating || !currentQuestion ? (
        // displays a loader while the AI is generating a question.
        <Loader text="Preparing your first card..." className="text-foreground" />
      ) : (
        // displays the main review session content.
        <div className="w-full max-w-2xl">
          {/* header section showing deck name and progress. */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{deck.name}</h1>
            <p className="text-muted-foreground">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
          {/* container for the flashcard and answer buttons. */}
          <div className="w-full max-w-md mx-auto">
            {/* the flippable flashcard component itself. */}
            <FlippableFlashcard
              isFlipped={isFlipped}
              questionContent={currentQuestion.questionText}
              answerContent={currentQuestion.fullAnswerText}
              feedback={feedback}
              animationKey={currentCardIndex}
            />
            {/* container for the multiple-choice answer buttons. */}
            <div className="flex flex-col gap-3 justify-center mt-8">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  size="lg"
                  className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                    feedback && option === currentQuestion.correctAnswer
                      ? "bg-green-600 hover:bg-green-700"
                      : feedback && option !== currentQuestion.correctAnswer
                      ? "bg-red-600 hover:bg-red-700 opacity-50"
                      : "bg-primary text-primary-foreground hover:bg-foreground"
                  }`}
                  disabled={!!feedback}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          {/* footer section with navigation buttons. */}
          <div className="flex justify-between items-center mt-8 max-w-md mx-auto">
            {/* button to end the review session. */}
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> End Review
              </Link>
            </Button>
            {/* button to move to the next card, appears after an answer is given. */}
            {feedback && (
              <Button onClick={handleNextCard} variant="ghost" size="sm">
                Next Card <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}