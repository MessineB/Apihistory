"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

// Helpers
const getDofusImage = (name: string): string =>
  `/images/dofus/${name.toLowerCase().replace("dofus ", "").replace(/\s+/g, "-")}.png`;

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // retire accents si présents
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/['’]/g, "-") // remplace apostrophes et guillemets par des tirets
    .replace(/\s+/g, "-") // espaces → tirets
    .replace(/[^a-z0-9-]/g, "") // retire tout le reste sauf lettres, chiffres, -
    .replace(/--+/g, "-") // pas de tirets doublés
    .replace(/^-+|-+$/g, ""); // pas de tiret au début/fin
};



const parseCell = (cell: any): any => {
  if (!cell) return null;

  if (cell.l?.Target) {
    return { url: cell.l.Target, label: cell.v ?? cell.l.Target };
  }

  if (cell.f?.includes("LIEN.HYPERTEXTE")) {
    const match = cell.f.match(/LIEN\.HYPERTEXTE\(\"(.+?)\";\s*\"(.+?)\"\)/i);
    if (match) return { url: match[1], label: match[2] };
    return cell.v;
  }

  return cell.v;
};

export default function DofusUpload() {
  const [dofusSheets, setDofusSheets] = useState<
    { name: string; data: any[][]; completed: boolean; checked: number; total: number }[]
  >([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);

    const sheets = workbook.SheetNames.filter((name) => name.startsWith("Dofus")).map((name) => {
      const sheet = workbook.Sheets[name];
      const range = XLSX.utils.decode_range(sheet["!ref"]!);
      const parsedData: any[][] = [];

      for (let R = range.s.r; R <= range.e.r; ++R) {
        const row: any[] = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = sheet[cellRef];
          row.push(parseCell(cell));
        }
        parsedData.push(row);
      }

      const filteredRows = parsedData
        .filter((row) => row.some((cell) => typeof cell === "boolean"))
        .map((row) => {
          const checkbox = row.find((cell) => typeof cell === "boolean");
          const text = row.find(
            (cell) =>
              typeof cell === "string" ||
              (typeof cell === "object" && cell?.label)
          );
          return [checkbox, text ?? null];
        });

      const boolValues = filteredRows.flat().filter((cell) => typeof cell === "boolean");
      const total = boolValues.length;
      const checked = boolValues.filter((b) => b === true).length;
      const completed = total > 0 && checked === total;

      return { name, data: filteredRows, completed, checked, total };
    });

    setDofusSheets(sheets);

    const token = localStorage.getItem('token');

    await Promise.all(
      sheets.map(async (sheet) => {
        try {
          await fetch('http://localhost:3001/dofus/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              dofusList: sheets.map((sheet) => ({
                dofusName: sheet.name,
                obtained: sheet.completed,
                questAchieved: sheet.checked,
              })),
            }),
          });
        } catch (err) {
          console.error(`Erreur lors de la sync du Dofus ${sheet.name}`, err);
        }
      })
    );
  };

  return (
    <div className="p-4 space-y-6">
      <input type="file" accept=".xlsx" onChange={handleFileChange} />

      {dofusSheets.map((sheet, i) => (
        <div key={i} className="border rounded">
          <button
            onClick={() => toggleIndex(i)}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold text-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              <img src={getDofusImage(sheet.name)} alt={sheet.name} className="w-8 h-8 object-contain" />
              <span>{sheet.name} ({sheet.checked} / {sheet.total})</span>
              {sheet.completed && <span className="text-green-600">✅</span>}
            </div>
            <span className={`ml-2 transition-transform inline-block ${openIndex === i ? "rotate-180" : ""}`}>▼</span>
          </button>

          {openIndex === i && (
            <div className="p-4 border-t">
              {sheet.completed && (
                <p className="text-green-600 font-medium mb-2">
                  🎉 Félicitations, vous avez le <strong>{sheet.name}</strong> !
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {sheet.data.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => {
                          return (
                            <td key={ci} className="border px-2 py-1">
                              {typeof cell === "boolean" ? (
                                cell ? "✅" : "❌"
                              ) : typeof cell === "string" ? (
                                <a
                                  href={`https://www.dofuspourlesnoobs.com/${slugify(cell)}.html`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  {cell}
                                </a>
                              ) : (
                                cell?.toString() || ""
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
