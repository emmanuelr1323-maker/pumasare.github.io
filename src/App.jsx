import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Trophy,
  AlertTriangle,
} from "lucide-react";

const PRESIDENTS = [
  { id: 1, president: "George Washington", years: "1789–1797", notable: "Farewell Address" },
  { id: 2, president: "John Adams", years: "1797–1801", notable: "Alien & Sedition Acts" },
  { id: 3, president: "Thomas Jefferson", years: "1801–1809", notable: "Louisiana Purchase" },
  { id: 4, president: "James Madison", years: "1809–1817", notable: "War of 1812" },
  { id: 5, president: "James Monroe", years: "1817–1825", notable: "Monroe Doctrine" },
  { id: 6, president: "John Quincy Adams", years: "1825–1829", notable: "Erie Canal" },
  { id: 7, president: "Andrew Jackson", years: "1829–1837", notable: "Indian Removal Act" },
  { id: 8, president: "Martin Van Buren", years: "1837–1841", notable: "Trail of Tears" },
  { id: 9, president: "William Henry Harrison", years: "1841", notable: "Died 31 days in office" },
  { id: 10, president: "John Tyler", years: "1841–1845", notable: "Annexed Texas" },
  { id: 11, president: "James K. Polk", years: "1845–1849", notable: "Oregon Trail / Mexican-American War" },
  { id: 12, president: "Zachary Taylor", years: "1849–1850", notable: "Died in office" },
  { id: 13, president: "Millard Fillmore", years: "1850–1853", notable: "Compromise of 1850" },
  { id: 14, president: "Franklin Pierce", years: "1853–1857", notable: "Kansas-Nebraska Act" },
  { id: 15, president: "James Buchanan", years: "1857–1861", notable: "Dred Scott Decision" },
  { id: 16, president: "Abraham Lincoln", years: "1861–1865", notable: "Emancipation Proclamation" },
  { id: 17, president: "Andrew Johnson", years: "1865–1869", notable: "First Impeachment" },
  { id: 18, president: "Ulysses S. Grant", years: "1869–1877", notable: "Reconstruction" },
  { id: 19, president: "Rutherford B. Hayes", years: "1877–1881", notable: "End of Reconstruction" },
  { id: 20, president: "James A. Garfield", years: "1881", notable: "Assassinated" },
  { id: 21, president: "Chester A. Arthur", years: "1881–1885", notable: "Pendleton Civil Service Act" },
  { id: 22, president: "Grover Cleveland", years: "1885–1889", notable: "Interstate Commerce Act" },
  { id: 23, president: "Benjamin Harrison", years: "1889–1893", notable: "Sherman Antitrust Act" },
  { id: 24, president: "Grover Cleveland", years: "1893–1897", notable: "Repealed Sherman Silver Act" },
  { id: 25, president: "William McKinley", years: "1897–1901", notable: "Spanish-American War" },
  { id: 26, president: "Theodore Roosevelt", years: "1901–1909", notable: "Panama Canal" },
  { id: 27, president: "William Howard Taft", years: "1909–1913", notable: "16th Amendment (Income Tax)" },
  { id: 28, president: "Woodrow Wilson", years: "1913–1921", notable: "League of Nations" },
  { id: 29, president: "Warren G. Harding", years: "1921–1923", notable: "Teapot Dome Scandal" },
  { id: 30, president: "Calvin Coolidge", years: "1923–1929", notable: "Roaring Twenties / Laissez-faire" },
  { id: 31, president: "Herbert Hoover", years: "1929–1933", notable: "Great Depression" },
  { id: 32, president: "Franklin D. Roosevelt", years: "1933–1945", notable: "New Deal" },
  { id: 33, president: "Harry S. Truman", years: "1945–1953", notable: "Atomic Bomb / NATO" },
  { id: 34, president: "Dwight D. Eisenhower", years: "1953–1961", notable: "Interstate Highway System" },
  { id: 35, president: "John F. Kennedy", years: "1961–1963", notable: "Cuban Missile Crisis" },
  { id: 36, president: "Lyndon B. Johnson", years: "1963–1969", notable: "Civil Rights Act" },
  { id: 37, president: "Richard Nixon", years: "1969–1974", notable: "Watergate / Resigned" },
  { id: 38, president: "Gerald Ford", years: "1974–1977", notable: "Pardoned Nixon" },
  { id: 39, president: "Jimmy Carter", years: "1977–1981", notable: "Camp David Accords" },
  { id: 40, president: "Ronald Reagan", years: "1981–1989", notable: "Reaganomics" },
  { id: 41, president: "George H.W. Bush", years: "1989–1993", notable: "Gulf War" },
  { id: 42, president: "Bill Clinton", years: "1993–2001", notable: "Impeachment / Economic Boom" },
  { id: 43, president: "George W. Bush", years: "2001–2009", notable: "9/11 / War on Terror" },
];

