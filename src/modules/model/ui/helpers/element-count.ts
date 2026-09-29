export type ElementTypeCounts = Record<string, number>;

function countBy<T>(
  items: ReadonlyArray<T>,
  select: (item: T) => string,
): ElementTypeCounts {
  const counts: ElementTypeCounts = {};
  for (const item of items) {
    const key = select(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function countElementsByType(
  elements: ReadonlyArray<{ type: string }>,
): ElementTypeCounts {
  return countBy(elements, (element) => element.type);
}

export function countClassElementsByType(
  elements: ReadonlyArray<{ elementType: string }>,
): ElementTypeCounts {
  return countBy(elements, (element) => element.elementType);
}

export function getElementTypeCount(
  counts: ElementTypeCounts | undefined,
  type: string,
): number {
  return counts?.[type] ?? 0;
}
