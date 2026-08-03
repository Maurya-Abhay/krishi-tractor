import "server-only";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/calculations";
import type { getCustomerReport } from "@/lib/data/reports";

type Report = Awaited<ReturnType<typeof getCustomerReport>>;

// Constants for Page Setup (A4 Portrait)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Brand Palette (Modern Corporate Slate / Indigo)
const COLOR_PRIMARY = rgb(0.09, 0.17, 0.31);    // Deep Navy/Indigo (#172B4D)
const COLOR_SECONDARY = rgb(0.38, 0.45, 0.55);  // Slate Gray
const COLOR_TEXT_DARK = rgb(0.12, 0.16, 0.22);  // Charcoal Body Text
const COLOR_BG_LIGHT = rgb(0.96, 0.97, 0.98);   // Very Soft Blue-Gray
const COLOR_BORDER = rgb(0.88, 0.90, 0.92);     // Light Gray Border
const COLOR_GREEN = rgb(0.05, 0.6, 0.35);       // Paid accent
const COLOR_RED = rgb(0.85, 0.2, 0.2);          // Pending accent

export async function generateReportPdf(report: Report): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Try loading a Unicode TTF (recommended: public/fonts/NotoSans-Regular.ttf).
  // If not available, fall back to StandardFonts (WinAnsi) and sanitize text.
  let font: PDFFont;
  let boldFont: PDFFont;
  let isUnicodeFont = false;
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
    const bytes = await fs.promises.readFile(fontPath);
    font = await doc.embedFont(bytes);
    // Reuse same font for bold if no bold file provided.
    boldFont = font;
    isUnicodeFont = true;
  } catch (e) {
    font = await doc.embedFont(StandardFonts.Helvetica);
    boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    isUnicodeFont = false;
  }

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT;

  // Helper: Currency standardizing
  const safeCurrency = (v: number | string) => {
    return formatCurrency(v).replace(/₹/g, "Rs. ");
  };

  const sanitizeForWinAnsi = (s: string) => {
    if (isUnicodeFont) return s;
    if (!s) return s;
    return String(s).replace(/[^\x00-\xFF]/g, "?");
  };

  // If we don't have a Unicode-capable embedded font, produce a sanitized
  // shallow-copy of the report where user-provided strings are made WinAnsi-safe.
  const safeReport: Report = ((): Report => {
    if (isUnicodeFont) return report;
    return {
      ...report,
      customer: report.customer
        ? {
            ...report.customer,
            name: sanitizeForWinAnsi(report.customer.name || ""),
            address: sanitizeForWinAnsi(report.customer.address || ""),
            phone: sanitizeForWinAnsi(report.customer.phone || ""),
          }
        : report.customer,
      workEntries: report.workEntries.map((e) => ({
        ...e,
        service: { ...e.service, name: sanitizeForWinAnsi(e.service.name) },
      })),
      payments: report.payments.map((p) => ({ ...p, note: sanitizeForWinAnsi(p.note || "") })),
    } as Report;
  })();
  const reportData = safeReport;

  // Helper: Truncate long strings to fit cell widths
  const truncateText = (text: string, maxWidth: number, fontSize: number, isBold = false) => {
    const f = isBold ? boldFont : font;
    if (f.widthOfTextAtSize(text, fontSize) <= maxWidth) return text;
    let truncated = text;
    while (truncated.length > 0 && f.widthOfTextAtSize(truncated + "...", fontSize) > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  // Header Banner Component
  const drawHeaderBanner = () => {
    // Top primary accent block
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 70,
      width: PAGE_WIDTH,
      height: 70,
      color: COLOR_PRIMARY,
    });

    // Company Title
    page.drawText("KRISHI TRACTOR MANAGEMENT", {
      x: MARGIN,
      y: PAGE_HEIGHT - 38,
      size: 16,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Subtitle / Document Type
    page.drawText("CUSTOMER STATEMENT & ACCOUNT REPORT", {
      x: MARGIN,
      y: PAGE_HEIGHT - 54,
      size: 8,
      font,
      color: rgb(0.8, 0.85, 0.95),
    });

    y = PAGE_HEIGHT - 90;
  };

  // Watermark Component
  const drawWatermark = (p: PDFPage) => {
    p.drawText("KRISHI TRACTOR", {
      x: PAGE_WIDTH / 2 - 140,
      y: PAGE_HEIGHT / 2 - 20,
      size: 42,
      font: boldFont,
      color: rgb(0.94, 0.95, 0.97),
      opacity: 0.6,
    });
  };

  // Pagination Space Check
  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < MARGIN + 30) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawWatermark(page);
      y = PAGE_HEIGHT - MARGIN;
      return true;
    }
    return false;
  };

  // Start PDF Construction
  drawWatermark(page);
  drawHeaderBanner();

  // --- SECTION 1: Customer Details Box ---
  const custHeight = 65;
  page.drawRectangle({
    x: MARGIN,
    y: y - custHeight,
    width: CONTENT_WIDTH,
    height: custHeight,
    color: COLOR_BG_LIGHT,
    borderColor: COLOR_BORDER,
    borderWidth: 1,
  });

  const custY = y - 18;
  const customerName = reportData.customer?.name || "N/A";
  const customerAddress = reportData.customer?.address || "N/A";
  const customerPhone = reportData.customer?.phone ? `Mob: ${reportData.customer.phone}` : "";

  page.drawText("STATEMENT FOR:", { x: MARGIN + 12, y: custY, size: 8, font: boldFont, color: COLOR_SECONDARY });
  page.drawText(truncateText(customerName, 260, 11, true), { x: MARGIN + 12, y: custY - 14, size: 11, font: boldFont, color: COLOR_TEXT_DARK });
  page.drawText(truncateText(`${customerAddress} ${customerPhone ? " | " + customerPhone : ""}`, 300, 9), {
    x: MARGIN + 12,
    y: custY - 28,
    size: 9,
    font,
    color: COLOR_SECONDARY,
  });

  // Statement Meta Info (Right side of Customer Box)
  const metaX = MARGIN + CONTENT_WIDTH - 160;
  page.drawText("STATEMENT PERIOD:", { x: metaX, y: custY, size: 8, font: boldFont, color: COLOR_SECONDARY });
  page.drawText(`${formatDate(reportData.range.startDate)} - ${formatDate(reportData.range.endDate)}`, {
    x: metaX,
    y: custY - 14,
    size: 9,
    font: boldFont,
    color: COLOR_TEXT_DARK,
  });

  y -= custHeight + 20;

  // --- SECTION 2: Key Metrics Cards ---
  const cardWidth = (CONTENT_WIDTH - 20) / 3;
  const cardHeight = 45;

  const cards = [
    { label: "TOTAL WORK", value: safeCurrency(reportData.totalWork), color: COLOR_TEXT_DARK },
    { label: "TOTAL PAID", value: safeCurrency(reportData.totalPaid), color: COLOR_GREEN },
    { label: "BALANCE DUE", value: safeCurrency(reportData.pendingBalance), color: COLOR_RED },
  ];

  cards.forEach((card, i) => {
    const cardX = MARGIN + i * (cardWidth + 10);
    page.drawRectangle({
      x: cardX,
      y: y - cardHeight,
      width: cardWidth,
      height: cardHeight,
      color: rgb(0.99, 0.99, 1),
      borderColor: COLOR_BORDER,
      borderWidth: 1,
    });

    page.drawText(card.label, { x: cardX + 10, y: y - 14, size: 7, font: boldFont, color: COLOR_SECONDARY });
    page.drawText(card.value, { x: cardX + 10, y: y - 32, size: 12, font: boldFont, color: card.color });
  });

  y -= cardHeight + 25;

  // --- SECTION 3: Work History Table ---
  page.drawText("WORK HISTORY", { x: MARGIN, y, size: 11, font: boldFont, color: COLOR_PRIMARY });
  y -= 12;

  const workCols = [
    { label: "DATE", width: 75, align: "left" },
    { label: "SERVICE", width: 175, align: "left" },
    { label: "QTY", width: 85, align: "left" },
    { label: "RATE", width: 80, align: "right" },
    { label: "AMOUNT", width: 100, align: "right" },
  ];

  // Table Header Function
  const renderTableHeader = (cols: typeof workCols) => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 18,
      width: CONTENT_WIDTH,
      height: 18,
      color: COLOR_PRIMARY,
    });

    let currentX = MARGIN;
    cols.forEach((col) => {
      let printX = currentX + 6;
      if (col.align === "right") {
        const textWidth = boldFont.widthOfTextAtSize(col.label, 8);
        printX = currentX + col.width - textWidth - 6;
      }
      page.drawText(col.label, { x: printX, y: y - 12, size: 8, font: boldFont, color: rgb(1, 1, 1) });
      currentX += col.width;
    });
    y -= 18;
  };

  renderTableHeader(workCols);

  if (reportData.workEntries.length === 0) {
    y -= 18;
    page.drawText("No work records found for the selected period.", { x: MARGIN + 6, y, size: 9, font, color: COLOR_SECONDARY });
    y -= 10;
  }

  reportData.workEntries.forEach((entry, index) => {
    ensureSpace(20);

    // Row Background (Zebra Striping)
    if (index % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: y - 16,
        width: CONTENT_WIDTH,
        height: 16,
        color: COLOR_BG_LIGHT,
      });
    }

    const qtyText = entry.service.unit === "KATHA" ? `${Number(entry.katha)} Katha` : `${Number(entry.decimalHour)} Hr`;

    const rowData = [
      formatDate(entry.date),
      truncateText(entry.service.name, 160, 8.5),
      qtyText,
      safeCurrency(Number(entry.rate)),
      safeCurrency(Number(entry.total)),
    ];

    let currentX = MARGIN;
    rowData.forEach((val, colIdx) => {
      const col = workCols[colIdx]!;
      let printX = currentX + 6;
      if (col.align === "right") {
        const textWidth = font.widthOfTextAtSize(val, 8.5);
        printX = currentX + col.width - textWidth - 6;
      }
      page.drawText(val, { x: printX, y: y - 12, size: 8.5, font, color: COLOR_TEXT_DARK });
      currentX += col.width;
    });

    y -= 16;
  });

  y -= 25;

  // --- SECTION 4: Payment History Table ---
  ensureSpace(60);
  page.drawText("PAYMENT HISTORY", { x: MARGIN, y, size: 11, font: boldFont, color: COLOR_PRIMARY });
  y -= 12;

  const paymentCols = [
    { label: "DATE", width: 90, align: "left" },
    { label: "AMOUNT PAID", width: 110, align: "right" },
    { label: "REMARKS / NOTE", width: 315, align: "left" },
  ];

  renderTableHeader(paymentCols);

  if (reportData.payments.length === 0) {
    y -= 18;
    page.drawText("No payment transactions recorded for this period.", { x: MARGIN + 6, y, size: 9, font, color: COLOR_SECONDARY });
    y -= 10;
  }

  reportData.payments.forEach((payment, index) => {
    ensureSpace(20);

    if (index % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: y - 16,
        width: CONTENT_WIDTH,
        height: 16,
        color: COLOR_BG_LIGHT,
      });
    }

    const rowData = [
      formatDate(payment.date),
      safeCurrency(Number(payment.amount)),
      truncateText(payment.note ?? "-", 300, 8.5),
    ];

    let currentX = MARGIN;
    rowData.forEach((val, colIdx) => {
      const col = paymentCols[colIdx]!;
      let printX = currentX + 6;

      if (col.align === "right") {
        const textWidth = (colIdx === 1 ? boldFont : font).widthOfTextAtSize(val, 8.5);
        printX = currentX + col.width - textWidth - 6;
      }

      page.drawText(val, {
        x: printX,
        y: y - 12,
        size: 8.5,
        font: colIdx === 1 ? boldFont : font,
        color: colIdx === 1 ? COLOR_GREEN : COLOR_TEXT_DARK,
      });
      currentX += col.width;
    });

    y -= 16;
  });

  // --- SECTION 5: Dynamic Global Footers ---
  const totalPages = doc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const p = doc.getPage(i);

    // Separator line
    p.drawLine({
      start: { x: MARGIN, y: MARGIN + 12 },
      end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 12 },
      thickness: 0.5,
      color: COLOR_BORDER,
    });

    // Left Footer Branding
    p.drawText("Computer Generated Statement — Krishi Tractor Management System", {
      x: MARGIN,
      y: MARGIN - 2,
      size: 7.5,
      font,
      color: COLOR_SECONDARY,
    });

    // Right Footer Page Count
    const pageStr = `Page ${i + 1} of ${totalPages}`;
    const pageStrWidth = font.widthOfTextAtSize(pageStr, 7.5);
    p.drawText(pageStr, {
      x: PAGE_WIDTH - MARGIN - pageStrWidth,
      y: MARGIN - 2,
      size: 7.5,
      font,
      color: COLOR_SECONDARY,
    });
  }

  return doc.save();
}