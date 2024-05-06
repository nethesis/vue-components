<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { type PropType } from 'vue'
import NeTableHead from './NeTableHead.vue'
import NeTableHeadCell from './NeTableHeadCell.vue'
import NeSkeleton from './NeSkeleton.vue'
import NeTableBody from './NeTableBody.vue'
import NeTableRow from './NeTableRow.vue'
import NeTableCell from './NeTableCell.vue'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

defineProps({
  rows: {
    type: Number,
    required: true
  },
  columns: {
    type: Number,
    required: true
  },
  cardBreakpoint: {
    type: String as PropType<Breakpoint>,
    default: 'md'
  }
})
</script>
<template>
  <NeTableHead :card-breakpoint="cardBreakpoint">
    <NeTableHeadCell v-for="i in columns" :key="i">
      <NeSkeleton size="lg" />
    </NeTableHeadCell>
  </NeTableHead>
  <NeTableBody :card-breakpoint="cardBreakpoint">
    <NeTableRow v-for="i in rows" :key="i" :card-breakpoint="cardBreakpoint">
      <NeTableCell v-for="j in columns" :key="j" :card-breakpoint="cardBreakpoint" data-label="">
        <NeSkeleton size="lg" />
      </NeTableCell>
    </NeTableRow>
  </NeTableBody>
</template>
