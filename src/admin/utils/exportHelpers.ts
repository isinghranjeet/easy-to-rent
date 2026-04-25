// src/admin/utils/exportHelpers.ts
// CSV and JSON export utilities for admin tables

import { toast } from 'sonner';

// ────────────────── CSV Export ──────────────────
function escapeCSV(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  try {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = columns.map((c) => c.label).join(',');
    const rows = data.map((row) =>
      columns.map((c) => escapeCSV(row[c.key])).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success(`Exported ${data.length} rows to CSV`);
  } catch (error) {
    toast.error('Failed to export CSV');
    console.error('CSV export error:', error);
  }
}

// ────────────────── JSON Export ──────────────────
export function exportToJSON<T>(data: T[], filename: string): void {
  try {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success(`Exported ${data.length} rows to JSON`);
  } catch (error) {
    toast.error('Failed to export JSON');
    console.error('JSON export error:', error);
  }
}

// ────────────────── PDF Export (print-friendly HTML) ──────────────────
export function exportToPrintableHTML<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[],
  title: string
): void {
  try {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const rows = data
      .map(
        (row) => `
        <tr>
          ${columns.map((c) => `<td>${String(row[c.key] ?? '—')}</td>`).join('')}
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; }
          h1 { font-size: 1.5rem; margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; }
          tr:hover { background: #f9fafb; }
          .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Generated on ${new Date().toLocaleString('en-IN')}</div>
        <table>
          <thead>
            <tr>${columns.map((c) => `<th>${c.label}</th>`).join('')}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success(`Exported ${data.length} rows to HTML (print-friendly)`);
  } catch (error) {
    toast.error('Failed to export HTML');
    console.error('HTML export error:', error);
  }
}

