import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Papa from "papaparse";

type ExportMetric = {
  label: string;
  value: string;
};

type ExportRow = {
  [key: string]: string | number;
};

type PdfExportOptions = {
  title: string;
  filename: string;
  subtitle?: string;
  metrics?: ExportMetric[];
  rows?: ExportRow[];
  notes?: string[];
};

export function downloadCsv(filename: string, rows: ExportRow[]) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, filename);
}

export function downloadPdf({ title, filename, subtitle, metrics = [], rows = [], notes = [] }: PdfExportOptions) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text(title, 14, y);
  y += 8;

  if (subtitle) {
    doc.setFontSize(10);
    const subtitleLines = doc.splitTextToSize(subtitle, 180);
    doc.text(subtitleLines, 14, y);
    y += subtitleLines.length * 5 + 3;
  }

  if (metrics.length > 0) {
    doc.setFontSize(12);
    doc.text("Summary", 14, y);
    y += 7;
    doc.setFontSize(10);
    for (const metric of metrics) {
      doc.text(`${metric.label}: ${metric.value}`, 14, y);
      y += 6;
    }
    y += 2;
  }

  if (rows.length > 0) {
    doc.setFontSize(12);
    doc.text("Rows", 14, y);
    y += 7;
    doc.setFontSize(9);

    const keys = Object.keys(rows[0] ?? {});
    for (const row of rows) {
      const line = keys.map((key) => `${key}: ${String(row[key])}`).join(" | ");
      const wrapped = doc.splitTextToSize(line, 180);
      if (y + wrapped.length * 5 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(wrapped, 14, y);
      y += wrapped.length * 5 + 2;
    }
  }

  if (notes.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.text("Notes", 14, y);
    y += 7;
    doc.setFontSize(10);
    for (const note of notes) {
      const wrapped = doc.splitTextToSize(`- ${note}`, 180);
      doc.text(wrapped, 14, y);
      y += wrapped.length * 5 + 2;
    }
  }

  doc.save(filename);
}
