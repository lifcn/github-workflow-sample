<script>
import { mapActions } from 'vuex'
import ApiProcessor from '@lib/processors/api-processor'
import catalogueTable from './catalogue.table.js'
import CatalogueHeader from './catalogue-header.vue'
import LinkModal from './link-modal.vue'
import getExportedFilename from '../../utils/get-exported-filename'

export default {
  name: 'Catalogue',
  page: {
    title: 'Client',
  },
  components: {
    CatalogueHeader,
    LinkModal,
  },
  data() {
    return {
      loading: true,
      table: catalogueTable,
      isEdit: false,
      catalogue: {},
      selectedItems: [],
      activeTab: 'linked',
      tabs: [
        { label: 'Linked', name: 'linked' },
        { label: 'Unlinked', name: 'unlinked' },
      ],
    }
  },
  computed: {
    catalogueId() {
      return this.$route.params.id
    },
    linked() {
      return this.activeTab === 'linked' ? 'true' : 'false'
    },
    path() {
      return `/catalogues/${this.catalogueId}/merchants?filters[attached]=${
        this.linked
      }`
    },
  },
  created() {
    this.activeTab = this.$route.params.tab || 'linked'
    this.getMerchantOffers()
    this.getCatalogue()
  },
  methods: {
    ...mapActions('catalogues', ['getMerchantFromCatalogue']),
    async getCatalogue() {
      const [, result] = await this.getMerchantFromCatalogue(this.$route.params.id)
      if (result) {
        this.catalogue = result
      }
      this.loading = false
    },
    getMerchantOffers() {
      this.table.processor = new ApiProcessor({
        component: this,
        path: this.path,
        query: { pageSize: 25 }
      })
    },
    onRowClick(row) {
      this.$router.push({
        name: 'merchant-details',
        params: { id: row.id },
      })
    },
    onTabClick() {
      this.selectedItems = []
      this.$router.push({
        name: 'catalogue-details',
        params: {
          id: this.$route.params.id,
          tab: this.activeTab === 'linked' ? null : this.activeTab,
        },
        query: {},
      })

      this.getMerchantOffers()
    },
    handleSelectionChange(value) {
      this.selectedItems = value
    },
    getExportedFilename() {
      const { tableName } = this.table[this.activeTab]

      return getExportedFilename(tableName)
    }
  },
}
</script>

<template>
  <main-layout
    :title="catalogue.name"
    :loading="loading"
    :back="{ name: 'catalogues' }"
  >
    <el-card
      :class="$style.card"
      body-style="padding: 0"
    >
      <catalogue-header
        :processor="table.processor"
        :catalogue="catalogue"
        @catalogues-updated="getCatalogue"
      />
      <el-tabs
        v-model="activeTab"
        :class="$style.tabs"
        @tab-click="onTabClick"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <table-layout
            :class="$style.table"
            shadow="never"
            :processor="table.processor"
            :filters="table[activeTab].filters"
            :columns="table[activeTab].columns"
            :fragments="false"
            :table-name="table[activeTab].tableName"
            :export-filename="getExportedFilename"
            hider
            :quantity="[25, 50, 100, 200]"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          >
            <link-modal
              :id="catalogue.id"
              slot="features"
              :items="selectedItems"
              :name="catalogue.name"
              :merchants-processor="table.processor"
              :link="tab.name !== 'linked'"
            />
            <el-table-column
              v-if="table.processor.data.length"
              type="selection"
              fixed="left"
              width="55"
            />
            <div v-else />
          </table-layout>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </main-layout>
</template>

<style lang="scss" module>
.header {
  display: flex;
  padding: var(--size-card-spacing);
}

.card {
  width: 100%;
  margin: 0 0 1.25rem;
}

.table {
  padding: 0;
  margin-bottom: rem(16px);
  border: none;
  box-shadow: none !important;
}

.view-details-btn {
  font-weight: 600;
}

.tabs {
  :global {
    .el-tabs__header {
      padding: 0 var(--size-card-spacing) calc(var(--size-card-spacing) / 2);
    }
  }
}

.buttonWrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: rem(0 48px 16px 0);
}
</style>
