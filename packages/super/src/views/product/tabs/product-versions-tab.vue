<script>
import ApiProcessor from '@lib/processors/api-processor'
import VersionTabTable from './versions-tab.table.js'

export default {
  name: 'ProductVersionsTab',
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      table: VersionTabTable(this),
    }
  },
  computed: {
    path() {
      return `/products/${this.productId}/versions`
    }
  },
  created() {
    this.getVersions()
  },
  methods: {
    getVersions() {
      this.table.processor = new ApiProcessor({
        component: this,
        path: this.path
      })
    },
    onRowClick(row) {
      this.$router.push({
        name: 'product-version',
        params: {
          id: this.productId,
          versionId: row.id,
        }
      })
    },
  },
}
</script>

<template>
  <table-layout
    v-if="table.processor"
    table-name="product-versions"
    :processor="table.processor"
    :filters="table.filters"
    :columns="table.columns"
    :fragments="false"
    @row-click="onRowClick"
  />
</template>
