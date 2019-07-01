<script>
import paymentFormItem from '../../../customer/payment-methods/payment-form-item'
import get from 'lodash/get'

export default {
  name: 'AmountChargeOwingModal',
  components: {
    paymentFormItem,
  },
  props: {
    subscription: {
      type: Object,
      default: () => {},
    },
    customerName: {
      type: String,
      required: true,
    },
    paymentMethods: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        amount: '',
        selectedMethod: get(this.paymentMethods[0], 'value', ''),
      },
      rules: {
        selectedMethod: [
          {
            required: true,
            message: 'Payment method is required',
            trigger: 'blur',
          },
        ],
        amount: [
          {
            required: true,
            message: 'Amount is required',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    displayMethodForm() {
      return this.paymentMethods.length === 0 || this.showAddMethodForm
    },
  },
  methods: {
    async onSubmit() {
      if (!this.validateAll().some(item => item === false)) {
        // const [error, response] = await this.$api.post(`/subscriptions/${this.subscription.id}`)
        // if (response) {
        //   this.$notify({
        //     type: 'success',
        //     title: 'Saved',
        //     message: 'Changes saved successfully.',
        //   })

        //   this.$emit('update:visible', false)
        //   this.$emit('edited')
        // } else if (error) {
        //   const firstError = error.violations[Object.keys(error.violations)[0]][0]
        //   this.$notify({
        //     type: 'error',
        //     title: 'Error',
        //     message: firstError,
        //   })
        // }
      }
    },
    validateAll() {
      const result = []
      this.$refs.form.validate( valid => {
        result.push(valid)
      })
      return result
    },
  },
}
</script>

<template>
  <el-dialog
    title="Charge Amount Owing"
    :custom-class="$style.wrapper"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="modal-form"
      label-position="top"
    >
      <el-form-item
        label="Customer"
      >
        <el-input
          :value="customerName"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="Amount to Pay"
        prop="amount"
      >
        <div
          class="amount-form-item"
        >
          <el-form-item>
            <el-input
              v-model="form.amount"
              placeholder="0.00"
            >
              <template #prepend>
                $
              </template>
            </el-input>
          </el-form-item>
          <el-select
            value=""
            placeholder="AUD"
            disabled
          />
        </div>
      </el-form-item>

      <hr :class="['divider-primary', $style.divider]">
      <payment-form-item
        :selected-method="form.selectedMethod"
        :payment-methods="paymentMethods"
        :display-form="displayMethodForm"
        @showForm="showAddMethodForm = $event"
        @changeMethod="form.selectedMethod = $event"
      />
    </el-form>
    <div class="modal__footer">
      <el-button
        v-if="!displayMethodForm"
        type="primary"
        :class="$style.save"
        @click="onSubmit"
      >
        Charge Now
      </el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" module>
.wrapper {
  width: 32rem;
}

.save {
  width: 15rem !important;
}

.divider {
  margin: 2rem 0 1.5rem;
}
</style>