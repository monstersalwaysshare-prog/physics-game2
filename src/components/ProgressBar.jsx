//M4 src/components/ProgressBar.jsx

function ProgressBar(props)
{
  const { current, total, isMobile } = props;

  const progressFraction = total > 0 ? current / total : 0;
  const progressPercent = Math.round(progressFraction * 100);

  const outerStyle =
  {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#eeeeee",
    overflow: "hidden",
    marginBottom: isMobile ? 4 : 8
  };

  const innerStyle =
  {
    height: "100%",
    width: progressPercent + "%",
    backgroundColor: "#4caf50",
    transition: "width 0.2s ease-out"
  };

  return (
    <div>
      <div style={outerStyle}>
        <div style={innerStyle}></div>
      </div>

      <p
        style={{
          marginTop: 0,
          marginBottom: isMobile ? 8 : 12,
          fontSize: isMobile ? "0.8rem" : "0.9rem"
        }}
      >
        Progress: {current} / {total} ({progressPercent}%)
      </p>
    </div>
  );
}

export default ProgressBar;
