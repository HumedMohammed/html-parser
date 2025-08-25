import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Gamepad2,
  Trophy,
  Zap,
  Heart,
  Coffee,
  Rocket,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SillyLoginInterceptorProps {
  onClose: () => void;
  visitCount: number;
}

const jokes = [
  {
    title: "Hey there, frequent visitor! 👋",
    message:
      "I see you're back again... Are you perhaps lost? Or just admiring our beautiful login page? 😄",
    emoji: "🤔",
  },
  {
    title: "Welcome back, again! 🎭",
    message:
      "At this point, we should probably be friends on social media. But first... maybe try logging in? 😉",
    emoji: "😅",
  },
  {
    title: "Oh, it's you again! 🕵️",
    message:
      "Are you testing our page load speed? Because it's pretty fast, right? RIGHT?! 🚀",
    emoji: "🤪",
  },
  {
    title: "Déjà vu much? 🔄",
    message:
      "I'm starting to think you're either a bot or you REALLY love our color scheme! 🎨",
    emoji: "🤖",
  },
];

const MiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);
  const [timeLeft, setTimeLeft] = useState(10);

  const emojis = ["🎯", "⭐", "💎", "🍕", "🎮", "🚀", "🎪", "🎭"];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score >= 5) {
        onWin();
      }
    }
  }, [gameActive, timeLeft, score, onWin]);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80,
          y: Math.random() * 60,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
        setTargets((prev) => [...prev, newTarget]);

        setTimeout(() => {
          setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
        }, 2000);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setTargets([]);
    setGameActive(true);
  };

  const hitTarget = (targetId: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    setScore((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          🎮 Quick Reflexes Game
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Click the targets as they appear! Get 5+ points to unlock a special
          surprise! 🎁
        </p>

        <div className="flex justify-center space-x-4 mb-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Trophy className="w-4 h-4 mr-1" />
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Zap className="w-4 h-4 mr-1" />
            Time: {timeLeft}s
          </Badge>
        </div>
      </div>

      {!gameActive && timeLeft === 10 ? (
        <Button
          onClick={startGame}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          Start Game!
        </Button>
      ) : gameActive ? (
        <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg h-64 overflow-hidden border-2 border-dashed border-purple-300 dark:border-purple-600">
          <AnimatePresence>
            {targets.map((target) => (
              <motion.button
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => hitTarget(target.id)}
                className="absolute w-12 h-12 text-2xl bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {target.emoji}
              </motion.button>
            ))}
          </AnimatePresence>

          {targets.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl"
          >
            {score >= 5 ? "🎉" : "😅"}
          </motion.div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              {score >= 5 ? "Amazing! You did it! 🏆" : "Good try! 💪"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {score >= 5
                ? `You scored ${score} points! You're clearly awesome enough to use our app! 😎`
                : `You scored ${score} points. Not bad, but maybe try logging in instead? 😉`}
            </p>
          </div>
          <Button onClick={startGame} variant="outline" className="mr-2">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export const SillyLoginInterceptor: React.FC<SillyLoginInterceptorProps> = ({
  onClose,
  visitCount,
}) => {
  const [showGame, setShowGame] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const currentJoke = jokes[Math.min(visitCount - 2, jokes.length - 1)];

  const handleGameWin = () => {
    setGameWon(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-200 dark:border-yellow-700 shadow-2xl">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>

            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl mb-2"
            >
              {currentJoke.emoji}
            </motion.div>

            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {currentJoke.title}
            </CardTitle>

            <Badge variant="secondary" className="w-fit mx-auto mt-2">
              <Coffee className="w-3 h-3 mr-1" />
              Visit #{visitCount}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              {currentJoke.message}
            </motion.p>

            {!showGame && !gameWon && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Since you're here anyway, want to play a quick game? 🎮
                </p>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowGame(true)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Sure, why not!
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Just let me login
                  </Button>
                </div>
              </motion.div>
            )}

            {showGame && !gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MiniGame onWin={handleGameWin} />
              </motion.div>
            )}

            {gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1 }}
                  className="text-6xl"
                >
                  👑
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    You're Officially Awesome! 🎉
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    You've proven your worth! Here's a special treat:
                    <strong className="text-purple-600 dark:text-purple-400">
                      {" "}
                      20% off your first month!
                    </strong>
                  </p>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                    <Crown className="w-3 h-3 mr-1" />
                    Code: GAMEMASTER20
                  </Badge>
                </div>
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Awesome! Let me login now
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
