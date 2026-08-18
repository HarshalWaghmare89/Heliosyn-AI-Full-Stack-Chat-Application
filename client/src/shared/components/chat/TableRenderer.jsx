import { useEffect, useRef, useState } from "react";

import CopyMessageButton from "./CopyMessageButton";

const TableRenderer = ({ children }) => {
  const tableRef = useRef(null);

  const [tableText, setTableText] = useState("");

  useEffect(() => {
    const table = tableRef.current;

    if (!table) {
      return;
    }

    const rows = Array.from(table.querySelectorAll("tr"));

    const text = rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));

        return cells.map((cell) => cell.innerText.trim()).join("\t");
      })
      .join("\n");

    setTableText(text);
  }, [children]);

  return (
    <div
      className="
        group
        relative
        my-6
        w-full
        max-w-full
      "
    >
      {/* COPY BUTTON */}

      <div
        className="
          absolute
          right-2
          top-2
          z-10
        "
      >
        <CopyMessageButton text={tableText} />
      </div>

      {/* TABLE */}

      <div
        ref={tableRef}
        className="
          w-full
          max-w-full
          overflow-x-auto
          rounded-xl
          border
          border-neutral-800
          bg-[#0d1018]
          custom-scrollbar
        "
      >
        <table
          className="
            w-full
            min-w-[600px]
            border-collapse
            text-left
          "
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export default TableRenderer;
