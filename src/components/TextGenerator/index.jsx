import React, { useEffect, useState } from "react";

export function TextGenerator({ text, interval }) {
  const [currentLetter, setCurrentLetter] = useState("");
  let currentIndex = 0;

  useEffect(() => {
    const intervalId = setInterval(generateNextLetter, interval);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function generateNextLetter() {
    if (currentIndex >= text?.split(" ").length) {
      return;
    }

    const nextLetter = text?.split(" ")[currentIndex];
    setCurrentLetter((prevLetter) => prevLetter + " " + nextLetter);
    currentIndex++;
  }

  return (
    <div>
      <p>
        {currentLetter}
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "16px",
            backgroundColor: "black",
            marginBottom: "-2px",
          }}
          className="my_pulse"
        ></span>
      </p>
    </div>
  );
}
