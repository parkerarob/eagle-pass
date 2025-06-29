import { useEffect, useState } from "react";
import { getFrequentFlyers, getPeriodHeatmap } from "../services/reports";

interface Flyer {
  studentId: string;
  passCount: number;
}

export default function ReportingDashboardPage() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});

  useEffect(() => {
    getFrequentFlyers().then(setFlyers);
    getPeriodHeatmap().then(setHeatmap);
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Reporting Dashboard</h1>
      <div>
        <h2 className="font-semibold">Top Frequent Flyers</h2>
        <ul>
          {flyers.map((f) => (
            <li key={f.studentId}>
              {f.studentId}: {f.passCount}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Passes by Hour</h2>
        <pre data-testid="heatmap">{JSON.stringify(heatmap, null, 2)}</pre>
      </div>
    </div>
  );
}
