import { useQueryClient } from "@tanstack/react-query";
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/modules/shared/ui/libs/cn";
import { getClassDiagramByIdKey } from "../../../clients/get-class-diagram-by-id";
import { useUpdateClassElement } from "../../../clients/update-class-element";
import {
  CLASS_VISIBILITY_INFO,
  getClassElementTypeInfo,
} from "../../../constants/class-diagram";
import {
  canHaveAttributes,
  canHaveOperations,
} from "../../../helpers/class-diagram";
import { useCanvasStore } from "../../../stores/canvas";
import type { ClassNodeData } from "../../../stores/class-canvas";

type ClassNodeType = Node<ClassNodeData>;
type PropertyItem = NonNullable<ClassNodeData["properties"]>[number];
type OperationItem = NonNullable<ClassNodeData["operations"]>[number];
type LiteralItem = NonNullable<ClassNodeData["enumerationLiterals"]>[number];

/**
 * ClassNode — Capella-style UML Class Diagram Node
 * Supports: CLASS, INTERFACE, ENUM, DATA_TYPE, PRIMITIVE, COLLECTION, UNION
 * Features: 3 compartments (name, attributes, operations), stereotype, visibility, derived, static, abstract
 */
function ClassNodeComponent({ data, selected }: NodeProps<ClassNodeType>) {
  const typeInfo = getClassElementTypeInfo(data.elementType);
  const isInterface = data.elementType === "INTERFACE";
  const isEnum = data.elementType === "ENUM";
  const isDataType = ["DATA_TYPE", "PRIMITIVE", "COLLECTION", "UNION"].includes(
    data.elementType,
  );

  // Inline validation
  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    if (!data.name || data.name.trim() === "") {
      issues.push("Name cannot be empty");
    }
    if (data.status === "DEPRECATED") {
      issues.push("Deprecated element");
    }
    if (isInterface && (!data.operations || data.operations.length === 0)) {
      issues.push("Interface has no operations");
    }
    if (
      isEnum &&
      (!data.enumerationLiterals || data.enumerationLiterals.length === 0)
    ) {
      issues.push("Enumeration has no literals");
    }
    if (
      data.elementType === "CLASS" &&
      (!data.properties || data.properties.length === 0) &&
      (!data.operations || data.operations.length === 0)
    ) {
      issues.push("Class has no attributes or operations");
    }
    if (
      data.elementType === "DATA_TYPE" &&
      (!data.properties || data.properties.length === 0)
    ) {
      issues.push("Data type has no attributes");
    }
    if (
      data.elementType === "UNION" &&
      (!data.properties || data.properties.length === 0)
    ) {
      issues.push("Union has no attributes");
    }
    return issues;
  }, [data, isInterface, isEnum]);

  const hasError = validationIssues.some(
    (i) => i.includes("empty") || i.includes("cannot"),
  );
  const hasWarning = validationIssues.some(
    (i) =>
      i.includes("Deprecated") ||
      i.includes("no operations") ||
      i.includes("no literals") ||
      i.includes("no attributes"),
  );

  const [showAttributes, setShowAttributes] = useState(true);
  const [showOperations, setShowOperations] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const diagramId = useCanvasStore((s) => s.diagramId);
  const updateClassElement = useUpdateClassElement();
  const queryClient = useQueryClient();

  const attrs = canHaveAttributes(data.elementType)
    ? (data.properties ?? [])
    : [];
  const ops = canHaveOperations(data.elementType)
    ? (data.operations ?? [])
    : [];
  const enumLiterals = data.enumerationLiterals ?? [];

  const visibleAttrs = showAttributes ? attrs : [];
  const visibleOps = showOperations ? ops : [];

  const formatAttribute = (prop: PropertyItem) => {
    const vis =
      CLASS_VISIBILITY_INFO[
        prop.visibility as keyof typeof CLASS_VISIBILITY_INFO
      ]?.symbol ?? "+";
    const derived = prop.isDerived ? "/" : "";
    const static_ = prop.isStatic ? "$" : "";
    const readOnly = prop.isReadOnly ? "{readOnly}" : "";
    const id = prop.isID ? "{id}" : "";
    const type = prop.typeClassElementId ? prop.typeLiteral : prop.typeLiteral;
    const mult =
      prop.multiplicityLower !== 1 || prop.multiplicityUpper !== "1"
        ? ` [${prop.multiplicityLower}..${prop.multiplicityUpper === "*" ? "*" : prop.multiplicityUpper}]`
        : "";
    const def = prop.defaultValue ? ` = ${prop.defaultValue}` : "";
    return `${vis} ${derived}${static_}${prop.name}: ${type}${mult}${def} ${readOnly}${id}`.trim();
  };

  const formatOperation = (op: OperationItem) => {
    const vis =
      CLASS_VISIBILITY_INFO[op.visibility as keyof typeof CLASS_VISIBILITY_INFO]
        ?.symbol ?? "+";
    const abstract = op.isAbstract ? "{abstract}" : "";
    const static_ = op.isStatic ? "$" : "";
    const query = op.isQuery ? "{query}" : "";
    const params = (op.parameters ?? [])
      .map((p) => {
        const pVis =
          CLASS_VISIBILITY_INFO[
            p.direction as keyof typeof CLASS_VISIBILITY_INFO
          ]?.symbol ?? "in";
        const pType = p.typeClassElementId ? p.typeLiteral : p.typeLiteral;
        return `${pVis} ${p.name}: ${pType}`;
      })
      .join(", ");
    const ret = op.returnTypeLiteral ? `: ${op.returnTypeLiteral}` : "";
    return `${vis} ${static_}${op.name}(${params})${ret} ${abstract}${query}`.trim();
  };

  const formatEnumLiteral = (lit: LiteralItem) => {
    return lit.value && lit.value !== lit.name
      ? `${lit.name} = ${lit.value}`
      : lit.name;
  };

  const getStereotype = () => {
    switch (data.elementType) {
      case "INTERFACE":
        return "«interface»";
      case "ENUM":
        return "«enumeration»";
      case "DATA_TYPE":
        return "«dataType»";
      case "PRIMITIVE":
        return "«primitive»";
      case "COLLECTION":
        return "«collection»";
      case "UNION":
        return "«union»";
      default:
        return "";
    }
  };

  const handleDoubleClickName = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditName(data.name);
      setIsEditingName(true);
      setTimeout(() => inputRef.current?.select(), 10);
    },
    [data.name],
  );

  const handleSaveName = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== data.name) {
      updateClassElement.mutate(
        { id: data.elementId, modelId: data.modelId, name: trimmed },
        {
          onSuccess: () => {
            updateNodeData(data.elementId, { ...data, name: trimmed });
            queryClient.invalidateQueries({
              queryKey: ["class-elements", data.modelId],
            });
            if (diagramId) {
              queryClient.invalidateQueries({
                queryKey: getClassDiagramByIdKey(diagramId),
              });
            }
          },
          onError: ({ message }: { message: string }) => {
            toast.error(message || "Failed to rename element");
          },
        },
      );
    }
    setIsEditingName(false);
  }, [
    editName,
    data,
    updateNodeData,
    updateClassElement,
    queryClient,
    diagramId,
  ]);

  const nameStyle = {
    color: typeInfo.color,
    fontStyle: data.isAbstract ? "italic" : "normal",
    fontWeight: 600,
  };

  return (
    <div
      className={cn(
        "relative min-w-[180px] max-w-[280px] rounded-md border-2 bg-background select-none",
        selected && "shadow-[0_0_0_2px_hsl(var(--primary))]",
        data.status === "DEPRECATED" && "opacity-60",
        isDataType && "rounded-lg",
      )}
      style={{ borderColor: typeInfo.color }}
    >
      {/* Type Label */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-1 text-[8px] font-medium uppercase tracking-wider">
        {getStereotype()}
      </span>

      {/* Validation Indicator */}
      {(hasError || hasWarning) && (
        <span
          className={cn(
            "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-background z-10",
            hasError ? "bg-red-500" : "bg-yellow-500",
          )}
          title={validationIssues.join("\n")}
        />
      )}

      {/* Compartment: Name */}
      <div
        className="border-b px-3 py-1.5 text-center"
        style={{ borderColor: typeInfo.color }}
        onDoubleClick={handleDoubleClickName}
      >
        {isEditingName ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setIsEditingName(false);
            }}
            className="w-full bg-transparent text-center text-[11px] font-semibold outline-none border-b border-current"
            style={{ color: typeInfo.color }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center justify-center gap-1">
            <span style={nameStyle} className="text-[11px] truncate">
              {data.name}
            </span>
            {data.isAbstract && (
              <span
                className="text-[8px] text-muted-foreground"
                title="Abstract"
              >
                ⓐ
              </span>
            )}
            {data.isStatic && (
              <span className="text-[8px] text-muted-foreground" title="Static">
                $
              </span>
            )}
          </div>
        )}
      </div>

      {/* Compartment: Attributes */}
      {(visibleAttrs.length > 0 || enumLiterals.length > 0) && (
        <div
          className="border-b px-2 py-1"
          style={{ borderColor: typeInfo.color }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wider">
              {isEnum ? "Literals" : "Attributes"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAttributes(!showAttributes);
              }}
              type="button"
              className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
              title={showAttributes ? "Hide attributes" : "Show attributes"}
            >
              {showAttributes ? "−" : "+"}
            </button>
          </div>
          {showAttributes && (
            <div className="text-[9px] font-mono leading-tight text-foreground/80">
              {isEnum
                ? enumLiterals.map((lit, i) => (
                    <div key={lit.id ?? i} className="truncate">
                      {formatEnumLiteral(lit)}
                    </div>
                  ))
                : visibleAttrs.map((attr, i) => (
                    <div key={attr.id ?? i} className="truncate">
                      {formatAttribute(attr)}
                    </div>
                  ))}
            </div>
          )}
        </div>
      )}

      {/* Compartment: Operations */}
      {visibleOps.length > 0 && (
        <div className="px-2 py-1" style={{ borderColor: typeInfo.color }}>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wider">
              Operations
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOperations(!showOperations);
              }}
              type="button"
              className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
              title={showOperations ? "Hide operations" : "Show operations"}
            >
              {showOperations ? "−" : "+"}
            </button>
          </div>
          {showOperations && (
            <div className="text-[9px] font-mono leading-tight text-foreground/80">
              {visibleOps.map((op, i) => (
                <div key={op.id ?? i} className="truncate">
                  {formatOperation(op)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state for no attributes/operations */}
      {attrs.length === 0 && ops.length === 0 && enumLiterals.length === 0 && (
        <div className="px-3 py-2 text-center text-[9px] text-muted-foreground/60 italic">
          {isEnum
            ? "No literals"
            : data.elementType === "DATA_TYPE" || data.elementType === "UNION"
              ? "No fields"
              : "No members"}
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="size-2! border! border-current! bg-background!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="size-2! border! border-current! bg-background!"
      />
    </div>
  );
}

export const ClassNode = memo(ClassNodeComponent);
