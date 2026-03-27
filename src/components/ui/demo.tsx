import React, { useMemo } from "react";
import { VisxFinanceChart } from "./finance-chart"; 
import { cn } from "../../lib/utils";

// Adapter to wrap the dynamic real data resizing for the Analytics Page
export const TrackingGraphDemo = ({ transactions, width = 600, height = 300 }: { transactions: any[], width?: number, height?: number }) => {
  const chartData = useMemo(() => {
    // We filter for expenses and sort by date 
    const expenses = transactions.filter(t => t.type === 'expense');
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group expenses by date properly
    const trendAcc: Record<string, number> = {};
    sorted.forEach(t => {
      // Just slice the date completely cleanly "YYYY-MM-DD"
      const dateKey = new Date(t.date).toISOString().split('T')[0];
      if (!trendAcc[dateKey]) trendAcc[dateKey] = 0;
      trendAcc[dateKey] += t.amount;
    });

    const finalData = Object.keys(trendAcc).map(dateStr => ({
      date: dateStr,
      close: trendAcc[dateStr] // mapping amount to the 'close' parameter expected by Visx template
    }));

    // If no data, return flat line for visual appearance to prevent crashes
    if (finalData.length === 0) {
      return [
        { date: new Date(Date.now() - 86400000*2).toISOString(), close: 0 },
        { date: new Date().toISOString(), close: 0 }
      ];
    }
    return finalData;
  }, [transactions]);

  return (
    <div className={cn("overflow-hidden flex justify-center items-center w-full", "rounded-2xl")}>
      <VisxFinanceChart
        data={chartData}
        width={width}
        height={height}
      />
    </div>
  );
};
