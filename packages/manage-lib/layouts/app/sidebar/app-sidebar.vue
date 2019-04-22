<script>
export default {
  inheritAttrs: false,
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<template>
  <div class="app-sidebar">
    <div class="app-sidebar__wrapper">
      <el-menu
        :default-active="$route.path"
        :router="true"
      >
        <template v-for="item in menu">
          <el-submenu
            v-if="item.children && item.children.length"
            :key="item.path"
            :index="item.path"
          >
            <template slot="title">
              <i
                v-if="item.icon"
                :class="'el-icon-' + item.icon"
              />
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.path"
              :index="subitem.path"
            >
              {{ subitem.title }}
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            v-else
            :key="item.path"
            :index="item.path"
          >
            <i
              v-if="item.icon"
              :class="'el-icon-' + item.icon"
            />
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss">
/* stylelint-disable no-descending-specificity */

.app-sidebar {
  width: 260px;
  height: 100%;
  padding: 1rem 0;
  overflow-y: auto;
  background: var(--color-aside-bg);
  border: none;

  .el-menu {
    background: transparent;
    border-right: 0;

    [class*=' el-icon-'],
    [class^='el-icon-'] {
      color: var(--color-primary-text) !important;
    }

    &-item {
      color: var(--color-primary-text) !important;

      &:hover,
      &:focus,
      &:active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .el-menu, .el-submenu {

    [class^="el-icon-"] {
      margin-right: .6rem;
    }
  }

  .el-menu-item, .el-submenu__title {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 300;
  }

  .el-submenu {

    &__title {
      color: var(--color-primary-text);

      &:hover,
      &:focus,
      &:active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .el-menu-item {
      padding-left: 75px !important;
    }
  }
}
</style>