"use client";

export function PinPad({
  value,
  onChange,
  max = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: number;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  function press(k: string) {
    if (k === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (!k || value.length >= max) return;
    onChange(value + k);
  }

  return (
    <div>
      <div className="mb-4 flex justify-center gap-3">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full ${
              i < value.length ? "bg-ink" : "bg-mist"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k, i) => (
          <button
            key={`${k}-${i}`}
            type="button"
            disabled={!k}
            onClick={() => press(k)}
            className="h-16 rounded-2xl bg-paper text-2xl font-bold text-ink disabled:bg-transparent"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
