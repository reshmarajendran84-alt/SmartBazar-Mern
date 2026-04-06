//   The summary section has 3 cards that look identical but show
//   different data. Instead of copying the same JSX 3 times,
//   we extract it into one reusable component with props.
//
// PROPS = parameters you pass into a component (like function arguments).
//   label  → the small text above (e.g. "Total Revenue")
//   value  → the big number (e.g. "₹50,000")
//   color  → the color of the big number (green, blue, purple)

const StatCard = ({ label, value, color = "#1a1a2e" }) => (
  <div style={{
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  }}>
    <span style={{
      fontSize: 11,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
      fontWeight: 600,
    }}>
      {label}
    </span>
    <span style={{
      fontSize: 28,
      fontWeight: 700,
      color,              // uses the color prop
    }}>
      {value}
    </span>
  </div>
);

export default StatCard;