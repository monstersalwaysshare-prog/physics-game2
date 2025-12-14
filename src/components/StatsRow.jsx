//src/components/StatsRow.jsx

function StatsRow(props)
{
  const { score, strikes, isMobile } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: isMobile ? 16 : 24,
        marginTop: isMobile ? 4 : 8,
        marginBottom: isMobile ? 4 : 8
      }}
    >
      <p style={{ margin: 0 }}>Score: {score}</p>
      <p style={{ margin: 0 }}>Strikes: {strikes}</p>
    </div>
  );
}

export default StatsRow;
