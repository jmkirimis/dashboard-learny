"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

type Props = {
  value: Dayjs | null;
  variant: "dark" | "light";
  onChange: (newValue: Dayjs | null) => void;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function DatePickerBR({ value, variant, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Dayjs>(value ?? dayjs());
  const rootRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "dark";

  // Mantém o mês visível sincronizado com o valor selecionado
  useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const label = value ? value.format("DD/MM/YYYY") : "DD/MM/YYYY";

  const days = useMemo(() => {
    const startOfMonth = viewDate.startOf("month");
    const leadingBlanks = startOfMonth.day(); // 0 = domingo
    const daysInMonth = viewDate.daysInMonth();

    const cells: (Dayjs | null)[] = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(startOfMonth.date(d));
    }
    return cells;
  }, [viewDate]);

  const today = dayjs();

  function handleSelect(day: Dayjs) {
    onChange(day);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative h-full" style={{ width: "80%" }}>
      {/* Botão / campo */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          height: "100%",
          fontSize: 16,
          backgroundColor: isDark ? "#fff" : "rgba(100,100,100,0.1)",
          color: isDark ? "#4c4c4c" : "#fff",
          boxShadow: isDark
            ? "0px 0px 8px rgba(0, 0, 0, 0.25)"
            : "inset 1px 1px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
        className="
          flex items-center justify-center
          border-none px-4 font-bold
          transition-all duration-200 ease-in-out
          cursor-pointer
        "
      >
        {label}
      </button>

      {/* Calendário */}
      {open && (
        <div
          className="
            absolute left-0 bottom-full z-50 mb-2
            w-72 rounded-2xl bg-white p-3
            text-[#4c4c4c]
            shadow-[0_4px_20px_rgba(0,0,0,0.2)]
          "
        >
          {/* Cabeçalho de navegação */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Ano anterior"
                onClick={() => setViewDate((d) => d.subtract(1, "year"))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm hover:bg-gray-100"
              >
                «
              </button>
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => setViewDate((d) => d.subtract(1, "month"))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm hover:bg-gray-100"
              >
                ‹
              </button>
            </div>

            <span className="text-sm font-bold">
              {capitalize(viewDate.format("MMMM [de] YYYY"))}
            </span>

            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => setViewDate((d) => d.add(1, "month"))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm hover:bg-gray-100"
              >
                ›
              </button>
              <button
                type="button"
                aria-label="Próximo ano"
                onClick={() => setViewDate((d) => d.add(1, "year"))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm hover:bg-gray-100"
              >
                »
              </button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-gray-400">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="py-1">
                {weekday}
              </span>
            ))}
          </div>

          {/* Grade de dias */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) return <span key={`blank-${index}`} />;

              const isSelected = value ? day.isSame(value, "day") : false;
              const isToday = day.isSame(today, "day");

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={`
                    flex h-9 items-center justify-center rounded-full text-sm
                    transition-colors
                    ${
                      isSelected
                        ? "bg-linear-to-b from-[#ab4c59] to-[#70819c] font-bold text-white"
                        : isToday
                          ? "border border-[#ab4c59] text-[#4c4c4c] hover:bg-gray-100"
                          : "text-[#4c4c4c] hover:bg-gray-100"
                    }
                  `}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
