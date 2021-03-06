<script>
import FragmentsManager from './features/fragments-manager.vue'
import ColumnsHider from './features/columns-hider.vue'
import DataExporter from './features/data-exporter/data-exporter.vue'
import QuantityPicker from './features/quantity-picker.vue'

export default {
  name: 'TableLayout',
  components: {
    FragmentsManager,
    ColumnsHider,
    DataExporter,
    QuantityPicker,
  },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '',
    },
    shadow: {
      type: String,
      default: 'always',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: [Boolean, Array],
      default: false,
    },
    hider: {
      type: Boolean,
      default: true,
    },
    exporter: {
      type: Boolean,
      default: true,
    },
    fragments: {
      type: Boolean,
      default: true,
    },
    tableControls: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<template>
  <el-card
    :class="$style.layout"
    :shadow="shadow"
  >
    <slot
      slot="header"
      name="header"
    >
      <span v-if="title">
        {{ title }}
      </span>
    </slot>
    <div
      v-if="tableControls"
      :class="$style.subheader"
    >
      <div
        v-if="$slots.actions"
        :class="$style.actions"
      >
        <slot name="actions" />
      </div>
      <div :class="$style.filter">
        <data-filter
          v-if="$attrs.filters"
          :processor="$attrs.processor"
          :filters="$attrs.filters"
          :initial-filters="$attrs['initial-filters']"
          v-on="$listeners"
        />
      </div>
      <div :class="$style.features">
        <slot name="features" />
        <fragments-manager
          v-if="fragments"
          v-bind="$attrs"
        />
        <columns-hider
          v-if="hider"
          v-bind="$attrs"
        />
        <quantity-picker
          v-if="quantity"
          :quantity="quantity"
          v-bind="$attrs"
        />
        <data-exporter
          v-if="exporter"
          v-bind="$attrs"
        />
      </div>
    </div>
    <div
      :class="[
        $style.tableWrapper,
        {[$style.tableWrapperFlat]: flat}
      ]"
    >
      <data-table
        :columns="$attrs.columns"
        :processor="$attrs.processor"
        :summary-method="$attrs['summary-method']"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot slot="columns" />
        <template
          slot="expandedRow"
          slot-scope="{ row, columns }"
        >
          <slot
            name="expandedRow"
            :row="row"
            ,
            :columns="columns"
          />
        </template>
      </data-table>
    </div>
    <div
      v-if="$slots.note"
      :class="$style.tableNote"
    >
      <slot name="note" />
    </div>
  </el-card>
</template>

<style lang="scss" module>

.subheader {
  display: flex;
  align-items: flex-start;
  padding: 0.5rem 3rem;
  background: #f9fafc;

  @include mq($until: md) {
    padding: 0.5rem;
  }
}

.layout {
  margin-bottom: 2rem;
  overflow: visible !important;
  // box-shadow: 0 2px 12px 0 rgba(black, 0.05) !important;

  :global(.el-card__body) {
    padding: 0;
  }
}

.tableWrapper, .tableNote {
  padding: 1rem 3rem;

  @include mq($until: md) {
    padding: 1rem 0.5rem;
  }
}

.tableWrapperFlat {
  padding: 1rem 0;
}

.tableNote {
  padding-bottom: 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #909399;
}

.filter {
  flex-grow: 1;
}

.features {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 3.375rem;
}

.actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 3.375rem;
  margin-right: 1rem;
}

</style>
