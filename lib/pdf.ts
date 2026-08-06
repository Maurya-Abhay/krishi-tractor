import "server-only";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/calculations";
import type { getCustomerReport, BackupReport } from "@/lib/data/reports";

type Report = Awaited<ReturnType<typeof getCustomerReport>>;

// Constants for Page Setup (A4 Portrait)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 36; // Slightly tighter margin for better space usage
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Modern Premium Slate / Indigo Palette
const COLOR_PRIMARY = rgb(0.06, 0.09, 0.16);     // #0F172A (Deep Slate)
const COLOR_ACCENT = rgb(0.31, 0.27, 0.90);      // #4F46E5 (Indigo Accent)
const COLOR_SECONDARY = rgb(0.39, 0.45, 0.55);   // #64748B (Muted Slate)
const COLOR_TEXT_DARK = rgb(0.12, 0.16, 0.23);   // #1E293B (Body Text)
const COLOR_BG_LIGHT = rgb(0.97, 0.98, 0.99);    // #F8FAFC (Soft Container Fill)
const COLOR_BORDER = rgb(0.89, 0.91, 0.94);      // #E2E8F0 (Crisp Border)
const COLOR_GREEN = rgb(0.02, 0.59, 0.41);       // #059669 (Paid/Success)
const COLOR_RED = rgb(0.86, 0.15, 0.15);         // #DC2626 (Pending/Alert)
const COLOR_WHITE = rgb(1, 1, 1);

