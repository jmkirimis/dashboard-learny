export type Activity = {
  _id: {
    $oid: string;
  };
  type: string;
  data: {
    worldCode?: string;
    moduleCode?: string;
    phaseCode?: string;
  };
  createdAt: {
    $date: string;
  };
};

export function getBarChartData(activities: Activity[]) {
  const today = new Date();

  // últimos 4 dias
  const days = Array.from({ length: 4 }).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (3 - index));

    return {
      key: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("pt-BR", {
        weekday: "short",
      }),
      value: 0,
    };
  });

  activities.forEach((activity) => {
    const activityDate = new Date(activity.createdAt.$date)
      .toISOString()
      .split("T")[0];

    const foundDay = days.find((day) => day.key === activityDate);

    if (foundDay) {
      foundDay.value += 1;
    }
  });

  return days.map((day) => ({
    name: day.label,
    value: day.value,
  }));
}

export function getPieChartData(activities: Activity[]) {
  const grouped: Record<string, number> = {};

  activities.forEach((activity) => {
    const world = activity.data.worldCode || "OUTROS";

    grouped[world] = (grouped[world] || 0) + 1;
  });

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));
}