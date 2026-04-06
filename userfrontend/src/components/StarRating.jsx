import { memo, useState } from "react";

const StarRating = memo(({ value = 0, onChange, readOnly = false, size = 24 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            fontSize: size,
            cursor: readOnly ? "default" : "pointer",
            color: star <= (hovered || value) ? "#f59e0b" : "#d1d5db",
            transition: "color 0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
});

export default StarRating;