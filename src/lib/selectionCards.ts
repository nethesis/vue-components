//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

// Size-dependent classes shared by the card layouts of NeRadioSelection and NeCheckboxCards, so
// that the two components keep the same spacing

export type SelectionCardSize = 'md' | 'lg' | 'xl'

// the gap separates the icon or image from the text
export const selectionCardClasses: Record<SelectionCardSize, string> = {
  md: 'gap-x-2 px-4 py-2',
  lg: 'gap-x-3 px-5 py-4',
  xl: 'gap-x-4 px-6 py-5'
}

// box holding either the icon or the image, so that the text starts at the same offset
export const selectionCardMediaClasses: Record<SelectionCardSize, string> = {
  md: 'size-7',
  lg: 'size-10',
  xl: 'size-12'
}

// icons are narrower than the box, which keeps them smaller than images
export const selectionCardIconClasses: Record<SelectionCardSize, string> = {
  md: 'h-full w-5',
  lg: 'h-full w-7',
  xl: 'h-full w-7'
}

export const selectionCardTextClasses: Record<SelectionCardSize, string> = {
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base'
}

// right padding of the text that leaves room for the selection mark, 12px away from it
export const selectionCardMarkSpaceClass = 'pr-5'

export const selectionCardMarkClasses: Record<SelectionCardSize, string> = {
  md: 'right-2 top-2 h-4 w-4',
  lg: 'right-3 top-3 h-4 w-4',
  xl: 'right-3 top-3 h-5 w-5'
}
