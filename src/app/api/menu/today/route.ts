import { NextResponse } from "next/server";
import { resolveDishImage } from "@/app/utils/dishImages";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export interface MenuItem {
  id: string;
  category: string;
  item: string;
  price: string;
  description: string;
  available: boolean;
  imageUrl?: string;
  imageStatus?: "Pending" | "Approved" | "Regenerate" | "Failed";
}

interface MenuResponse {
  dateString: string;
  formattedDate: string;
  isMonday: boolean;
  status: "OPEN" | "MONDAY_CLOSED" | "EMPTY_MENU" | "ERROR";
  categories: string[];
  items: MenuItem[];
  message?: string;
}

export async function GET() {
  try {
    const now = new Date();

    // Deterministic date & day in Asia/Kolkata timezone
    const istDateString = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const istDayOfWeek = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
    }).format(now);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);

    // Monday Weekly Off check
    if (istDayOfWeek.toLowerCase() === "monday") {
      return NextResponse.json({
        dateString: istDateString,
        formattedDate,
        isMonday: true,
        status: "MONDAY_CLOSED",
        categories: [],
        items: [],
        message: "KITCHEN CLOSED TODAY. See you tomorrow for freshly prepared meals.",
      });
    }

    const sheetCsvUrl = process.env.GOOGLE_SHEET_CSV_URL || process.env.GOOGLE_SHEETS_CSV_URL;

    if (!sheetCsvUrl) {
      return NextResponse.json({
        dateString: istDateString,
        formattedDate,
        isMonday: false,
        status: "EMPTY_MENU",
        categories: [],
        items: [],
        message: "TODAY'S MENU IS BEING UPDATED. Please check back shortly.",
      });
    }

    const res = await fetch(sheetCsvUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    if (rows.length <= 1) {
      return NextResponse.json({
        dateString: istDateString,
        formattedDate,
        isMonday: false,
        status: "EMPTY_MENU",
        categories: [],
        items: [],
        message: "TODAY'S MENU IS BEING UPDATED. Please check back shortly.",
      });
    }

    const [header, ...dataRows] = rows;
    const dateIdx = header.findIndex((h) => h.toLowerCase().includes("date"));
    const catIdx = header.findIndex((h) => h.toLowerCase().includes("category"));
    const itemIdx = header.findIndex((h) => h.toLowerCase().includes("item"));
    const priceIdx = header.findIndex((h) => h.toLowerCase().includes("price"));
    const descIdx = header.findIndex((h) => h.toLowerCase().includes("desc"));
    const availIdx = header.findIndex((h) => h.toLowerCase().includes("avail"));
    const imgIdx = header.findIndex(
      (h) => h.toLowerCase().includes("image url") || h.toLowerCase().includes("image")
    );
    const imgStatIdx = header.findIndex((h) => h.toLowerCase().includes("status"));

    const items: MenuItem[] = [];
    const categoriesSet = new Set<string>();

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowDate = (row[dateIdx] || "").trim();

      if (!matchesToday(rowDate, istDateString)) continue;

      const itemName = (row[itemIdx] || "").trim();
      if (!itemName) continue;

      const category = (row[catIdx] || "Daily Specials").trim();
      const rawPrice = (row[priceIdx] || "").trim().replace(/^₹/, "");
      const description = (row[descIdx] || "").trim();
      const rawAvailable = (row[availIdx] || "YES").trim().toUpperCase();
      const isAvailable =
        rawAvailable === "YES" || rawAvailable === "TRUE" || rawAvailable === "Y";

      // Automated image resolution: checks user URL, then approved library, then category fallback
      const rawSheetImage = imgIdx !== -1 ? (row[imgIdx] || "").trim() : "";
      const resolvedImageUrl = resolveDishImage(rawSheetImage, itemName, category);

      const imageStatus = (
        imgStatIdx !== -1 && row[imgStatIdx]
          ? row[imgStatIdx].trim()
          : "Approved"
      ) as MenuItem["imageStatus"];

      categoriesSet.add(category);
      items.push({
        id: `dish-${i}-${itemName.toLowerCase().replace(/\s+/g, "-")}`,
        category,
        item: itemName,
        price: rawPrice ? `₹${rawPrice}` : "Price on request",
        description,
        available: isAvailable,
        imageUrl: resolvedImageUrl,
        imageStatus,
      });
    }

    return NextResponse.json({
      dateString: istDateString,
      formattedDate,
      isMonday: false,
      status: items.length > 0 ? "OPEN" : "EMPTY_MENU",
      categories: Array.from(categoriesSet),
      items,
      message:
        items.length === 0
          ? "TODAY'S MENU IS BEING UPDATED. Please check back shortly."
          : undefined,
    });
  } catch {
    return NextResponse.json(
      {
        dateString: "",
        formattedDate: "",
        isMonday: false,
        status: "ERROR",
        categories: [],
        items: [],
        message: "We're having trouble loading today's menu. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}

function matchesToday(rowDate: string, todayIso: string): boolean {
  if (!rowDate) return false;
  if (rowDate === todayIso) return true;

  // Handles DD-MM-YYYY or DD/MM/YYYY
  const parts = rowDate.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const reordered = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      return reordered === todayIso;
    }
    if (parts[0].length === 4) {
      const reordered = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      return reordered === todayIso;
    }
  }
  return false;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentCell);
      if (currentRow.some((c) => c.trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  return rows;
}