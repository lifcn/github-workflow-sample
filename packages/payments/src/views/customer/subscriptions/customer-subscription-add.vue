<script>
import paymentFormItem from '../payment-methods/payment-form-item'
import ElasticProcessor from '@lib/processors/elastic-processor'
import { datePickerFormat, dateIsAfter, activeByDate } from '@lib/utils/date-helper'
import get from 'lodash/get'
import sort from '@lib/utils/dropdown-sorting'
import { mapActions } from 'vuex'
import { mask } from 'vue-the-mask'
import { existingCoupons } from '@/utils/custom-filtering'

export default {
  name: 'CustomerDetailsAddSubscription',
  directives: {
    mask,
  },
  components: {
    paymentFormItem,
  },
  props: {
    customer: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      datePickerFormat,
      processing: false,
      showAddMethodForm: false,
      frequencies: [],
      loadingPlans: false,
      form: {
        start_at: null,
        end_at: null,
        product: null,
        frequency: null,
        coupon: null,
        payment_source: get(this.customer,'payment_sources[0].token', null),
      },
      productsData: {
        data: [],
        loading: true,
      },
      couponsData: {
        data: [],
        loading: true,
      },
      rules: {
        start_at: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        product: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        frequency: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    displayMethodForm() {
      return !get(this.customer.payment_sources, 'length') || this.showAddMethodForm
    },
    allProducts() {
      return this.productsData.data.map(product => {
        return { value: product.id, label: product.name, end_at: product.sunsetAt }
      }).filter(product => {
        const { form } = this
        if(form.start_at) {
          return product.end_at ? dateIsAfter(product.end_at, form.start_at) : product
        } else {
          return product
        }
      })
    },
    allCoupons() {
      return this.couponsData.data.map(coupon => {
        return {
          value: coupon.code,
          label: coupon.name,
          start_at: coupon.startAt,
          end_at: coupon.endAt }
      }).filter(coup => {
        if(activeByDate(coup.start_at, coup.end_at)) {
          return coup
        }
      })
    },
  },
  watch: {
    'form.start_at'(){
      const { form, allProducts } = this
      const currentProd = allProducts.find(prod => prod.value === form.product)
      form.product = get(currentProd, 'value', null)
    },
    'form.product'(newVal) {
      this.updatePlans(newVal)
    },
  },
  created() {
    this.getProductsCoupons()
  },
  methods: {
    sort,
    ...mapActions('products', ['GET_PRODUCT_PLANS']),
    async onSubmit() {
      this.showAddMethodForm = false
      if (!this.validateAll().some(item => item === false)) {
        this.processing = true

        const { form, customer } = this
        const [error, response] = await this.$api.post(`/customers/${customer.id}/subscriptions`, {
          coupon: {
            code: form.coupon
          },
          end_at: form.end_at,
          payment_source: {
            token: form.payment_source
          },
          frequency: form.frequency,
          product: {
            id: form.product
          },
          start_at: form.start_at
        })

        this.processing = false

        if (response) {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: `Changes saved successfully`,
          })
          this.$emit('update:visible', false)
          this.$emit('update:should-update', true)
        } else if (error) {
          const violations = Object.keys(error.violations)
          violations.forEach(violation => {
            setTimeout(() => {
              this.$notify({
                type: 'error',
                title: 'Error',
                message: `${violation}: ${error.violations[violation][0]}`,
              })
            }, 50)
          })
        }
      }
    },
    validateAll() {
      const result = []
      this.$refs.form.validate( valid => {
        result.push(valid)
      })
      return result
    },
    getProductsCoupons() {
      this.productsData = new ElasticProcessor({
        component: this,
        index: 'subscription-products',
      })
      this.couponsData = new ElasticProcessor({
        component: this,
        index: 'coupons',
        staticQuery: {
          bool: {
            filter: [existingCoupons()]
          }
        }
      })
    },
    async updatePlans(id) {
      this.loadingPlans = true
      this.frequencies = await this.GET_PRODUCT_PLANS(id)
      this.loadingPlans = false
    }
  },
}
</script>

<template>
  <div>
    <el-dialog
      title="Add Subscription"
      :custom-class="$style.wrapper"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="rules"
        class="modal-form"
      >
        <el-form-item
          label="Customer"
        >
          <el-input
            :value="customer.fullName"
            disabled
            data-test="customer"
          />
        </el-form-item>

        <div class="united-field">
          <el-form-item
            label="Start Date"
            prop="start_at"
          >
            <el-date-picker
              v-model="form.start_at"
              v-mask="['##/##/####']"
              type="date"
              placeholder="DD/MM/YYYY"
              format="dd/MM/yyyy"
              :value-format="datePickerFormat"
            />
          </el-form-item>

          <el-form-item
            label="End Date"
          >
            <el-date-picker
              v-model="form.end_at"
              v-mask="['##/##/####']"
              type="date"
              placeholder="DD/MM/YYYY"
              format="dd/MM/yyyy"
              :value-format="datePickerFormat"
            />
          </el-form-item>
        </div>

        <el-form-item
          label="Subscription Product"
          prop="product"
          required
        >
          <el-select
            v-model="form.product"
            v-loading="productsData.loading"
            placeholder="Please select"
          >
            <el-option
              v-for="product in sort(allProducts)"
              :key="product.value"
              :value="product.value"
              :label="product.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Frequency"
          prop="frequency"
          required
        >
          <el-select
            v-model="form.frequency"
            v-loading="loadingPlans"
            placeholder="Please select"
          >
            <el-option
              v-for="frequency in sort(frequencies)"
              :key="frequency.value"
              :label="frequency.label"
              :value="frequency.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Coupon"
        >
          <el-select
            v-model="form.coupon"
            v-loading="couponsData.loading"
          >
            <el-option
              v-for="coupon in sort(allCoupons)"
              :key="coupon.id"
              :value="coupon.value"
              :label="coupon.label"
            />
          </el-select>
        </el-form-item>

        <hr :class="['divider-primary', $style.divider]">

        <payment-form-item
          :selected-method="form.payment_source"
          :payment-methods="customer.payment_sources"
          :display-form="displayMethodForm"
          :customer="customer"
          @showForm="showAddMethodForm = $event"
          @changeMethod="form.payment_source = $event"
          @updated="$emit('updated')"
        />
      </el-form>
      <el-button
        v-if="!displayMethodForm"
        type="primary"
        :class="[$style.save, 'wide-button']"
        data-test="submit"
        :loading="processing"
        @click="onSubmit"
      >
        Save
      </el-button>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 32rem;
  margin-top: 12vh !important;

  :global {
    .el-dialog__body {
      max-height: 80vh;
    }
  }
}

.save {
  display: block;
  margin: 0 auto;
}

.divider {
  margin: 2rem 0;
}
</style>
