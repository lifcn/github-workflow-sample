
<script>
export default {
  name: 'OfferRemoveModal',
  inheritAttrs: false,
  data() {
    return {
      form: {
        notes: '',
      },
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.$emit('submit', this.form.notes)
      })
    },
  },
}
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    title="Remove Offer"
    width="30%"
    v-on="$listeners"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="100%"
      label-position="top"
      :class="$style.root"
    >
      <p :class="$style.text">
        Are you sure you wish to remove this offer?
        <br>
        This action can not be undone.
      </p>
      <!-- <el-form-item
        label="Notes"
        prop="notes"
        required
        :class="$style.textarea"
      >
        <el-input
          v-model="form.notes"
          type="textarea"
          :rows="4"
        />
      </el-form-item> -->
      <el-button
        type="danger"
        class="el-button--wide"
        :class="$style.submit"
        @click="submit"
      >
        Remove Offer
      </el-button>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
}

.textarea {
  width: 100%;
  margin-top: 1rem;
}

.submit {
  width: 100%;
  margin-top: 2rem;
}
</style>