export async function generateReportPdf(report: Report): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  let font: PDFFont;
  let boldFont: PDFFont;
  let isUnicodeFont = false;

  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
    const bytes = await fs.promises.readFile(fontPath);
    font = await doc.embedFont(bytes);
    boldFont = font;
    isUnicodeFont = true;
  } catch (e) {
    font = await doc.embedFont(StandardFonts.Helvetica);
    boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    isUnicodeFont = false;
  }

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT;

  // Helpers
  const safeCurrency = (v: number | string) => formatCurrency(v).replace(/₹/g, "Rs. ");

  const sanitizeForWinAnsi = (s: string) => {
    if (isUnicodeFont || !s) return s;
    return String(s).replace(/[^\x00-\xFF]/g, "?");
  };

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

  const truncateText = (text: string, maxWidth: number, fontSize: number, isBold = false) => {
    const f = isBold ? boldFont : font;
    if (f.widthOfTextAtSize(text, fontSize) <= maxWidth) return text;
    let truncated = text;
    while (truncated.length > 0 && f.widthOfTextAtSize(truncated + "...", fontSize) > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  const drawTextRight = (
    p: PDFPage,
    text: string,
    f: PDFFont,
    size: number,
    rightX: number,
    textY: number,
    color = COLOR_TEXT_DARK
  ) => {
    const w = f.widthOfTextAtSize(text, size);
    p.drawText(text, { x: rightX - w, y: textY, size, font: f, color });
  };

  const drawWatermark = (p: PDFPage) => {
    p.drawText("KRISHI TRACTOR", {
      x: PAGE_WIDTH / 2 - 130,
      y: PAGE_HEIGHT / 2 - 20,
      size: 38,
      font: boldFont,
      color: rgb(0.92, 0.94, 0.96),
      opacity: 0.5,
    });
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < MARGIN + 25) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawWatermark(page);
      y = PAGE_HEIGHT - MARGIN;
      return true;
    }
    return false;
  };

  // Header Component
  const drawHeaderBanner = () => {
    // Top Color Stripe
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 6,
      width: PAGE_WIDTH,
      height: 6,
      color: COLOR_ACCENT,
    });

    // Branding
    page.drawText("KRISHI TRACTOR MANAGEMENT", {
      x: MARGIN,
      y: PAGE_HEIGHT - 32,
      size: 14,
      font: boldFont,
      color: COLOR_PRIMARY,
    });

    page.drawText("CUSTOMER STATEMENT & ACCOUNT REPORT", {
      x: MARGIN,
      y: PAGE_HEIGHT - 44,
      size: 7.5,
      font: boldFont,
      color: COLOR_SECONDARY,
    });

    // Date Range Badge (Right Side)
    const periodText = `${formatDate(reportData.range.startDate)} - ${formatDate(reportData.range.endDate)}`;
    drawTextRight(page, "STATEMENT PERIOD", boldFont, 7, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 30, COLOR_SECONDARY);
    drawTextRight(page, periodText, boldFont, 9, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 42, COLOR_PRIMARY);

    y = PAGE_HEIGHT - 58;
  };

  drawWatermark(page);
  drawHeaderBanner();

  // --- SECTION 1 & 2: Customer Box + Key Metrics (Compact Split Layout) ---
  const custWidth = CONTENT_WIDTH * 0.52;
  const metricsWidth = CONTENT_WIDTH * 0.46;
  const sectionHeight = 58;

  // Customer Info Box (Left)
  page.drawRectangle({
    x: MARGIN,
    y: y - sectionHeight,
    width: custWidth,
    height: sectionHeight,
    color: COLOR_BG_LIGHT,
    borderColor: COLOR_BORDER,
    borderWidth: 1,
  });

  const custY = y - 14;
  const customerName = reportData.customer?.name || "N/A";
  const customerAddress = reportData.customer?.address || "";
  const customerPhone = reportData.customer?.phone ? `Mob: ${reportData.customer.phone}` : "";

  page.drawText("STATEMENT FOR", { x: MARGIN + 10, y: custY, size: 7, font: boldFont, color: COLOR_SECONDARY });
  page.drawText(truncateText(customerName, custWidth - 20, 10, true), {
    x: MARGIN + 10,
    y: custY - 13,
    size: 10,
    font: boldFont,
    color: COLOR_PRIMARY,
  });

  const subDetails = [customerAddress, customerPhone].filter(Boolean).join(" | ");
  page.drawText(truncateText(subDetails || "No contact details provided", custWidth - 20, 8), {
    x: MARGIN + 10,
    y: custY - 26,
    size: 8,
    font,
    color: COLOR_SECONDARY,
  });

  // Metrics Box (Right Side - 3 Compact Columns)
  const metricsX = MARGIN + custWidth + (CONTENT_WIDTH * 0.02);
  const cardW = (metricsWidth - 10) / 3;

  const cards = [
    { label: "TOTAL WORK", value: safeCurrency(reportData.totalWork), color: COLOR_TEXT_DARK },
    { label: "TOTAL PAID", value: safeCurrency(reportData.totalPaid), color: COLOR_GREEN },
    { label: "DUE BALANCE", value: safeCurrency(reportData.pendingBalance), color: COLOR_RED },
  ];

  cards.forEach((card, i) => {
    const cX = metricsX + i * (cardW + 5);
    page.drawRectangle({
      x: cX,
      y: y - sectionHeight,
      width: cardW,
      height: sectionHeight,
      color: COLOR_BG_LIGHT,
      borderColor: COLOR_BORDER,
      borderWidth: 1,
    });

    page.drawText(card.label, { x: cX + 6, y: y - 14, size: 6.5, font: boldFont, color: COLOR_SECONDARY });
    page.drawText(truncateText(card.value, cardW - 8, 9.5, true), {
      x: cX + 6,
      y: y - 32,
      size: 9.5,
      font: boldFont,
      color: card.color,
    });
  });

  y -= sectionHeight + 18;

  // --- SECTION 3: Work History Table ---
  page.drawText("WORK HISTORY", { x: MARGIN, y, size: 10, font: boldFont, color: COLOR_PRIMARY });
  y -= 10;

  const workCols = [
    { label: "DATE", width: 75, align: "left" },
    { label: "SERVICE DETAILS", width: 183, align: "left" },
    { label: "QTY", width: 85, align: "left" },
    { label: "RATE", width: 80, align: "right" },
    { label: "AMOUNT", width: 100, align: "right" },
  ];

  const renderTableHeader = (cols: typeof workCols) => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 16,
      width: CONTENT_WIDTH,
      height: 16,
      color: COLOR_PRIMARY,
    });

    let currentX = MARGIN;
    cols.forEach((col) => {
      if (col.align === "right") {
        drawTextRight(page, col.label, boldFont, 7.5, currentX + col.width - 6, y - 11, COLOR_WHITE);
      } else {
        page.drawText(col.label, { x: currentX + 6, y: y - 11, size: 7.5, font: boldFont, color: COLOR_WHITE });
      }
      currentX += col.width;
    });
    y -= 16;
  };

  renderTableHeader(workCols);

  if (reportData.workEntries.length === 0) {
    y -= 16;
    page.drawText("No work records found for the selected period.", { x: MARGIN + 6, y: y - 10, size: 8.5, font, color: COLOR_SECONDARY });
    y -= 10;
  }

  reportData.workEntries.forEach((entry, index) => {
    ensureSpace(16);

    if (index % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: y - 15,
        width: CONTENT_WIDTH,
        height: 15,
        color: COLOR_BG_LIGHT,
      });
    }

    const qtyText = entry.service.unit === "KATHA" ? `${Number(entry.katha)} Katha` : `${Number(entry.decimalHour)} Hr`;
    const rowData = [
      formatDate(entry.date),
      truncateText(entry.service.name, 170, 8),
      qtyText,
      safeCurrency(Number(entry.rate)),
      safeCurrency(Number(entry.total)),
    ];

    let currentX = MARGIN;
    rowData.forEach((val, colIdx) => {
      const col = workCols[colIdx]!;
      if (col.align === "right") {
        drawTextRight(page, val, font, 8, currentX + col.width - 6, y - 11, COLOR_TEXT_DARK);
      } else {
        page.drawText(val, { x: currentX + 6, y: y - 11, size: 8, font, color: COLOR_TEXT_DARK });
      }
      currentX += col.width;
    });

    y -= 15;
  });

  y -= 18;

  // --- SECTION 4: Payment History Table ---
  ensureSpace(45);
  page.drawText("PAYMENT HISTORY", { x: MARGIN, y, size: 10, font: boldFont, color: COLOR_PRIMARY });
  y -= 10;

  const paymentCols = [
    { label: "DATE", width: 90, align: "left" },
    { label: "AMOUNT PAID", width: 110, align: "right" },
    { label: "REMARKS / NOTE", width: 323, align: "left" },
  ];

  renderTableHeader(paymentCols);

  if (reportData.payments.length === 0) {
    y -= 16;
    page.drawText("No payment transactions recorded for this period.", { x: MARGIN + 6, y: y - 10, size: 8.5, font, color: COLOR_SECONDARY });
    y -= 10;
  }

  reportData.payments.forEach((payment, index) => {
    ensureSpace(16);

    if (index % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: y - 15,
        width: CONTENT_WIDTH,
        height: 15,
        color: COLOR_BG_LIGHT,
      });
    }

    const rowData = [
      formatDate(payment.date),
      safeCurrency(Number(payment.amount)),
      truncateText(payment.note ?? "-", 310, 8),
    ];

    let currentX = MARGIN;
    rowData.forEach((val, colIdx) => {
      const col = paymentCols[colIdx]!;
      if (col.align === "right") {
        drawTextRight(page, val, boldFont, 8, currentX + col.width - 6, y - 11, COLOR_GREEN);
      } else {
        page.drawText(val, { x: currentX + 6, y: y - 11, size: 8, font, color: COLOR_TEXT_DARK });
      }
      currentX += col.width;
    });

    y -= 15;
  });

  // --- Global Footer ---
  const totalPages = doc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const p = doc.getPage(i);
    p.drawLine({
      start: { x: MARGIN, y: MARGIN + 10 },
      end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 10 },
      thickness: 0.5,
      color: COLOR_BORDER,
    });

    p.drawText("Computer Generated Statement — Krishi Tractor Management System", {
      x: MARGIN,
      y: MARGIN - 2,
      size: 7,
      font,
      color: COLOR_SECONDARY,
    });

    const pageStr = `Page ${i + 1} of ${totalPages}`;
    drawTextRight(p, pageStr, font, 7, PAGE_WIDTH - MARGIN, MARGIN - 2, COLOR_SECONDARY);
  }

  return doc.save();
}

