<script>
import { mapActions } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        group_name: 'Classifications',
        name: '',
      },
    }
  },
  created() {
    if (this.item) {
      this.form = {
        group_name: this.item.group_name,
        name: this.item.name,
      }
    }
  },
  methods: {
    ...mapActions('categories', ['createCategory', 'updateCategory']),
    onSubmit() {
      if (this.item) {
        this.updateCategory({
          ...this.form,
          id: this.item.id,
        })
      } else {
        this.createCategory(this.form)
      }
      this.$emit('close-modal')
    },
  },
}
</script>

<template>
  <el-dialog
    :title="item ? 'Edit Category' : 'Add Category'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-form label-position="top">
      <el-form-item
        label="Group Name"
        required
      >
        <el-input v-model="form.group_name" />
      </el-form-item>
      <el-form-item
        label="Name"
        required
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-button
        type="primary"
        :class="$style.button"
        @click.stop="onSubmit"
      >
        Save
      </el-button>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" module>
  .button {
    display: block;
    margin-right: auto;
    margin-left: auto;
  }
</style>