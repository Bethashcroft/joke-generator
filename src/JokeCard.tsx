interface JokeCardProps {
  setup: string;
  punchline: string;
  isLoading: boolean;
  isRevealed: boolean;
  guessMode: boolean;
  guess: string;
}

function JokeCard({
  setup,
  punchline,
  isLoading,
  isRevealed,
  guessMode,
  guess,
}: JokeCardProps) {
  if (isLoading) {
    return (
      <div className="joke-card">
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (!setup) {
    return (
      <div className="joke-card">
        <p>Click the button to get a joke!</p>
      </div>
    );
  }

  return (
    <div className="joke-card">
      <p className="setup">{setup}</p>
      {isRevealed && guessMode && guess && (
        <p className="guess">Your guess: {guess}</p>
      )}
      {isRevealed && <p className="punchline">{punchline}</p>}
    </div>
  );
}
export default JokeCard;
