//v3 
function ScenarioBox(props)
{
  const { scenarioId, description, isFirstCardOfScenario, isMobile, glow } = props;

  const boxStyle =
  {
    borderRadius: 8,
    padding: isMobile ? 8 : 12,
    marginTop: isMobile ? 6 : 10,
    marginBottom: isMobile ? 2 : 4,
    border: isFirstCardOfScenario ? "3px solid #0077ff" : "1px solid #cccccc",
    backgroundColor: "#f8f9ff",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: glow ? "0 0 16px 4px rgba(0, 128, 255, 0.6)" : "none",
    transition: "box-shadow 0.2s ease-out"
  };

  const descriptionStyle =
  {
    fontSize: isMobile ? "1rem" : "1.1rem",
    fontWeight: "bold",
    color: "#003366",
    margin: 0
  };

  const labelStyle =
  {
    margin: 0,
    marginBottom: 4,
    fontSize: isMobile ? "0.8rem" : "0.9rem"
  };

  //return what's in the scenario box
  return (
    <div style={boxStyle}>
      <p style={descriptionStyle}>
        ({scenarioId}) {description}
      </p>
    </div>
  );
}

export default ScenarioBox;
