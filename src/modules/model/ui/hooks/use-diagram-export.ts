"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { getElementTypeInfo, getElementVisual } from "../helpers/element";
import {
  getEdgeVisual,
  getRelationshipTypeInfo,
} from "../helpers/relationship";
import { useCanvasStore } from "../stores/canvas";
import type { LayerInfo } from "../types/layer";

type UseDiagramExportOptions = {
  diagramName: string;
  projectName: string;
  layer: LayerInfo;
};

/**
 * useDiagramExport
 *
 * دو نوع خروجی ارائه می‌دهد:
 * - exportJson: دانلود فایل JSON با داده‌های کامل دیاگرام
 * - exportHtml: باز کردن صفحه قابل‌چاپ (Print / PDF)
 */
export function useDiagramExport({
  diagramName,
  projectName,
  layer,
}: UseDiagramExportOptions) {
  const diagramId = useCanvasStore((state) => state.diagramId);
  const nodes = useCanvasStore(useShallow((state) => state.nodes));
  const edges = useCanvasStore(useShallow((state) => state.edges));

  const exportJson = useCallback(() => {
    const payload = {
      meta: {
        diagramId,
        diagramName,
        projectName,
        layer: layer.value,
        layerFa: layer.labelFa,
        exportedAt: new Date().toISOString(),
      },
      elements: nodes.map((n) => ({
        id: n.data.elementId,
        name: n.data.name,
        type: n.data.elementType,
        status: n.data.status,
        description: n.data.description,
        position: n.position,
      })),
      relationships: edges.map((e) => ({
        id: e.data?.relationshipId,
        name: e.data?.name,
        type: e.data?.relationshipType,
        sourceElementId: e.source,
        targetElementId: e.target,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${diagramName.replace(/\s+/g, "_")}_${layer.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [diagramName, projectName, layer, diagramId, edges, nodes]);

  const exportHtml = useCallback(() => {
    const date = new Date().toLocaleDateString("fa-IR");

    const elementsRows = nodes
      .map((node) => {
        const spec = getElementVisual(node.data.elementType);
        const statusLabel = {
          DRAFT: "پیش‌نویس",
          VALIDATED: "اعتبارسنجی‌شده",
          DEPRECATED: "منسوخ",
        }[node.data.status];

        return `
        <tr>
          <td>
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${spec.fillColor};border:1px solid ${spec.strokeColor};margin-left:6px"></span>
            ${escapeHtml(node.data.name)}
          </td>
          <td>${escapeHtml(getElementTypeInfo(node.data.elementType).labelFa)}</td>
          <td>${statusLabel}</td>
          <td>${escapeHtml(node.data.description || "—")}</td>
        </tr>`;
      })
      .join("");

    const edgesRows = edges
      .map((edge) => {
        if (!edge.data) return "";
        const spec = getEdgeVisual(edge.data.relationshipType);

        const relationshipInfo = getRelationshipTypeInfo(
          edge.data.relationshipType,
        );

        const srcName =
          nodes.find((n) => n.id === edge.source)?.data.name ?? edge.source;
        const tgtName =
          nodes.find((n) => n.id === edge.target)?.data.name ?? edge.target;

        return `
        <tr>
          <td>
            <span style="display:inline-block;width:20px;height:3px;background:${spec.strokeColor};margin-left:6px;vertical-align:middle"></span>
            ${escapeHtml(edge.data?.name || relationshipInfo.labelFa)}
          </td>
          <td>${escapeHtml(relationshipInfo.labelFa)}</td>
          <td>${escapeHtml(srcName)}</td>
          <td>${escapeHtml(tgtName)}</td>
        </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(diagramName)} — ${layer.value}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Vazirmatn", Tahoma, sans-serif; font-size: 13px; color: #1a1a1a; padding: 32px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 28px; }
    .layer-badge {
      display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;
      margin-right: 8px;
      background: #e8f0fe; color: #1a56db; border: 1px solid #1a56db;
    }
    h2 { font-size: 16px; font-weight: 600; margin: 24px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e5e7eb; padding: 7px 10px; text-align: right; vertical-align: middle; }
    th { background: #f9fafb; font-weight: 600; }
    tr:nth-child(even) td { background: #fafafa; }
    .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
    @media print {
      body { padding: 16px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(diagramName)}</h1>
  <div class="meta">
    <span class="layer-badge">${layer.value} — ${escapeHtml(layer.labelFa)}</span>
    پروژه: <strong>${escapeHtml(projectName)}</strong> &nbsp;|&nbsp; تاریخ خروجی: ${date}
  </div>

  <button onclick="window.print()" style="margin-bottom:20px;padding:6px 16px;background:#1a56db;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit">
    چاپ / ذخیره PDF
  </button>

  <h2>المنت‌ها (${nodes.length})</h2>
  ${
    nodes.length === 0
      ? "<p style='color:#999;font-size:12px'>هیچ المنتی در دیاگرام وجود ندارد.</p>"
      : `
  <table>
    <thead><tr><th>نام</th><th>نوع</th><th>وضعیت</th><th>توضیحات</th></tr></thead>
    <tbody>${elementsRows}</tbody>
  </table>`
  }

  <h2>روابط (${edges.length})</h2>
  ${
    edges.length === 0
      ? "<p style='color:#999;font-size:12px'>هیچ رابطه‌ای تعریف نشده است.</p>"
      : `
  <table>
    <thead><tr><th>نام</th><th>نوع</th><th>مبدأ</th><th>مقصد</th></tr></thead>
    <tbody>${edgesRows}</tbody>
  </table>`
  }
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w)
      w.addEventListener("load", () => URL.revokeObjectURL(url), {
        once: true,
      });
  }, [diagramName, projectName, layer, nodes, edges]);

  return { exportJson, exportHtml };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
