// src/utils/export.js
import { unparse } from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export results and optional data points to a CSV file.
 * @param {string} filename - The name of the CSV file.
 * @param {object} resultObject - Key-value result pairs.
 * @param {array} dataPoints - Optional array of {x, y} style data.
 */
export function exportResultsToCSV(filename, resultObject, dataPoints = []) {
  const rows = [];

  if (resultObject) {
    rows.push({ Parameter: "Results", Value: "" });
    for (const key in resultObject) {
      rows.push({ Parameter: key, Value: resultObject[key] });
    }
  }

  if (dataPoints.length > 0) {
    rows.push({});
    rows.push({ Parameter: "Chart Data", Value: "" });
    rows.push(...dataPoints);
  }

  const csv = unparse(rows);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export results and optionally a chart to a PDF file.
 * @param {string} title - Title for the PDF document.
 * @param {object} resultObject - Key-value result pairs.
 * @param {string|null} chartElementId - Optional chart container ID for screenshot.
 */
export async function exportResultsToPDF(title, resultObject, chartElementId = null) {
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text(title, 10, y);
  y += 10;

  doc.setFontSize(12);
  for (const key in resultObject) {
    doc.text(`${key}: ${resultObject[key]}`, 10, y);
    y += 8;
  }

  if (chartElementId) {
    const chartElement = document.getElementById(chartElementId);
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      y += 10;
      doc.addImage(imgData, 'PNG', 10, y, 180, 90); // image width ~ full page
    }
  }

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
}
