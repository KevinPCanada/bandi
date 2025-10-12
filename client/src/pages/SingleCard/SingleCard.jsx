import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Flashcard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [flashColor, setFlashColor] = useState("")

  // Question data with options
  const questionData = {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin"],
    correctAnswer: 1, // Index of correct answer (Paris)
  }

  const handleOptionClick = (optionIndex) => {
    const isCorrect = optionIndex === questionData.correctAnswer

    if (isCorrect) {
      setFlashColor("bg-green-500")
    } else {
      setFlashColor("bg-red-500")
    }

    setIsFlipped(!isFlipped)

    // Remove flash after animation
    setTimeout(() => {
      setFlashColor("")
    }, 300)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 transition-all duration-300 ${flashColor ? `${flashColor} opacity-20` : "bg-gray-50"}`}
    >
      <div className="w-full max-w-md">
        {/* Flashcard Container */}
        <div className="relative h-80 mb-8 perspective-1000">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 border-gray-200 flex items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Question</h2>
                  <p className="text-lg text-gray-600">{questionData.question}</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-blue-50 rounded-xl shadow-lg border-2 border-blue-200 flex items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Answer</h2>
                  <p className="text-lg text-blue-600">{questionData.options[questionData.correctAnswer]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Choice Options */}
        <div className="flex flex-col gap-3 justify-center">
          {questionData.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionClick(index)}
              size="lg"
              className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              {String.fromCharCode(65 + index)}. {option}
            </Button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsFlipped(false)} variant="outline" size="sm">
            Reset Card
          </Button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}