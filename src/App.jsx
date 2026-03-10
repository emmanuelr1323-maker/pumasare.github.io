import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  { id: 42, president: "Bill Clinton", years: "1993–2001", notable: "Second Impeachment" },
  { id: 43, president: "George W. Bush", years: "2001–2009", notable: "9/11 / War on Terror" },
];

const GROUP_SIZE = 5;
const ROUND_CATEGORIES = ["President", "Number", "Years", "Notable"];
const DEFAULT_MESSAGE = "Select 4 cards that belong to the same president.";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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
  if (samePresident) return { type: "correct", presidentId: selection[0].presidentId };

  const sameCategory = selection.every((tile) => tile.category === selection[0].category);
  if (sameCategory) return { type: "same-category" };

  const byPresident = new Map();
  selection.forEach((tile) => {
    byPresident.set(tile.presidentId, (byPresident.get(tile.presidentId) || 0) + 1);
  });

  const maxFromOnePresident = Math.max(...byPresident.values());
  if (maxFromOnePresident === 3) return { type: "one-away" };

  return { type: "wrong" };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function panelClass(extra = "") {
  return `rounded-[2rem] bg-white shadow-lg ${extra}`;
}

function badgeClass() {
  return "rounded-xl bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700";
}

function buttonBase() {
  return "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition";
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`${buttonBase()} bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`${buttonBase()} bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`${buttonBase()} border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function SolvedGroupCard({ president }) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Solved
      </div>
      <div className="text-lg font-bold text-slate-900">{president.president}</div>
      <div className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 px-3 py-2"><span className="font-semibold">Number:</span> #{president.id}</div>
        <div className="rounded-2xl bg-white/80 px-3 py-2"><span className="font-semibold">Years:</span> {president.years}</div>
        <div className="rounded-2xl bg-white/80 px-3 py-2"><span className="font-semibold">Notable:</span> {president.notable}</div>
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
              <div className="rounded-xl bg-red-50 px-3 py-2"><span className="font-semibold">Number:</span> #{president.id}</div>
              <div className="rounded-xl bg-red-50 px-3 py-2"><span className="font-semibold">Years:</span> {president.years}</div>
              <div className="rounded-xl bg-red-50 px-3 py-2"><span className="font-semibold">Notable:</span> {president.notable}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PresidentsConnectionsGame() {
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

  useEffect(() => {
    const interval = window.setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!shakeBoard) return undefined;
    const timeout = window.setTimeout(() => setShakeBoard(false), 500);
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
      setSolvedPresidentIdsByRound((prev) => ({ ...prev, [roundIndex]: nextSolved }));
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

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-4 md:p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={panelClass()}>
            <div className="p-6 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Presidents Connections</h1>
                  <p className="mt-2 text-sm text-slate-600 md:text-base">
                    Tap 4 clickable cards that belong to the same president: name, president number, years, and notable event.
                  </p>
                </div>
                <OutlineButton onClick={restartGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> New Random Game
                </OutlineButton>
              </div>
            </div>
            <div className="space-y-4 p-6 pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className={badgeClass()}>Round {roundIndex + 1} / {rounds.length}</span>
                <span className={badgeClass()}>5 presidents in this set</span>
                <span className={badgeClass()}>Solved total: {totalSolved} / {PRESIDENTS.length}</span>
                <span className={badgeClass()}>Time: {formatTime(elapsedSeconds)}</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={panelClass()}>
            <div className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Round {roundIndex + 1}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">Find each president’s 4 matching cards</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Mistakes remaining</div>
                  <div className="mt-1 flex justify-end gap-1">
                    {[0, 1, 2, 3].map((dot) => (
                      <div key={dot} className={`h-3 w-3 rounded-full ${dot < 4 - mistakes ? "bg-slate-900" : "bg-slate-300"}`} />
                    ))}
                  </div>
                  <div className="mt-2 text-xs font-medium text-slate-500">{Math.max(0, 4 - mistakes)} left</div>
                </div>
              </div>

              <div className={messageClass}>{message}</div>

              <>
                {roundFailed && <FailedRoundAnswers round={unsolvedPresidents} />}

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ROUND_CATEGORIES.map((category) => (
                    <div key={category} className="rounded-2xl bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
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
                      <PrimaryButton onClick={submitSelection}>Submit</PrimaryButton>
                      <SecondaryButton onClick={clearSelection}>Deselect All</SecondaryButton>
                      <OutlineButton onClick={shuffleBoard}>Shuffle Cards</OutlineButton>
                    </>
                  ) : (
                    <PrimaryButton onClick={restartGame} className="bg-red-600 hover:bg-red-700">
                      <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </PrimaryButton>
                  )}
                </div>
              </>
            </div>
          </div>

          <div className={panelClass()}>
            <div className="flex h-full flex-col gap-5 p-6">
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
                <OutlineButton onClick={previousRound} disabled={roundIndex === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </OutlineButton>
                <SecondaryButton onClick={nextRound} disabled={isLastRound && !roundSolved}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>

        {allDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={panelClass("shadow-xl")}>
              <div className="space-y-4 p-6 text-center">
                <div className="text-3xl font-bold">You finished the full presidents game.</div>
                <div className="text-lg text-slate-600">Final solved count: <span className="font-semibold text-slate-900">{totalSolved} / {PRESIDENTS.length}</span></div>
                <div className="text-base text-slate-600">Final time: <span className="font-semibold text-slate-900">{formatTime(elapsedSeconds)}</span></div>
                <div className="flex justify-center">
                  <PrimaryButton onClick={restartGame}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Play Again
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
