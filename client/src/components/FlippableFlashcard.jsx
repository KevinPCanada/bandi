import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FlippableFlashcard = ({
  isFlipped,
  questionContent,
  answerContent,
  feedback,
  animationKey,
  isAI, // Added prop to determine which header to show
}) => {
  return (
    <div className="relative min-h-[10rem] h-auto w-full [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        } grid grid-cols-1`}
      >
        {/* Front of Card (The Question) */}
        <div className="[grid-area:1/1] w-full h-full [backface-visibility:hidden] flex">
          <Card className="w-full min-h-full flex items-center justify-center bg-transparent border shadow-sm">
            <CardContent className="p-8 text-center flex flex-col items-center justify-center">
              {/* Contextual header based on isAI status */}
              <h2 className={`text-sm font-semibold mb-4 ${isAI ? "text-muted-foreground" : "text-amber-600"}`}>
                {isAI ? "FILL IN THE BLANK" : "AI LIMIT REACHED. SHOWING FRONT"}
              </h2>
              {/* Using animationKey to trigger re-animation on content change */}
              <p
                key={animationKey}
                className="text-xl md:text-2xl font-bold text-foreground animate-in fade-in slide-in-from-top-2 duration-800 leading-relaxed"
              >
                {questionContent}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back of Card (The Answer) */}
        <div className="[grid-area:1/1] w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex">
          <Card
            className={`w-full min-h-full flex items-center justify-center transition-colors duration-300 shadow-sm ${
              feedback === "correct"
                ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800"
                : feedback === "incorrect"
                ? "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800"
                : "bg-muted" 
            }`}
          >
            <CardContent className="p-8 text-center flex flex-col items-center justify-center">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                ANSWER
              </h2>
              <p className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                {answerContent}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlippableFlashcard;