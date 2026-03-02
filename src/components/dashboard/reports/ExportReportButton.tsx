/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { toast } from "sonner";

interface ExportReportButtonProps {
  month: number;
  year: number;
  expenseDistribution: {
    total: number;
    distribution: any[];
  } | null;
  settlementData: {
    settlement: any[];
    totals: any;
  } | null;
  mealRateTrend: any[] | null;
}

export function ExportReportButton({ 
  month, 
  year, 
  expenseDistribution, 
  settlementData,
  mealRateTrend 
}: ExportReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    try {
      setLoading(true);
      // toast.info("Generating PDF...");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Title
      doc.setFontSize(20);
      doc.text(`Mess Report - ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, pageWidth / 2, 15, { align: "center" });
      
      let yPos = 25;

      // Summary Section
      doc.setFontSize(14);
      doc.text("Summary", 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.text(`Total Expenses: ${(expenseDistribution?.total ?? 0).toFixed(2)} BDT`, 14, yPos);
      yPos += 6;
      
      const currentMonthRate = mealRateTrend && mealRateTrend.length > 0 
        ? mealRateTrend[mealRateTrend.length - 1].rate 
        : 0;
      doc.text(`Current Meal Rate: ${currentMonthRate.toFixed(2)} BDT`, 14, yPos);
      yPos += 6;

      if (settlementData?.totals) {
        doc.text(`Total Meals: ${settlementData.totals.totalMeals}`, 14, yPos);
        yPos += 6;
        doc.text(`Total Meal Cost: ${(settlementData.totals.totalMealCost ?? 0).toFixed(2)} BDT`, 14, yPos);
        yPos += 6;
        doc.text(`Total Fixed Cost: ${(settlementData.totals.totalFixedShare ?? 0).toFixed(2)} BDT`, 14, yPos);
        yPos += 10;
      }

      // Settlement Table
      doc.setFontSize(14);
      doc.text("Member Settlement", 14, yPos);
      yPos += 6;

      const tableColumn = ["Name", "Meals", "Meal Cost", "Fixed Cost", "Total Cost", "Deposited", "Balance"];
      const tableRows: any[] = [];

      settlementData?.settlement.forEach((member) => {
        const row = [
          member.memberName,
          member.totalMeals,
          (member.mealCost ?? 0).toFixed(2),
          (member.fixedCostShare ?? 0).toFixed(2),
          (member.totalCost ?? 0).toFixed(2),
          (member.totalDeposited ?? 0).toFixed(2),
          (member.balance ?? 0).toFixed(2),
        ];
        tableRows.push(row);
      });

      // Add Totals Row
      if (settlementData?.totals) {
        tableRows.push([
          "TOTAL",
          settlementData.totals.totalMeals,
          (settlementData.totals.totalMealCost ?? 0).toFixed(2),
          (settlementData.totals.totalFixedShare ?? 0).toFixed(2),
          ((settlementData.totals.totalMealCost ?? 0) + (settlementData.totals.totalFixedShare ?? 0)).toFixed(2),
          (settlementData.totals.totalDeposited ?? 0).toFixed(2),
          (settlementData.totals.totalBalance ?? 0).toFixed(2), 
        ]);
      }

      autoTable(doc, {
        startY: yPos,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 8 },
        footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
        didParseCell: function(data) {
             // Highlight negative balance in red
             if (data.section === 'body' && data.column.index === 6) {
                 const val = parseFloat(data.cell.raw as string);
                 if (val < 0) {
                     data.cell.styles.textColor = [255, 0, 0];
                 } else {
                     data.cell.styles.textColor = [0, 128, 0];
                 }
             }
        }
      });

      doc.save(`mess-report-${month}-${year}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      id="export-pdf-btn"
      variant="outline" 
      className="gap-2 bg-background" 
      onClick={handleExport}
      disabled={loading}
    >
      <Download className="h-4 w-4" />
      {loading ? "Generating..." : "Export PDF"}
    </Button>
  );
}
