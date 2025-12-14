// 10V3 — "final page" everything I can see now except no sound when new scenario, 
import { useState } from "react";
import scenariosData from "./data/scenarios.json";
import cardsData from "./data/cards.json";
import FinishedScreen from "./FinishedScreen.jsx";
import ScenarioBox from "./ScenarioBox.jsx";

import { buildDeckFromScenarios } from "./utils/deck.js";               // M1
import AnswerButtons from "./components/AnswerButtons.jsx";             // M2
import StatsRow from "./components/StatsRow.jsx";                       // M3
import ProgressBar from "./components/ProgressBar.jsx";                 // M4

function App()
{
  const scenarios =
    scenariosData && Array.isArray(scenariosData.scenarios)
      ? scenariosData.scenarios
      : [];

  const [deck] = useState(
    function ()
    {
      if (scenarios.length === 0)
      {
        return [];
      }

      return buildDeckFromScenarios(scenarios);
    }
  );

  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  // Glows
  const [scenarioGlow, setScenarioGlow] = useState(false); // blue scenario box glow
  const [imageGlow, setImageGlow] = useState(null);        // "correct" | "incorrect" | null

  // 9K1 sounds (click-based only)
  const correctAudio = new Audio("/sounds/correct.mp3");
  const incorrectAudio = new Audio("/sounds/incorrect.mp3");

  // Landing page state
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState("light");            // "light" | "dark"
  const [targetCards, setTargetCards] = useState("full"); // "full" | "10" | "20" (not used yet)

  // Answer tracking
  const [answers, setAnswers] = useState([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 480;

  if (!deck || deck.length === 0)
  {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h1>Physics Game</h1>
        <p>No cards found. Check JSON files or engine logic.</p>
      </div>
    );
  }

  const totalCards = deck.length;

  // Modes
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "student";

  const studentMode = (mode === "student");
  const strikesEnabled = (mode === "student");
  const showDebugUI = (mode === "programmer");

  function playAudio(audio)
  {
    try
    {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function")
      {
        p.catch(function () {});
      }
    }
    catch (e)
    {
      // ignore
    }
  }

  function triggerScenarioGlow()
  {
    setScenarioGlow(true);

    setTimeout(
      function ()
      {
        setScenarioGlow(false);
      },
      700
    );
  }

  function triggerImageGlow(type)
  {
    setImageGlow(type);

    setTimeout(
      function ()
      {
        setImageGlow(null);
      },
      700
    );
  }

  // ---------------- Landing Page ----------------
 if (!started)
{
  const pageStyle =
  {
    minHeight: "100vh",
    backgroundColor: theme === "dark" ? "#111111" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#111111",
    padding: 20,
    fontFamily: "sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const cardBackStyle =
  {
    width: "min(440px, 76vw)", //width of the Fizz card 92-> 76
    minHeight: 620,
    borderRadius: 28,
    backgroundImage: 'url("/assets/Fizz.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: 26,
    display: "flex",
    alignItems: "flex-end", //change from "center"
    justifyContent: "center"
  };

  const overlayStyle =
  {
    width: "86%",
    borderRadius: 12,
    padding: 16,
    // ⭐ more see-through so the Fizz logo shows
    backgroundColor: theme === "dark"
      ? "rgba(0,0,0,0.35)"
      : "rgba(255,255,255,0.55)",

    // ⭐ optional but makes text readable without hiding the logo
    backdropFilter: "blur(6px)",
    color: theme === "dark" ? "#ffffff" : "#111111",
    marginBottom: 34
  };

  const rowStyle =
  {
    display: "flex",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap"
  };

  const selectButtonBase =
  {
    flex: "1 1 120px",
    padding: "10px 0",
    borderRadius: 10,
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.25)" : "1px solid #cccccc",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: theme === "dark" ? "#ffffff" : "#000000",
  };

  // still the landing screen
  // in the return statement is jsx - looks like html but isn't
  // comments syntax {/* */}  //can be used as block comments
  // {} is where real JavaScript lives!!!! See <botton ... after many lines >
  return (
    <div style={pageStyle}>
      <div style={cardBackStyle}>
        <div style={overlayStyle}>

          <p style={{ marginTop: 10, marginBottom: 10, fontSize: 14 }}>
            <strong>Rule: Level ends after 3 mistakes. </strong> Choose settings, then press start.
          </p>

          {/* --------- 5 buttons: light, dark, 10, 20 42-----------*/}
          <p style={{ marginBottom: 6, fontSize: 14 }}>
            <strong>Theme</strong>
          </p>

          {/* 2 buttons: light and dark */}
          <div style={rowStyle}>

            <button
              onClick={function () { setTheme("light"); }}
              style={{
                ...selectButtonBase,

                // identity look
                backgroundColor: "#f2f2f2",
                color: "#000000",

                // ⭐ stable highlight system (no blinking)
                border: theme === "light" ? "2px solid #4caf50" : "2px solid transparent",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: theme === "light" ? "0 0 0 2px rgba(76,175,80,0.25)" : "none"
              }}
            >
              Light
            </button>

            <button
              onClick={function () { setTheme("dark"); }}
              style={{
                ...selectButtonBase,

                // identity look
                backgroundColor: "#333333",
                color: "#ffffff",

                // ⭐ stable highlight system (no blinking)
                border: theme === "dark" ? "2px solid #4caf50" : "2px solid transparent",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: theme === "dark" ? "0 0 0 2px rgba(76,175,80,0.25)" : "none"
              }}
            >
              Dark
            </button>

          </div>

          <p style={{ marginBottom: 6, fontSize: 14 }}>
            <strong>Level length</strong>
          </p>

          {/* 3 buttons: 10, 20, full */}
          <div style={rowStyle}>

            <button
              onClick={function () { setTargetCards("10"); }}
              style={{
                ...selectButtonBase,

                backgroundColor: targetCards === "10"
                  ? (theme === "dark" ? "#444444" : "#dddddd")
                  : (theme === "dark" ? "#2a2a2a" : "#eeeeee"),

                // ⭐ same highlight system as Theme
                border: targetCards === "10" ? "2px solid #4caf50" : "2px solid transparent",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: targetCards === "10" ? "0 0 0 2px rgba(76,175,80,0.25)" : "none"
              }}
            >
              10
            </button>

            <button
              onClick={function () { setTargetCards("20"); }}
              style={{
                ...selectButtonBase,

                backgroundColor: targetCards === "20"
                  ? (theme === "dark" ? "#444444" : "#dddddd")
                  : (theme === "dark" ? "#2a2a2a" : "#eeeeee"),

                // ⭐ same highlight system as Theme
                border: targetCards === "20" ? "2px solid #4caf50" : "2px solid transparent",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: targetCards === "20" ? "0 0 0 2px rgba(76,175,80,0.25)" : "none"
              }}
            >
              20
            </button>

            <button
              onClick={function () { setTargetCards("full"); }}
              style={{
                ...selectButtonBase,

                backgroundColor: targetCards === "full"
                  ? (theme === "dark" ? "#444444" : "#dddddd")
                  : (theme === "dark" ? "#2a2a2a" : "#eeeeee"),

                // ⭐ same highlight system as Theme
                border: targetCards === "full" ? "2px solid #4caf50" : "2px solid transparent",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: targetCards === "full" ? "0 0 0 2px rgba(76,175,80,0.25)" : "none"
              }}
            >
              Full (42)
            </button>

          </div>

          {/* -----------end 5 buttons--------------- */} 

          {/* start button */} 
          <button
            onClick={function () { setStarted(true); }}
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: 18,
              fontWeight: "bold",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#4caf50",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            Start
          </button> {/* end start button */} 
        </div> 
      </div> 
    </div> 
  );
}

  // ---------------- Finished Screen ----------------
  if (finished)
  {
    return (
      <FinishedScreen
        totalCards={totalCards}
        answers={answers}
        score={score}
        strikes={strikes}
        scenarios={scenarios}
        cards={cardsData.cards}
        theme={theme}
      />
    );
  }

  // ---------------- Game Screen ----------------
  const currentEntry = deck[cardIndex];

  if (!currentEntry)
  {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h1>Error: Invalid card index {cardIndex}</h1>
      </div>
    );
  }

  const card = cardsData.cards.find(
    function (c)
    {
      return c.id === currentEntry.cardId;
    }
  );

  if (!card)
  {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h1>Error: Missing card asset</h1>
      </div>
    );
  }

  const isFirstCardOfScenario =
    cardIndex === 0 ||
    deck[cardIndex - 1].scenarioId !== currentEntry.scenarioId;

  // Trigger blue glow once when scenario changes
  if (isFirstCardOfScenario && !scenarioGlow && cardIndex !== 0)
  {
    triggerScenarioGlow();
  }

  const containerStyle =
  {
    maxWidth: isMobile ? "95vw" : 800,
    width: "100%",
    margin: "0 auto",
    padding: isMobile ? 12 : 20,
    fontFamily: "sans-serif",
    backgroundColor: theme === "dark" ? "#111111" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#111111",
    minHeight: "100vh"
  };

  function handleAnswer(answerIsYes)
  {
    if (finished)
    {
      return;
    }

    const playerThinksCardIsCorrect = answerIsYes;
    const cardIsActuallyCorrect = currentEntry.isCorrect;
    const gotItRight = (playerThinksCardIsCorrect === cardIsActuallyCorrect);

    let newStrikes = strikes;

    if (gotItRight)
    {
      setScore(score + 1);
      setFeedback("You've answered correctly! ✅");
      triggerImageGlow("correct");
      playAudio(correctAudio);
    }
    else
    {
      newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setFeedback("That's not correct. ❌");
      triggerImageGlow("incorrect");
      playAudio(incorrectAudio);
    }

    setAnswers(
      function (prev)
      {
        return [
          ...prev,
          {
            cardIndex,
            scenarioId: currentEntry.scenarioId,
            cardId: currentEntry.cardId,
            playerAnswerIsYes: playerThinksCardIsCorrect,
            correctTruth: cardIsActuallyCorrect,
            gotItRight: gotItRight
          }
        ];
      }
    );

    const nextIndex = cardIndex + 1;
    const outOfCards = (nextIndex >= totalCards);
    const outOfStrikes = strikesEnabled && (newStrikes >= 3);

    if (outOfCards || outOfStrikes)
    {
      setFinished(true);
    }
    else
    {
      setCardIndex(nextIndex);
    }
  }

  function goPrev()
  {
    if (cardIndex > 0 && !finished)
    {
      setCardIndex(cardIndex - 1);
      setFeedback("");
    }
  }

  function goNext()
  {
    if (cardIndex < totalCards - 1 && !finished)
    {
      setCardIndex(cardIndex + 1);
      setFeedback("");
    }
  }

  //Image → ScenarioBox → Question → Buttons
  return (
    <div style={containerStyle}>
      <h1
        style={{
          fontSize: isMobile ? "1.8rem" : "2.4rem",
          marginBottom: isMobile ? 8 : 16,
          textAlign: "center"
        }}
      >
        Fizz
      </h1>

    
      {!studentMode && (
        <p
          style={{
            fontSize: "0.9rem",
            marginTop: 0,
            marginBottom: isMobile ? 4 : 8,
            color: theme === "dark" ? "#cccccc" : "#555555"
          }}
        >
          Mode: {mode}
        </p>
      )}

      {!studentMode && (
        <p style={{ marginTop: 0, marginBottom: isMobile ? 6 : 10 }}>
          This level has {totalCards} cards. You may make up to 3 mistakes before the level ends.
        </p>
      )}

      <ProgressBar
        current={cardIndex + 1}
        total={totalCards}
        isMobile={isMobile}
      />

      {!studentMode && (
        <h3 style={{ marginTop: 0, marginBottom: isMobile ? 6 : 10 }}>
          Card {cardIndex + 1} of {totalCards}
        </h3>
      )}

      {showDebugUI && (
        <p style={{ marginTop: 0, marginBottom: isMobile ? 6 : 10 }}>
          Slot: {currentEntry.slotId} ({currentEntry.category})
        </p>
      )}

      <div
        style={{
          overflow: "hidden",
          maxWidth: isMobile ? "95%" : 400,
          maxHeight: isMobile ? 420 : 460,
          margin: "0 auto",

          // ⭐ MOVE GLOW HERE
          boxShadow:
            imageGlow === "correct"
              ? "0 0 20px 6px rgba(0, 200, 0, 0.6)"
              : imageGlow === "incorrect"
              ? "0 0 20px 6px rgba(200, 0, 0, 0.6)"
              : "none",

          transition: "box-shadow 0.2s ease-out",
          borderRadius: 8
        }}
      >
        <img
          src={card.asset}
          alt={card.id}
          style={{
            display: "block",
            width: "100%",
            transform: "translateY(-8%)"
          }}
        />
      </div>

      <ScenarioBox
        scenarioId={currentEntry.scenarioId}
        description={currentEntry.scenarioDescription}
        isFirstCardOfScenario={isFirstCardOfScenario}
        isMobile={isMobile}
        glow={scenarioGlow}
      />

      <p style={{ marginTop: 0, marginBottom: isMobile ? 6 : 10, textAlign: "center" }}>
        Does this card correctly represent the scenario?
      </p>

      <AnswerButtons
        isMobile={isMobile}
        onYes={function () { handleAnswer(true); }}
        onNo={function () { handleAnswer(false); }}
      />

      {feedback && (
        <p style={{ marginTop: isMobile ? 4 : 8, marginBottom: isMobile ? 4 : 8, textAlign: "center" }}>
          {feedback}
        </p>
      )}

      <StatsRow score={score} strikes={strikes} isMobile={isMobile} />

      {!studentMode && (
        <p style={{ marginTop: 4, marginBottom: 4 }}>
          Questions answered so far: {answers.length}
        </p>
      )}

      {showDebugUI && (
        <div style={{ display: "flex", gap: 12, marginTop: isMobile ? 10 : 16 }}>
          <button onClick={goPrev} disabled={cardIndex === 0}>Previous</button>
          <button onClick={goNext} disabled={cardIndex === totalCards - 1}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
