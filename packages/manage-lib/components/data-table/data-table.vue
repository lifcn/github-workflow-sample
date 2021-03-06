<script>
import startCase from 'lodash/startCase'
import get from 'lodash/get'
import DataProcessor from '../../processors/data-processor'
import CellWrap from './cells/cell-wrap'

const SORT_ORDERS = ['asc', 'desc', '']
const noop = () => {}

export function getReadyColumns (dataQuery, columns = []) {
  const columnsCount = columns.length
  const readyColumns = []

  if (dataQuery !== null) {
    const hide = dataQuery.hide || []

    for (let i=0; i<columnsCount; i++) {
      const column = columns[i]
      if (
        hide.indexOf(column.name) === -1 &&
        column.type !== 'expand'
      ) {
        readyColumns.push({
          label: startCase(column.name),
          width: 180,
          ...column,
        })
      }
    }
  }

  return readyColumns
}

export default {
  name: 'DataTable',
  components: {
    CellWrap,
  },
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      required: true,
    },
    processor: {
      type: DataProcessor,
      default: null,
    },
    summaryMethod: {
      type: Function,
      default: () => null,
    },
    highlightRow: {
      type: Function,
      default: () => false,
    },
    highlightInactiveRow: {
      type: Boolean,
      default: true,
    },
    greyOutRowText: {
      type: Function,
      default: () => false,
    },
    cellStyle: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      tableHeader: null,
    }
  },
  computed: {
    readyColumns() {
      const { dataQuery, columns } = this

      return getReadyColumns(dataQuery, columns)
    },
    showRowLink() {
      const listener = this.$listeners['row-click']
      return typeof listener === 'function'
    },
    dataQuery() {
      return this.processor.dataQuery
    },
    sort() {
      return this.dataQuery.sort
    },
    showHeader() {
      return Boolean(get(this.processor, 'data.length', false))
    },
    showSummary() {
      return this.summaryMethod() !== null
    },
    isExpanding() {
      return this.columns.some(item => item.type === 'expand')
    },
  },
  watch: {
    dataQuery(dataQuery) {
      this.$nextTick(() => this.syncSorting(dataQuery))
    },
  },
  mounted() {
    this.$nextTick(() => {
      const tableHeader = get(this.$refs, 'table.$refs.tableHeader')

      tableHeader.handleHeaderClick = this.onSortClick
      tableHeader.handleSortClick = noop

      this.tableHeader = tableHeader

      this.syncSorting(this.dataQuery)
    })
  },
  methods: {
    updatePage(page) {
      this.processor.updatePage(page)
    },
    syncSorting(dataQuery) {
      const { tableHeader } = this
      const { sort } = dataQuery

      tableHeader.columns.forEach(column => {
        if (sort.hasOwnProperty(column.property)) {
          column.order = sort[column.property].order
        } else if (sort._script && get(sort, '_script.script.params.column') === column.property) {
          column.order = sort._script.order
        } else {
          column.order = ''
        }
      })
    },
    onSortClick(e, column) {
      if (!column.sortable) {
        return
      }

      const columnData = this.readyColumns.find(col => col.name === column.property)
      const hasCustomSorting = columnData.hasOwnProperty('sorting')

      const index = SORT_ORDERS.indexOf(column.order)
      const newOrder = SORT_ORDERS[index >= 2 ? 0 : index + 1]

      this.processor.updateSort(column.property, newOrder, ( hasCustomSorting && columnData.sorting))

      column.order = newOrder
    },
    onRowClick(row) {
      this.$emit('row-click', row)
    },
    handleSelectionChange(value) {
      this.$emit('selection-change', value)
    },
    showOverflowTooltip(column) {
      return column.hasOwnProperty('overflowTooltip') ?
        column.overflowTooltip : true
    },
    sortType(column) {
      return column.hasOwnProperty('sortable') ? column.sortable : 'custom'
    },
    inactiveRowHover({ status }) {
      if (!this.highlightInactiveRow && status === 'inactive') {
        return true
      }
      return false
    },
    rowClassName({ row, rowIndex }) {
      const { showRowLink, $style, highlightRow, greyOutRowText } = this
      return `${showRowLink ? $style.rowActive : ''} ${highlightRow(row) ? $style.rowHighlighten : ''} ${this.inactiveRowHover(row) ? 'el-table__row-inactive' : ''} ${greyOutRowText(row) ? $style.greyText : ''}`
    },
  },
}
</script>