const GROUP_SIZE = 5;
const ROUND_CATEGORIES = ["President", "Number", "Years", "Notable"];
const DEFAULT_MESSAGE = "Select 4 cards that belong to the same president.";
const QUIZ_DEFAULT_MESSAGE = "Type the president number and years served, then choose the notable event.";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueValues(values) {
  return [...new Set(values)];
}

function pickOptions(values, correctValue, count = 4) {
  const wrongChoices = shuffle(
    uniqueValues(values).filter((value) => value !== correctValue)
  ).slice(0, count - 1);

  return shuffle([correctValue, ...wrongChoices]);
}

function buildQuizQuestions() {
  return shuffle(
    PRESIDENTS.map((item) => ({
      presidentId: item.id,
      president: item.president,
      correctNumber: `#${item.id}`,
      correctYears: item.years,
      correctNotable: item.notable,
      notableOptions: pickOptions(PRESIDENTS.map((p) => p.notable), item.notable),
    }))
  );
}

function buildRounds() {
  const randomized = shuffle(PRESIDENTS);
  const rounds = [];
  for (let i = 0; i < randomized.length; i += GROUP_SIZE) {
    rounds.push(randomized.slice(i, i + GROUP_SIZE));
  }
  return rounds;
}

function buildTiles(round) {
  const tiles = [];
  round.forEach((item) => {
    tiles.push({ tileId: `${item.id}-president`, presidentId: item.id, category: "President", label: item.president });
    tiles.push({ tileId: `${item.id}-number`, presidentId: item.id, category: "Number", label: `#${item.id}` });
    tiles.push({ tileId: `${item.id}-years`, presidentId: item.id, category: "Years", label: item.years });
    tiles.push({ tileId: `${item.id}-notable`, presidentId: item.id, category: "Notable", label: item.notable });
  });
  return shuffle(tiles);
}

function getGroupStatus(selection) {
  if (selection.length !== 4) return null;

  const samePresident = selection.every((tile) => tile.presidentId === selection[0].presidentId);
  if (samePresident) {
    return { type: "correct", presidentId: selection[0].presidentId };
  }

  const sameCategory = selection.every((tile) => tile.category === selection[0].category);
  if (sameCategory) {
    return { type: "same-category" };
  }

  const byPresident = new Map();
  selection.forEach((tile) => {
    byPresident.set(tile.presidentId, (byPresident.get(tile.presidentId) || 0) + 1);
  });

  const maxFromOnePresident = Math.max(...byPresident.values());
  if (maxFromOnePresident === 3) {
    return { type: "one-away" };
  }

  return { type: "wrong" };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function normalizeText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function SolvedGroupCard({ president }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Solved
      </div>
      <div className="text-lg font-bold text-slate-900">{president.president}</div>
      <div className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 px-3 py-2">
          <span className="font-semibold">Number:</span> #{president.id}
        </div>
        <div className="rounded-2xl bg-white/80 px-3 py-2">
          <span className="font-semibold">Years:</span> {president.years}
        </div>
        <div className="rounded-2xl bg-white/80 px-3 py-2">
          <span className="font-semibold">Notable:</span> {president.notable}
        </div>
      </div>
    </div>
  );
}

