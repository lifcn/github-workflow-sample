<script>
import AppHeader from './header/app-header.vue'
import AppSidebar from './sidebar/app-sidebar.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    AppHeader,
    AppSidebar,
  },
  inheritAttrs: false,
  computed: {
    ...mapGetters('auth', [
      'loggedIn',
    ]),
  },
}
</script>

<template>
  <div v-if="loggedIn && $auth.isAuthorized()">
    <el-container :class="$style.root">
      <el-header height="72px">
        <app-header
          v-bind="$attrs"
        >
          <slot
            slot="header-right"
            name="header-right"
          />
          <template
            #header-menu="{ close }"
            name="header-menu"
          >
            <slot
              name="header-menu"
              :close="close"
            />
          </template>
        </app-header>
      </el-header>
      <el-container :class="$style.main">
        <el-aside
          :class="$style.aside"
          width="null"
        >
          <slot
            v-if="$slots.sidebar"
            name="sidebar"
          />
          <app-sidebar
            v-else
            v-bind="$attrs"
          />
        </el-aside>
        <el-main>
          <slot />
          <slot name="authorized" />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div v-else>
    <slot v-if="$slots.default" />
    <router-view
      v-else
      :key="$route.path"
    />
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss" module>

.root {
  height: 100vh;
  overflow: hidden;
}

.main {
  height: calc(100vh - 72px);
}

.aside {
  width: 300px;
  transition: width .15s;

  @include mq($until: lg) {
    width: 210px;
  }
}
</style>