// --- BACKUP REPORT GENERATOR ---
export async function generateBackupReportPdf(report: BackupReport): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  let font: PDFFont;
  let boldFont: PDFFont;
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
    const bytes = await fs.promises.readFile(fontPath);
    font = await doc.embedFont(bytes);
    boldFont = font;
  } catch {
    font = await doc.embedFont(StandardFonts.Helvetica);
    boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  }

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT;
  const safeCurrency = (v: number | string) => formatCurrency(v).replace(/₹/g, "Rs. ");

  const drawTextRight = (
    p: PDFPage,
    text: string,
    f: PDFFont,
    size: number,
    rightX: number,
    textY: number,
    color = COLOR_TEXT_DARK
  ) => {
    const w = f.widthOfTextAtSize(text, size);
    p.drawText(text, { x: rightX - w, y: textY, size, font: f, color });
  };

  // Top Bar Accent
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 6, width: PAGE_WIDTH, height: 6, color: COLOR_ACCENT });

  page.drawText("BACKUP SUMMARY REPORT", {
    x: MARGIN,
    y: PAGE_HEIGHT - 32,
    size: 14,
    font: boldFont,
    color: COLOR_PRIMARY,
  });

  page.drawText("System Master Ledger & Balances Overview", {
    x: MARGIN,
    y: PAGE_HEIGHT - 44,
    size: 7.5,
    font,
    color: COLOR_SECONDARY,
  });

  const periodText = `${formatDate(report.range.startDate)} - ${formatDate(report.range.endDate)}`;
  drawTextRight(page, "PERIOD COVERED", boldFont, 7, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 30, COLOR_SECONDARY);
  drawTextRight(page, periodText, boldFont, 8.5, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 42, COLOR_PRIMARY);

  y = PAGE_HEIGHT - 60;

  // Key Summary Cards (Row of 4)
  const cardW = (CONTENT_WIDTH - 15) / 4;
  const cardH = 42;

  const summaryItems = [
    { label: "CUSTOMERS", value: `${report.customerCount}`, color: COLOR_PRIMARY },
    { label: "TOTAL WORK", value: safeCurrency(report.totalWork), color: COLOR_TEXT_DARK },
    { label: "TOTAL RECEIVED", value: safeCurrency(report.totalPaid), color: COLOR_GREEN },
    { label: "TOTAL PENDING", value: safeCurrency(report.pendingBalance), color: COLOR_RED },
  ];

  summaryItems.forEach((item, i) => {
    const cX = MARGIN + i * (cardW + 5);
    page.drawRectangle({
      x: cX,
      y: y - cardH,
      width: cardW,
      height: cardH,
      color: COLOR_BG_LIGHT,
      borderColor: COLOR_BORDER,
      borderWidth: 1,
    });

    page.drawText(item.label, { x: cX + 6, y: y - 12, size: 6.5, font: boldFont, color: COLOR_SECONDARY });
    page.drawText(item.value, { x: cX + 6, y: y - 28, size: 9.5, font: boldFont, color: item.color });
  });

  y -= cardH + 18;

  // Backup Table
  const tableCols = [
    { label: "CUSTOMER NAME", width: 233, align: "left" },
    { label: "WORK TOTAL", width: 95, align: "right" },
    { label: "PAID TOTAL", width: 95, align: "right" },
    { label: "PENDING", width: 100, align: "right" },
  ];

  const drawTableHeader = () => {
    page.drawRectangle({ x: MARGIN, y: y - 16, width: CONTENT_WIDTH, height: 16, color: COLOR_PRIMARY });

    let currentX = MARGIN;
    tableCols.forEach((col) => {
      if (col.align === "right") {
        drawTextRight(page, col.label, boldFont, 7.5, currentX + col.width - 6, y - 11, COLOR_WHITE);
      } else {
        page.drawText(col.label, { x: currentX + 6, y: y - 11, size: 7.5, font: boldFont, color: COLOR_WHITE });
      }
      currentX += col.width;
    });

    y -= 16;
  };

  const ensureSpaceOnPage = (needed: number) => {
    if (y - needed < MARGIN + 25) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
      drawTableHeader();
    }
  };

  drawTableHeader();

  report.customers.forEach((customer, index) => {
    ensureSpaceOnPage(15);

    if (index % 2 === 0) {
      page.drawRectangle({ x: MARGIN, y: y - 15, width: CONTENT_WIDTH, height: 15, color: COLOR_BG_LIGHT });
    }

    let currentX = MARGIN;

    // Customer Name
    page.drawText(customer.name, { x: currentX + 6, y: y - 11, size: 8, font, color: COLOR_TEXT_DARK });
    currentX += tableCols[0]!.width;

    // Work Total
    drawTextRight(page, safeCurrency(customer.workTotal), boldFont, 8, currentX + tableCols[1]!.width - 6, y - 11, COLOR_TEXT_DARK);
    currentX += tableCols[1]!.width;

    // Paid Total
    drawTextRight(page, safeCurrency(customer.paidTotal), boldFont, 8, currentX + tableCols[2]!.width - 6, y - 11, COLOR_GREEN);
    currentX += tableCols[2]!.width;

    // Pending
    const pendingColor = customer.pending > 0 ? COLOR_RED : COLOR_GREEN;
    drawTextRight(page, safeCurrency(customer.pending), boldFont, 8, currentX + tableCols[3]!.width - 6, y - 11, pendingColor);

    y -= 15;
  });

  // Footer
  const totalPages = doc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const p = doc.getPage(i);
    p.drawLine({ start: { x: MARGIN, y: MARGIN + 10 }, end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 10 }, thickness: 0.5, color: COLOR_BORDER });
    p.drawText("Backup report generated by Krishi Tractor Management System", { x: MARGIN, y: MARGIN - 2, size: 7, font, color: COLOR_SECONDARY });
    const pageStr = `Page ${i + 1} of ${totalPages}`;
    drawTextRight(p, pageStr, font, 7, PAGE_WIDTH - MARGIN, MARGIN - 2, COLOR_SECONDARY);
  }

  return doc.save();
}