<template>
  <div class="data-table">
    <el-table
      ref="table"
      v-loading="processor.loading"
      :data="processor.data"
      header-cell-class-name="table-header-cell"
      :row-class-name="rowClassName"
      :class="[
        !showHeader && $style.headerHidden,
        $style.table
      ]"
      :summary-method="summaryMethod"
      :show-summary="showSummary"
      :cell-style="cellStyle"
      @row-click="onRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="column in readyColumns"
        :key="column.name"
        :align="column.align || 'left'"
        :label="column.label"
        :column-key="column.name"
        :prop="column.name"
        :fixed="column.fixed"
        :sortable="sortType(column)"
        :min-width="column.width"
        :show-overflow-tooltip="showOverflowTooltip(column)"
        :sorting="column.sorting"
      >
        <template #default="scope">
          <cell-wrap
            :attribute="column.name"
            :cell="scope"
            :column="column"
            :processor="processor"
          />
        </template>
      </el-table-column>
      <slot name="columns" />
      <el-table-column
        v-if="showRowLink"
        fixed="right"
        column-key="clickArrow"
        width="34"
      >
        <el-icon
          v-if="showRowLink"
          :class="$style.cellMore"
          name="arrow-right"
        />
      </el-table-column>
      <el-table-column
        v-if="isExpanding"
        type="expand"
        fixed="right"
      >
        <template slot-scope="props">
          <slot
            name="expandedRow"
            :row="props.row"
            :columns="columns"
          />
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="dataQuery && processor.pageCount > 1"
      :class="$style.tablePagination"
    >
      <el-pagination
        layout="prev, pager, next"
        :page-count="processor.pageCount"
        :current-page="dataQuery.page"
        @current-change="updatePage"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.tablePagination {
  width: 100%;
  margin: 40px auto;
  text-align: center;
}

.cellMore {
  color: var(--color-primary);
}

.table {
  :global(td) {
    padding: 0;
  }
}

.rowActive {
  cursor: pointer;
}

.headerHidden {

  &:before {
    content: none;
  }

  :global(.el-table__header-wrapper) {
    display: none;
  }
}

.rowHighlighten {
  background-color: #f2f9ff !important;
}

.greyText {
  color: #A4A6AB;
}
</style>

<style lang="scss">

.data-table {
  .el-table__footer-wrapper tbody td {
    font-size: 0.9rem;
    background-color: white;
  }

  .cell.el-tooltip {
    font-size: 0.9rem;
  }
}

.table-header-cell {

  .cell {
    overflow: visible !important;
    font-weight: normal !important;
    white-space: nowrap !important;
  }

  .caret-wrapper {
    width: 18px !important;
    height: 18px !important;
    margin-left: 5px;

    &:after {
      position: absolute;
      top: 50%;
      right: 2px;
      margin-top: -11px;
      font-family: element-icons, Arial, sans-serif !important;
      font-size: 14px;
      color: #909399;
      content: '\e790';
    }

    .sort-caret {
      display: none;
    }
  }

  &.desc {
    .caret-wrapper {
      &:after {
        color: var(--color-primary);
      }
    }
  }

  &.asc {
    .caret-wrapper {
      &:after {
        color: var(--color-primary);
        transform: rotateZ(180deg);
      }
    }
  }
}

:global{
  .el-table__expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: 50% 50%;
  }

  .el-table__expand-icon > .el-icon {
    position: static;
    margin: 0;
    transform: rotate(90deg);
  }

  .el-table__expand-icon--expanded {
    transform: rotate(-180deg);
  }

  .el-table__row-inactive.hover-row > td {
    cursor: default !important;
    // https://github.com/ElemeFE/element/issues/4321#issuecomment-509666915
    background-color: initial !important;
  }

  .el-table__row-inactive .el-icon-arrow-right {
    color: #a7a7a7;
    cursor: default;
  }

}

</style>
