import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * One column definition drives two completely different layouts:
 *
 *   ≥640px — a real <table>, dense and scannable on a laptop.
 *   <640px — a stack of tap-friendly cards.
 *
 * A horizontally-scrolling table on a phone is unusable: you can't compare
 * values that never share a screen, and the scroll competes with the page's.
 * `slot` says where each column lands in the mobile card instead of trying to
 * cram the grid into 360px.
 */
export type ColumnSlot =
  | "title" // primary line, bold
  | "meta" // muted line under the title, joined by "·"
  | "value" // right-aligned emphasis (money)
  | "detail" // label/value pair in the card's lower grid
  | "hidden"; // desktop-only

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Placement inside the mobile card. Defaults to "detail". */
  slot?: ColumnSlot;
  headClassName?: string;
  cellClassName?: string;
  /** Right-align in the desktop table (use for money and counts). */
  numeric?: boolean;
}

interface DataViewProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Rendered in the last table column and the card's action row. */
  actions?: (row: T) => React.ReactNode;
  /** Shown when `rows` is empty — pass an <EmptyState />. */
  empty?: React.ReactNode;
  className?: string;
  /** Wraps each mobile card and desktop row (e.g. to link the whole row). */
  onRowHref?: (row: T) => string | undefined;
}

export function DataView<T>({
  rows,
  columns,
  rowKey,
  actions,
  empty,
  className,
}: DataViewProps<T>) {
  if (rows.length === 0) return <>{empty}</>;

  const bySlot = (slot: ColumnSlot) =>
    columns.filter((c) => (c.slot ?? "detail") === slot);

  const titles = bySlot("title");
  const metas = bySlot("meta");
  const values = bySlot("value");
  const details = bySlot("detail");

  return (
    <div className={className}>
      {/* ---------- Mobile: card list ---------- */}
      <ul className="flex flex-col gap-2.5 sm:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            className="rounded-xl border border-border bg-card p-3.5 shadow-elev-1 transition-ui active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {titles.map((c) => (
                  <div key={c.id} className="truncate font-semibold leading-tight">
                    {c.cell(row)}
                  </div>
                ))}
                {metas.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[0.8125rem] text-muted-foreground">
                    {metas.map((c, i) => (
                      <React.Fragment key={c.id}>
                        {i > 0 && <span aria-hidden>·</span>}
                        <span className="truncate">{c.cell(row)}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {values.length > 0 && (
                <div className="shrink-0 text-right">
                  {values.map((c) => (
                    <div key={c.id} className="font-semibold tabular-nums">
                      {c.cell(row)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(details.length > 0 || actions) && (
              <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/70 pt-3">
                <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-1.5 text-[0.8125rem] xs:grid-cols-3">
                  {details.map((c) => (
                    <div key={c.id} className="min-w-0">
                      <dt className="truncate text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
                        {c.header}
                      </dt>
                      <dd className="truncate font-medium tabular-nums">{c.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
                {actions && <div className="flex shrink-0 items-center gap-0.5">{actions(row)}</div>}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* ---------- Desktop: real table ---------- */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((c) => (
                <TableHead
                  key={c.id}
                  className={cn(c.numeric && "text-right", c.headClassName)}
                  scope="col"
                >
                  {c.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-24 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((c) => (
                  <TableCell
                    key={c.id}
                    className={cn(c.numeric && "text-right tabular-nums", c.cellClassName)}
                  >
                    {c.cell(row)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-0.5">{actions(row)}</div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
