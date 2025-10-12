import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FlippableFlashcard = ({
  isFlipped,
  questionContent,
  answerContent,
  feedback,
  animationKey,
}) => {
  return (
    <div className="relative h-80 w-full [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of Card (The Question) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
          <Card className="w-full h-full flex items-center justify-center bg-transparent border">
            <CardContent className="p-6 text-center">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                DEFINITION
              </h2>
              {/* Using animationKey to trigger re-animation on content change */}
              <p
                key={animationKey}
                className="text-2xl font-bold text-foreground animate-in fade-in slide-in-from-top-2 duration-800"
              >
                {questionContent}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back of Card (The Answer) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card
            className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
              feedback === "correct"
                ? "bg-green-100 border-green-300"
                : feedback === "incorrect"
                ? "bg-red-100 border-red-300"
                : "bg-muted" // Default color
            }`}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                ANSWER
              </h2>
              <p className="text-2xl font-bold text-foreground">
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
