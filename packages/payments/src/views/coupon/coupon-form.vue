<script>
import { mask } from 'vue-the-mask'
import { datePickerFormat } from '@lib/utils/date-helper'

export default {
  name: 'CouponForm',
  directives: {
    mask,
  },
  props: {
    coupon: {
      type: Object,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      datePickerFormat,
      rules: {
        name: {
          required: true,
          message: 'This field is required',
          trigger: 'blur',
        },
        code: {
          required: true,
          message: 'This field is required',
          trigger: 'blur',
        },
        start_at: {
          required: true,
          message: 'This field is required',
          trigger: 'blur',
        },
        amount: {
          required: true,
          message: 'This field is required',
          trigger: 'blur',
        },
        validity_period: {
          required: true,
          message: 'This field is required',
          trigger: 'blur',
        },
      },
    }
  },
  computed: {
    discountFixed() {
      return this.coupon.discount_type === 'fixed_amount'
    },
    inputMask() {
      return this.discountFixed ?
        ['#.##', '##.##', '###.##', '####.##', '#####.##'] :
        ['#', '##']
    },
  },
  methods: {
    changeValue(fieldName, newVal) {
      this.$emit('changeValue', { fieldName, newVal })
    },
  },
}
</script>

<template>
  <el-form
    class="modal-form"
    :model="coupon"
    :rules="rules"
    label-position="top"
  >
    <el-form-item
      :error="errors.name"
      label="Coupon Name"
      prop="name"
    >
      <el-input
        :value="coupon.name"
        @input="changeValue('name', $event)"
      />
    </el-form-item>

    <el-form-item
      :error="errors.code"
      label="Coupon Code"
      prop="code"
    >
      <el-input
        :value="coupon.code"
        :disabled="edit"
        @input="changeValue('code', $event)"
      />
    </el-form-item>

    <div class="united-field">
      <el-form-item
        :error="errors.start_at"
        label="Effective Start Date"
        prop="start_at"
      >
        <el-date-picker
          v-mask="['##/##/####']"
          :value="coupon.start_at"
          :disabled="edit"
          type="date"
          format="dd/MM/yyyy"
          :value-format="datePickerFormat"
          placeholder="DD/MM/YYYY"
          @input="changeValue('start_at', $event)"
        />
      </el-form-item>
      <el-form-item label="End Date">
        <el-date-picker
          v-mask="['##/##/####']"
          :value="coupon.end_at"
          type="date"
          format="dd/MM/yyyy"
          :value-format="datePickerFormat"
          placeholder="DD/MM/YYYY"
          @input="changeValue('end_at', $event)"
        />
      </el-form-item>
    </div>

    <div class="united-field">
      <el-form-item
        label="Validity Period (Months)"
        :prop="edit ? '' : 'validity_period'"
        :error="errors.validity_period"
      >
        <el-input
          v-mask="['#', '##']"
          :value="`#${coupon.validity_period || ''}`"
          :disabled="edit"
          @input="changeValue('validity_period', $event.replace('#', ''))"
        />
      </el-form-item>
      <div :class="$style.validityNote">
        The validity period represents <br>
        how long the coupon will be <br>
        applied to a customer subscription.
      </div>
    </div>

    <el-form-item
      :error="errors.resource"
      :class="$style.radios"
      label="Discount Type"
      prop="resource"
    >
      <el-radio-group
        :value="coupon.discount_type"
        :disabled="edit"
        @input="changeValue('discount_type', $event)"
      >
        <el-radio label="percentage">
          Percentage
        </el-radio>
        <el-radio label="fixed_amount">
          Dollar Value
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :error="errors.amount"
      label="Amount"
      prop="amount"
    >
      <div
        prop="amount"
        class="amount-form-item"
        data-test="amount"
      >
        <el-input
          v-mask="inputMask"
          :value="coupon.amount"
          :placeholder="discountFixed ? '0.00' : '0'"
          :disabled="edit"
          @input="changeValue('amount', $event)"
        >
          <template
            v-if="discountFixed"
            #prepend
          >
            $
          </template>
          <template
            v-if="!discountFixed"
            #append
          >
            %
          </template>
        </el-input>
        <el-select
          v-if="discountFixed"
          value="AUD"
          disabled
          @input="changeValue('coupon.currency', $event)"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" module>
.radios {
  display: flex;
  align-items: center;
  width: 100%;

  &:before {
    content: none;
  }

  :global {
    .el-form-item__label {
      margin-right: 2rem;
    }
  }
}

.currencySelect {
  :global {
    .el-input {
      width: rem(80px);
    }
  }
}

.discountTypeSign {
  width: rem(38px);
  padding: 0;
}

.saveButton {
  display: block;
  width: 15rem;
  margin: 2rem auto 0;
}

.validityNote {
  display: block;
  width: 47%;
  padding: .8rem;
  margin-bottom: rem(22px);
  font-size: rem(13px);
  word-break: normal;
  background-color: #F3F3F4;
}
</style>
