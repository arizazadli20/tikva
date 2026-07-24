"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  /** Pass the drag handle class here so react-grid-layout picks it up */
  dragHandleClass?: string;
};

export default function WidgetCard({ title, children, dragHandleClass = "widget-header" }: Props) {
  return (
    <div className="widget-card">
      {/* Drag handle — react-grid-layout targets this class */}
      <div className={dragHandleClass}>
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}>
          {title}
        </span>
        {/* Six-dot drag grip */}
        <svg
          className="drag-dots"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="4"  cy="3"  r="1.3" fill="#aaa"/>
          <circle cx="10" cy="3"  r="1.3" fill="#aaa"/>
          <circle cx="4"  cy="7"  r="1.3" fill="#aaa"/>
          <circle cx="10" cy="7"  r="1.3" fill="#aaa"/>
          <circle cx="4"  cy="11" r="1.3" fill="#aaa"/>
          <circle cx="10" cy="11" r="1.3" fill="#aaa"/>
        </svg>
      </div>

      {/* Scrollable content area */}
      <div className="widget-body">
        {children}
      </div>
    </div>
  );
}
