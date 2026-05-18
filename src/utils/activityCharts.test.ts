import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Activity, getBarChartData, getPieChartData } from "./activityCharts";

function makeActivity(overrides: Partial<Activity> & { date: string; worldCode?: string }): Activity {
  return {
    _id: { $oid: "1" },
    type: "phase_completed",
    data: { worldCode: overrides.worldCode },
    createdAt: { $date: overrides.date },
  };
}

describe("getBarChartData", () => {
  const FIXED_NOW = new Date("2026-05-18T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna 4 buckets representando os últimos 4 dias", () => {
    const data = getBarChartData([]);
    expect(data).toHaveLength(4);
    for (const bucket of data) {
      expect(bucket.value).toBe(0);
    }
  });

  it("agrega atividades por dia dentro da janela", () => {
    const activities = [
      makeActivity({ date: "2026-05-18T10:00:00.000Z" }),
      makeActivity({ date: "2026-05-18T11:00:00.000Z" }),
      makeActivity({ date: "2026-05-17T09:00:00.000Z" }),
    ];

    const data = getBarChartData(activities);
    const total = data.reduce((sum, day) => sum + day.value, 0);

    expect(total).toBe(3);
    expect(data[data.length - 1].value).toBe(2);
    expect(data[data.length - 2].value).toBe(1);
  });

  it("ignora atividades fora da janela de 4 dias", () => {
    const activities = [
      makeActivity({ date: "2026-05-10T10:00:00.000Z" }),
    ];

    const data = getBarChartData(activities);
    const total = data.reduce((sum, day) => sum + day.value, 0);

    expect(total).toBe(0);
  });
});

describe("getPieChartData", () => {
  const FIXED_NOW = new Date("2026-05-18T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("agrupa atividades do mês atual por worldCode", () => {
    const activities = [
      makeActivity({ date: "2026-05-01T10:00:00.000Z", worldCode: "WORLD_1" }),
      makeActivity({ date: "2026-05-02T10:00:00.000Z", worldCode: "WORLD_1" }),
      makeActivity({ date: "2026-05-03T10:00:00.000Z", worldCode: "WORLD_2" }),
    ];

    const data = getPieChartData(activities);
    const map = Object.fromEntries(data.map((d) => [d.name, d.value]));

    expect(map.WORLD_1).toBe(2);
    expect(map.WORLD_2).toBe(1);
  });

  it("classifica atividades sem worldCode como OUTROS", () => {
    const activities = [makeActivity({ date: "2026-05-10T10:00:00.000Z" })];
    const data = getPieChartData(activities);
    expect(data).toEqual([{ name: "OUTROS", value: 1 }]);
  });

  it("ignora atividades de outros meses", () => {
    const activities = [
      makeActivity({ date: "2026-04-30T23:59:59.000Z", worldCode: "WORLD_1" }),
      makeActivity({ date: "2025-05-15T10:00:00.000Z", worldCode: "WORLD_1" }),
    ];

    const data = getPieChartData(activities);
    expect(data).toEqual([]);
  });
});
