//App.jsx 9B grew too long
//modularization by
//Extract the finished summary/review into its own component file.
//src/FinishedScreen.jsx

function FinishedScreen(props)
{
  const {
    totalCards = 0,
    answers = [],
    score = 0,
    strikes = 0,
    scenarios = [],
    cards = [],
    theme = "light"
  } = props;

  const pageStyle =
  {
    minHeight: "100vh",
    backgroundColor: theme === "dark" ? "#111111" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#111111",
    padding: 20,
    fontFamily: "sans-serif"
  };

  const containerStyle =
  {
    maxWidth: 900,
    margin: "0 auto"
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1>Physics Game – Summary & Review</h1>

        <p>
          Total questions in deck: {totalCards}
          <br />
          Questions answered: {answers.length}
          <br />
          Score: {score}
          <br />
          Strikes: {strikes} / 3
        </p>

        <hr style={{ margin: "20px 0" }} />

        <h2>Review by Scenario</h2>

        {scenarios.map(function (scenario)
        {
          const scenarioAnswers = answers.filter(function (a)
          {
            return a.scenarioId === scenario.id;
          });

          if (scenarioAnswers.length === 0)
          {
            return null;
          }

          const correctCount = scenarioAnswers.filter(function (a)
          {
            return a.gotItRight;
          }).length;

          return (
            <div
              key={scenario.id}
              style={{
                border: theme === "dark" ? "1px solid #333333" : "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 20,
                backgroundColor: theme === "dark" ? "#1b1b1b" : "#ffffff"
              }}
            >
              <h3>
                Scenario {scenario.id}: {scenario.description}
              </h3>

              <p>
                You answered {correctCount} / {scenarioAnswers.length} cards correctly for this scenario.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                {scenarioAnswers.map(function (answer)
                {
                  const card = cards.find(function (c)
                  {
                    return c.id === answer.cardId;
                  });

                  if (!card)
                  {
                    return (
                      <div
                        key={answer.cardIndex}
                        style={{
                          border: theme === "dark" ? "1px solid #333333" : "1px solid #eee",
                          borderRadius: 8,
                          padding: 8,
                          width: 200,
                          backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff"
                        }}
                      >
                        <p>Missing card: {answer.cardId}</p>
                      </div>
                    );
                  }

                  const resultBg =
                    answer.gotItRight
                      ? (theme === "dark" ? "#123018" : "#e8ffe8")
                      : (theme === "dark" ? "#301212" : "#ffe8e8");

                  return (
                    <div
                      key={answer.cardIndex}
                      style={{
                        border: theme === "dark" ? "1px solid #333333" : "1px solid #eee",
                        borderRadius: 8,
                        padding: 8,
                        width: 200,
                        backgroundColor: resultBg
                      }}
                    >
                      <img
                        src={card.asset}
                        alt={card.id}
                        style={{
                          width: "100%",
                          borderRadius: 4,
                          marginBottom: 6
                        }}
                      />

                      <p style={{ margin: 0, fontSize: 14 }}>
                        Truth: {answer.correctTruth ? "Correct" : "Incorrect"}
                        <br />
                        You answered: {answer.playerAnswerIsYes ? "Yes" : "No"}
                        <br />
                        Result: {answer.gotItRight ? "✅ Right" : "❌ Wrong"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p style={{ marginTop: 20 }}>
          Refresh the page to play again.
        </p>
      </div>
    </div>
  );
}

export default FinishedScreen;
