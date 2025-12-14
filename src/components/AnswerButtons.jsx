// src/components/AnswerButtons.jsx

function AnswerButtons(props)
{
  const { isMobile, onYes, onNo } = props;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: isMobile ? 6 : 8,
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <button
        onClick={onYes}
        style={{
          flex: 1,
          padding: isMobile ? "10px 0" : "14px 0",
          fontSize: isMobile ? 16 : 18,
          fontWeight: "bold",
          borderRadius: 999,
          border: "none",
          backgroundColor: "#4caf50",
          color: "#ffffff",
          cursor: "pointer"
        }}
      >
        Yes
      </button>

      <button
        onClick={onNo}
        style={{
          flex: 1,
          padding: isMobile ? "10px 0" : "14px 0",
          fontSize: isMobile ? 16 : 18,
          fontWeight: "bold",
          borderRadius: 999,
          border: "none",
          backgroundColor: "#f44336",
          color: "#ffffff",
          cursor: "pointer"
        }}
      >
        No
      </button>
    </div>
  );
}

export default AnswerButtons;
