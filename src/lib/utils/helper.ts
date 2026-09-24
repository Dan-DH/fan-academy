import { Avatar, Style } from "@dicebear/core";
import definition from '@dicebear/styles/lorelei-neutral.json' with { type: 'json' };

const avatarStyle = new Style(definition);

export const generateAvatar = (userName: string): string => {
    const avatar = new Avatar(avatarStyle,{
            seed: userName
        }).toDataUri();
        return avatar;
}

export const perPageItems = [10, 20, 50, 999999999999]

export const getNumberOfPages = (arrayLength: number, perPageNumber: number): number => {
  if (perPageNumber <= 0) return 1;
  return Math.ceil(arrayLength / perPageNumber) || 1;
};

export type PageItem = number | "...";

export function getPaginationRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number = 1
): PageItem[] {
  const totalNumbersToShow = siblingCount * 2 + 5;
  if (totalPages <= totalNumbersToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, "...", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, "...", ...middleRange, "...", totalPages];
}
