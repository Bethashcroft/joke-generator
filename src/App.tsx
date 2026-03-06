import { useState } from "react";
import JokeCard from "./JokeCard";
import "./App.css";

const categories = ["random", "general", "programming"];

interface Joke {
  setup: string;
  punchline: string;
}

function App() {
  const [joke, setJoke] = useState<Joke>({ setup: "", punchline: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [guessMode, setGuessMode] = useState(false);
  const [guess, setGuess] = useState("");
  const [category, setCategory] = useState("random");
  const [history, setHistory] = useState<Joke[]>([]);
  const [error, setError] = useState("");

  async function handleGetJoke() {
    setIsLoading(true);
    setIsRevealed(false);
    setGuess("");
    setError("");

    try {
      const url =
        category === "random"
          ? "https://official-joke-api.appspot.com/random_joke"
          : `https://official-joke-api.appspot.com/jokes/${category}/random`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data =
        category === "random"
          ? await response.json()
          : (await response.json())[0];

      const newJoke = { setup: data.setup, punchline: data.punchline };

      if (joke.setup) {
        setHistory((prev) => [joke, ...prev]);
      }

      setJoke(newJoke);
    } catch {
      setError("Failed to fetch a joke. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReveal() {
    setIsRevealed(true);
  }

  const hasJoke = joke.setup !== "";

  return (
    <div className="app">
      <h1>Joke Generator</h1>
      <p className="subtitle">Powered by React and bad humour</p>

      <div className="controls">
        <label className="mode-toggle">
          <input
            type="checkbox"
            checked={guessMode}
            onChange={(e) => setGuessMode(e.target.checked)}
          />
          Guess Mode
        </label>
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <JokeCard
        setup={joke.setup}
        punchline={joke.punchline}
        isLoading={isLoading}
        isRevealed={isRevealed}
        guessMode={guessMode}
        guess={guess}
      />

      {guessMode && hasJoke && !isRevealed && !isLoading && (
        <input
          className="guess-input"
          type="text"
          placeholder="What do you think the punchline is?"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleReveal();
          }}
        />
      )}

      <div className="buttons">
        {hasJoke && !isRevealed && !isLoading && (
          <button className="reveal-btn" onClick={handleReveal}>
            Reveal Punchline
          </button>
        )}
        <button
          className="get-joke-btn"
          onClick={handleGetJoke}
          disabled={isLoading}
        >
          {hasJoke ? "Next Joke" : "Get Joke"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="history">
          <h2>Previous Jokes</h2>
          {history.map((pastJoke, index) => (
            <div key={index} className="history-item">
              <p className="setup">{pastJoke.setup}</p>
              <p className="punchline">{pastJoke.punchline}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
