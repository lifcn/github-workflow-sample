<script>
import { mapActions } from 'vuex'
export default {
  name: 'DeleteEventModalSuper',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      progress: false,
    }
  },
  methods: {
    ...mapActions('event', ['deleteEvent']),
    async onSubmit() {
      this.progress = true

      const [error, response] = await this.deleteEvent(this.id)

      if (error) {
        this.$notify({
          type: 'error',
          title: 'Error',
          message: error.message,
        })
      }

      if (response) {
        this.$notify({
          type: 'success',
          title: 'Success',
          message: `Successfuly deleted.`,
        })
      }

      this.progress = false
      this.$emit('close-modal')
    },
  },
}
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    width="32%"
    :class="$style.modal"
    v-on="$listeners"
  >
    <div
      :class="$style.imageWrapper"
    >
      <img
        src="@/assets/remove.png"
        :class="$style.image"
      >
    </div>
    <div :class="$style.title">
      Delete Event
    </div>
    <div :class="$style.text">
      Are you sure you wish to delete this event?
    </div>
    <el-button
      type="danger"
      class="el-button--wide"
      :class="$style.submit"
      :loading="progress"
      @click="onSubmit"
    >
      Delete Event
    </el-button>
  </el-dialog>
</template>

<style lang="scss" module>
.imageWrapper {
  display: flex;
  width: rem(100px);
  height: rem(100px);
  margin: auto;
}

.image {
  width: 100%;
  height: 100%;
}

.title {
  margin-top: rem(40px);
  font-size: rem(22px);
  font-weight: 400;
  text-align: center;
}

.text {
  margin-top: rem(20px);
  text-align: center;
}

.submit {
  display: block;
  width: 80%;
  margin: auto;
  margin-top: 2rem;
}
</style>