function FailedRoundAnswers({ round }) {
  return (
    <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
        <AlertTriangle className="h-4 w-4" /> Correct answers for this round
      </div>
      <div className="space-y-3">
        {round.map((president) => (
          <div key={president.id} className="rounded-2xl bg-white/80 p-3 text-sm">
            <div className="font-bold text-slate-900">{president.president}</div>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <div className="rounded-xl bg-red-50 px-3 py-2">
                <span className="font-semibold">Number:</span> #{president.id}
              </div>
              <div className="rounded-xl bg-red-50 px-3 py-2">
                <span className="font-semibold">Years:</span> {president.years}
              </div>
              <div className="rounded-xl bg-red-50 px-3 py-2">
                <span className="font-semibold">Notable:</span> {president.notable}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizInput({ label, value, onChange, disabled, correctValue, submitted, placeholder, isCorrect }) {
  const isWrong = submitted && value.trim() && !isCorrect;

  const wrapperClass = submitted
    ? isCorrect
      ? "rounded-3xl border border-emerald-200 bg-emerald-50 p-4"
      : "rounded-3xl border border-red-200 bg-red-50 p-4"
    : "rounded-3xl border border-slate-200 bg-slate-50 p-4";

  return (
    <div className={wrapperClass}>
      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500"
      />

      {submitted && (
        <div className="mt-3 text-sm">
          {isCorrect ? (
            <div className="font-semibold text-emerald-700">Correct</div>
          ) : isWrong ? (
            <div className="font-semibold text-red-700">
              Correct answer: <span className="text-slate-900">{correctValue}</span>
            </div>
          ) : (
            <div className="font-semibold text-red-700">
              Correct answer: <span className="text-slate-900">{correctValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizSelect({ label, value, options, onChange, disabled, correctValue, submitted }) {
  const isCorrect = submitted && value === correctValue;
  const isWrong = submitted && value && value !== correctValue;

  const wrapperClass = isCorrect
    ? "rounded-3xl border border-emerald-200 bg-emerald-50 p-4"
    : isWrong
      ? "rounded-3xl border border-red-200 bg-red-50 p-4"
      : "rounded-3xl border border-slate-200 bg-slate-50 p-4";

  return (
    <div className={wrapperClass}>
      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500"
      >
        <option value="">Select an answer</option>
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>

      {submitted && (
        <div className="mt-3 text-sm">
          {isCorrect ? (
            <div className="font-semibold text-emerald-700">Correct</div>
          ) : (
            <div className="font-semibold text-red-700">
              Correct answer: <span className="text-slate-900">{correctValue}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PresidentsConnectionsGame() {
  const [mode, setMode] = useState("connections");

  const [rounds, setRounds] = useState(() => buildRounds());
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedTileIds, setSelectedTileIds] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [solvedPresidentIdsByRound, setSolvedPresidentIdsByRound] = useState({});
  const [completedRounds, setCompletedRounds] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shakeBoard, setShakeBoard] = useState(false);
  const [roundFailed, setRoundFailed] = useState(false);
  const [roundShuffleSeed, setRoundShuffleSeed] = useState(0);

  const [quizQuestions, setQuizQuestions] = useState(() => buildQuizQuestions());
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    number: "",
    years: "",
    notable: "",
  });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizMessage, setQuizMessage] = useState(QUIZ_DEFAULT_MESSAGE);
  const [quizResult, setQuizResult] = useState({
    numberCorrect: false,
    yearsCorrect: false,
    notableCorrect: false,
  });

  const currentRound = rounds[roundIndex] || [];
  const solvedPresidentIds = solvedPresidentIdsByRound[roundIndex] || [];
  const solvedPresidents = currentRound.filter((p) => solvedPresidentIds.includes(p.id));
  const unsolvedPresidents = currentRound.filter((p) => !solvedPresidentIds.includes(p.id));

  const tiles = useMemo(() => buildTiles(currentRound), [currentRound, roundShuffleSeed]);
  const availableTiles = tiles.filter((tile) => !solvedPresidentIds.includes(tile.presidentId));
  const selectedTiles = availableTiles.filter((tile) => selectedTileIds.includes(tile.tileId));

  const isLastRound = roundIndex === rounds.length - 1;
  const roundSolved = currentRound.length > 0 && solvedPresidentIds.length === currentRound.length;
  const totalSolved = Object.values(solvedPresidentIdsByRound).reduce((sum, ids) => sum + ids.length, 0);
  const progress = (completedRounds.length / rounds.length) * 100;
  const allDone = completedRounds.length === rounds.length;

  const currentQuizQuestion = quizQuestions[quizIndex] || null;
  const quizComplete = quizIndex >= quizQuestions.length;
  const quizProgress = quizQuestions.length > 0 ? (quizIndex / quizQuestions.length) * 100 : 0;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!shakeBoard) return undefined;

    const timeout = window.setTimeout(() => {
      setShakeBoard(false);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [shakeBoard]);

  useEffect(() => {
    if (mistakes < 4) return;

    setRoundFailed(true);
    setSelectedTileIds([]);
    setShakeBoard(true);
    setMessage("Round failed — here are all the correct matches. Click Try Again for a new shuffle from the start.");
  }, [mistakes]);

  const restartGame = () => {
    setRounds(buildRounds());
    setRoundIndex(0);
    setSelectedTileIds([]);
    setMistakes(0);
    setMessage(DEFAULT_MESSAGE);
    setSolvedPresidentIdsByRound({});
    setCompletedRounds([]);
    setElapsedSeconds(0);
    setShakeBoard(false);
    setRoundFailed(false);
    setRoundShuffleSeed((prev) => prev + 1);
  };

  const resetRoundState = () => {
    setSelectedTileIds([]);
    setRoundFailed(false);
    setShakeBoard(false);
    setMessage(DEFAULT_MESSAGE);
    setRoundShuffleSeed((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setQuizQuestions(buildQuizQuestions());
    setQuizIndex(0);
    setQuizAnswers({
      number: "",
      years: "",
      notable: "",
    });
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizMessage(QUIZ_DEFAULT_MESSAGE);
    setQuizResult({
      numberCorrect: false,
      yearsCorrect: false,
      notableCorrect: false,
    });
  };

  const nextQuizQuestion = () => {
    if (!quizSubmitted) {
      setQuizMessage("Submit this question before moving on.");
      return;
    }

    setQuizIndex((prev) => prev + 1);
    setQuizAnswers({
      number: "",
      years: "",
      notable: "",
    });
    setQuizSubmitted(false);
    setQuizMessage(QUIZ_DEFAULT_MESSAGE);
    setQuizResult({
      numberCorrect: false,
      yearsCorrect: false,
      notableCorrect: false,
    });
  };

  const submitQuizAnswer = () => {
    if (!currentQuizQuestion) return;

    if (!quizAnswers.number.trim() || !quizAnswers.years.trim() || !quizAnswers.notable) {
      setQuizMessage("Fill in both typed answers and the dropdown first.");
      return;
    }

    if (quizSubmitted) return;

    const normalizedNumber = normalizeText(quizAnswers.number);
    const normalizedYears = normalizeText(quizAnswers.years);
    const normalizedCorrectNumber = normalizeText(currentQuizQuestion.correctNumber);
    const normalizedCorrectNumberNoHash = normalizeText(currentQuizQuestion.correctNumber.replace("#", ""));
    const normalizedCorrectYears = normalizeText(currentQuizQuestion.correctYears);

    const numberCorrect =
      normalizedNumber === normalizedCorrectNumber ||
      normalizedNumber === normalizedCorrectNumberNoHash;

    const yearsCorrect = normalizedYears === normalizedCorrectYears;
    const notableCorrect = quizAnswers.notable === currentQuizQuestion.correctNotable;

    const correctCount =
      (numberCorrect ? 1 : 0) +
      (yearsCorrect ? 1 : 0) +
      (notableCorrect ? 1 : 0);

    const allCorrect = correctCount === 3;

    setQuizResult({
      numberCorrect,
      yearsCorrect,
      notableCorrect,
    });

    if (allCorrect) {
      setQuizScore((prev) => prev + 1);
      setQuizMessage(`Correct — ${currentQuizQuestion.president} matched perfectly.`);
    } else {
      setQuizMessage(
        `${correctCount}/3 correct. ${currentQuizQuestion.president} was president ${currentQuizQuestion.correctNumber}, served ${currentQuizQuestion.correctYears}, and is associated with ${currentQuizQuestion.correctNotable}.`
      );
    }

    setQuizSubmitted(true);
  };

  const toggleTile = (tileId) => {
    if (roundSolved || roundFailed) return;

    setMessage(DEFAULT_MESSAGE);
    setSelectedTileIds((prev) => {
      if (prev.includes(tileId)) return prev.filter((id) => id !== tileId);
      if (prev.length >= 4) return prev;
      return [...prev, tileId];
    });
  };

  const clearSelection = () => {
    if (roundFailed) return;
    setSelectedTileIds([]);
    setMessage("Selection cleared.");
  };

  const shuffleBoard = () => {
    if (roundFailed) return;
    setSelectedTileIds([]);
    setRoundShuffleSeed((prev) => prev + 1);
    setMessage("Board reshuffled.");
  };

  const submitSelection = () => {
    if (roundFailed) {
      setMessage("This round is over. Click Try Again to restart with a new shuffle.");
      return;
    }

    if (selectedTiles.length !== 4) {
      setMessage("Pick exactly 4 cards first.");
      return;
    }

    const status = getGroupStatus(selectedTiles);

    if (status?.type === "correct") {
      const president = currentRound.find((p) => p.id === status.presidentId);
      const nextSolved = [...solvedPresidentIds, status.presidentId];

      setSolvedPresidentIdsByRound((prev) => ({
        ...prev,
        [roundIndex]: nextSolved,
      }));
      setSelectedTileIds([]);
      setMessage(`Correct: ${president?.president ?? "President"} matched.`);

      if (nextSolved.length === currentRound.length && !completedRounds.includes(roundIndex)) {
        setCompletedRounds((prev) => [...prev, roundIndex]);
      }
      return;
    }

    setMistakes((prev) => prev + 1);
    setShakeBoard(true);

    if (status?.type === "one-away") {
      setMessage("One away — 3 of those cards belong together.");
      return;
    }

    if (status?.type === "same-category") {
      setMessage("Those are all the same type of clue, not the same president.");
      return;
    }

    setMessage("Not a match. Try another set of 4.");
  };

  const nextRound = () => {
    if (roundFailed) {
      setMessage("This round is over. Click Try Again to restart with a new shuffle.");
      return;
    }

    if (!roundSolved) {
      setMessage("Finish this set before moving on.");
      return;
    }

    setRoundIndex((prev) => Math.min(prev + 1, rounds.length - 1));
    resetRoundState();
  };

  const previousRound = () => {
    if (roundFailed) {
      setMessage("This round is over. Click Try Again to restart with a new shuffle.");
      return;
    }

    setRoundIndex((prev) => Math.max(prev - 1, 0));
    resetRoundState();
  };

  const messageClass = roundFailed || shakeBoard
    ? "mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
    : "mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700";

  const quizMessageClass = quizSubmitted
    ? quizMessage.includes("Correct —")
      ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
      : "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
    : "rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl md:text-3xl">Presidents Study Game</CardTitle>
                  <p className="mt-2 text-sm text-slate-600 md:text-base">
                    {mode === "connections"
                      ? "Play the matching game or switch to quiz mode."
                      : "Quiz mode: type the president number and years served, then choose the notable event."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setMode("connections")}
                    variant={mode === "connections" ? "default" : "outline"}
                    className="rounded-2xl"
                  >
                    Connections
                  </Button>
                  <Button
                    onClick={() => setMode("quiz")}
                    variant={mode === "quiz" ? "default" : "outline"}
                    className="rounded-2xl"
                  >
                    Quiz
                  </Button>
                  {mode === "connections" ? (
                    <Button onClick={restartGame} variant="outline" className="rounded-2xl">
                      <RefreshCw className="mr-2 h-4 w-4" /> New Random Game
                    </Button>
                  ) : (
                    <Button onClick={restartQuiz} variant="outline" className="rounded-2xl">
                      <RefreshCw className="mr-2 h-4 w-4" /> New Quiz
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {mode === "connections" ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-xl px-3 py-1 text-sm">Round {roundIndex + 1} / {rounds.length}</Badge>
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 text-sm">5 presidents in this set</Badge>
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 text-sm">Solved total: {totalSolved} / {PRESIDENTS.length}</Badge>
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 text-sm">Time: {formatTime(elapsedSeconds)}</Badge>
                  </div>
                  <Progress value={progress} className="h-3" />
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-xl px-3 py-1 text-sm">
                      Question {Math.min(quizIndex + 1, quizQuestions.length)} / {quizQuestions.length}
                    </Badge>
                    <Badge variant="secondary" className="rounded-xl px-3 py-1 text-sm">
                      Perfect answers: {quizScore}
                    </Badge>
                  </div>
                  <Progress value={quizProgress} className="h-3" />
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {mode === "connections" ? (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Round {roundIndex + 1}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        Find each president’s 4 matching cards
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Mistakes remaining</div>
                      <div className="mt-1 flex justify-end gap-1">
                        {[0, 1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className={`h-3 w-3 rounded-full ${dot < 4 - mistakes ? "bg-slate-900" : "bg-slate-300"}`}
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        {Math.max(0, 4 - mistakes)} left
                      </div>
                    </div>
                  </div>

                  <div className={messageClass}>{message}</div>

                  <>
                    {roundFailed && <FailedRoundAnswers round={unsolvedPresidents} />}

                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {ROUND_CATEGORIES.map((category) => (
                        <div
                          key={category}
                          className="rounded-2xl bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
                        >
                          {category}
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {solvedPresidents.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3">
                          {solvedPresidents.map((president) => (
                            <SolvedGroupCard key={president.id} president={president} />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={shakeBoard ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                      transition={{ duration: 0.45 }}
                      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                    >
                      {availableTiles.map((tile) => {
                        const selected = selectedTileIds.includes(tile.tileId);
                        const tileClass = selected
                          ? roundFailed || shakeBoard
                            ? "scale-[0.98] border-red-600 bg-red-600 text-white shadow-lg"
                            : "scale-[0.98] border-slate-900 bg-slate-900 text-white shadow-lg"
                          : roundFailed
                            ? "border-red-200 bg-red-50 text-slate-900"
                            : "border-slate-200 bg-[#efede8] text-slate-900 hover:-translate-y-0.5 hover:shadow-md";

                        return (
                          <button
                            key={tile.tileId}
                            type="button"
                            onClick={() => toggleTile(tile.tileId)}
                            className={`min-h-[92px] rounded-3xl border px-3 py-4 text-center text-sm font-bold uppercase leading-tight transition-all md:min-h-[104px] ${tileClass}`}
                          >
                            <div className="line-clamp-4 break-words">{tile.label}</div>
                          </button>
                        );
                      })}
                    </motion.div>

                    {availableTiles.length === 0 && (
                      <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                        Round complete. Hit Next to move to the next 5 presidents.
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {!roundFailed ? (
                        <>
                          <Button onClick={submitSelection} className="rounded-2xl">Submit</Button>
                          <Button onClick={clearSelection} variant="secondary" className="rounded-2xl">Deselect All</Button>
                          <Button onClick={shuffleBoard} variant="outline" className="rounded-2xl">Shuffle Cards</Button>
                        </>
                      ) : (
                        <Button onClick={restartGame} className="rounded-2xl bg-red-600 hover:bg-red-700">
                          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                      )}
                    </div>
                  </>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8" />
                    <div>
                      <div className="text-sm text-slate-500">Presidents solved</div>
                      <div className="text-3xl font-bold">{totalSolved} / {PRESIDENTS.length}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    In each round, every president has 4 cards:
                    <div className="mt-2 space-y-1">
                      <div>• Name</div>
                      <div>• President number</div>
                      <div>• Years in office</div>
                      <div>• Notable event or action</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    Remaining in this round: <span className="font-semibold">{unsolvedPresidents.length}</span>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    Timer: <span className="font-semibold">{formatTime(elapsedSeconds)}</span>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
                    <Button onClick={previousRound} variant="outline" className="rounded-2xl" disabled={roundIndex === 0}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextRound} variant="secondary" className="rounded-2xl" disabled={isLastRound && !roundSolved}>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {allDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="rounded-[2rem] border-0 bg-white shadow-xl">
                  <CardContent className="space-y-4 p-6 text-center">
                    <div className="text-3xl font-bold">You finished the full presidents game.</div>
                    <div className="text-lg text-slate-600">
                      Final solved count: <span className="font-semibold text-slate-900">{totalSolved} / {PRESIDENTS.length}</span>
                    </div>
                    <div className="text-base text-slate-600">
                      Final time: <span className="font-semibold text-slate-900">{formatTime(elapsedSeconds)}</span>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={restartGame} className="rounded-2xl">
                        <RefreshCw className="mr-2 h-4 w-4" /> Play Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {!quizComplete ? (
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Quiz Mode
                      </div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        {currentQuizQuestion?.president}
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Type the president number and years served. Choose the notable event from the dropdown.
                      </p>
                    </div>

                    <div className={quizMessageClass}>{quizMessage}</div>

                    <div className="rounded-3xl bg-slate-50 p-5 text-slate-800">
                      <div className="text-lg font-semibold">
                        {currentQuizQuestion?.president}
                      </div>

                      <div className="mt-4 grid gap-4">
                        <QuizInput
                          label="President number"
                          value={quizAnswers.number}
                          onChange={(value) =>
                            setQuizAnswers((prev) => ({ ...prev, number: value }))
                          }
                          disabled={quizSubmitted}
                          correctValue={currentQuizQuestion?.correctNumber || ""}
                          submitted={quizSubmitted}
                          placeholder="Type like #16 or 16"
                          isCorrect={quizResult.numberCorrect}
                        />

                        <QuizInput
                          label="Years served"
                          value={quizAnswers.years}
                          onChange={(value) =>
                            setQuizAnswers((prev) => ({ ...prev, years: value }))
                          }
                          disabled={quizSubmitted}
                          correctValue={currentQuizQuestion?.correctYears || ""}
                          submitted={quizSubmitted}
                          placeholder="Type the years served"
                          isCorrect={quizResult.yearsCorrect}
                        />

                        <QuizSelect
                          label="Notable event"
                          value={quizAnswers.notable}
                          options={currentQuizQuestion?.notableOptions || []}
                          onChange={(value) =>
                            setQuizAnswers((prev) => ({ ...prev, notable: value }))
                          }
                          disabled={quizSubmitted}
                          correctValue={currentQuizQuestion?.correctNotable || ""}
                          submitted={quizSubmitted}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={submitQuizAnswer} className="rounded-2xl">
                        Submit Answer
                      </Button>
                      <Button
                        onClick={nextQuizQuestion}
                        variant="secondary"
                        className="rounded-2xl"
                      >
                        Next Question <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-8 w-8" />
                      <div>
                        <div className="text-sm text-slate-500">Perfect quiz answers</div>
                        <div className="text-3xl font-bold">{quizScore} / {quizQuestions.length}</div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      Each question asks you to:
                      <div className="mt-2 space-y-1">
                        <div>• Type the president number</div>
                        <div>• Type the years served</div>
                        <div>• Choose the notable event</div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      Current question: <span className="font-semibold">{quizIndex + 1}</span>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      Remaining questions: <span className="font-semibold">{quizQuestions.length - quizIndex - 1}</span>
                    </div>

                    <div className="mt-auto">
                      <Button onClick={restartQuiz} variant="outline" className="rounded-2xl w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> Restart Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="rounded-[2rem] border-0 bg-white shadow-xl">
                  <CardContent className="space-y-4 p-6 text-center">
                    <div className="text-3xl font-bold">You finished the quiz.</div>
                    <div className="text-lg text-slate-600">
                      Perfect answers: <span className="font-semibold text-slate-900">{quizScore} / {quizQuestions.length}</span>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={restartQuiz} className="rounded-2xl">
                        <RefreshCw className="mr-2 h-4 w-4" /> Play Quiz Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}