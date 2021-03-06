<script>
import ProductsAnchorDates from './products-anchor-dates'
import { mask } from 'vue-the-mask'
import { datePickerFormat } from '@lib/utils/date-helper'

export default {
  name: 'ProductsSubscriptionForm',
  directives: {
    mask,
  },
  components: {
    ProductsAnchorDates,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      datePickerFormat,
      rules: {
        name: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        id: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        billing_type: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        anchor_at: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    changeValue(fieldName, newVal) {
      this.$emit('changeValue', { fieldName, newVal })
    },
  },
}
</script>

<template>
  <div :class="$style.root">
    <el-form
      ref="form"
      :model="data"
      :rules="rules"
      label-position="top"
      :class="['modal-form', $style.form]"
    >
      <el-form-item
        label="Product Name"
        class="form-tooltip-field"
        prop="name"
      >
        <el-input
          :value="data.name"
          @input="changeValue('name', $event)"
        />
        <el-tooltip
          placement="right"
        >
          <div slot="content">
            <span>
              <b>Anchor date</b><br>
              A customer's first bill will be prorated from the
              start date of their subscription to the anchor date.
            </span>
          </div>
          <i class="el-icon-warning" />
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="Product Code"
        prop="id"
        class="form-tooltip-field"
      >
        <el-input
          :value="data.id"
          :disabled="edit"
          data-test="id"
          @input="changeValue('id', $event)"
        />
        <el-tooltip
          placement="right"
        >
          <div slot="content">
            <span>
              <b>Anchor date</b><br>
              A customer's first bill will be prorated from the
              start date of their subscription to the anchor date.
            </span>
          </div>
          <i class="el-icon-warning" />
        </el-tooltip>
      </el-form-item>

      <el-form-item
        label="Billing Cycle"
        :prop="edit ? '': 'billing_type'"
        :class="[$style.billing, {[$style.disabled]: edit}]"
      >
        <el-radio-group
          v-if="data.group || data.billing_type"
          :value="edit ? data.group.billing_type : data.billing_type"
          :disabled="edit"
          @input="changeValue('billing_type', $event)"
        >
          <el-radio label="anniversary">
            Anniversary
          </el-radio>
          <el-radio label="prorata">
            Pro rata
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="united-field">
        <el-form-item label="End Date">
          <el-date-picker
            v-mask="['##/##/####']"
            :value="data.sunset_at"
            type="date"
            placeholder="DD/MM/YYYY"
            format="dd/MM/yyyy"
            :value-format="datePickerFormat"
            @input="changeValue('sunset_at', $event)"
          />
        </el-form-item>

        <el-form-item
          v-if="data.billing_type === 'prorata'"
          label="Anchor Date"
          :prop="edit ? '': 'anchor_at'"
          :class="[{[$style.disabled]: edit}, 'form-tooltip-field']"
        >
          <el-date-picker
            v-mask="['##/##/####']"
            :value="data.anchor_at"
            type="date"
            placeholder="DD/MM/YYYY"
            :disabled="edit"
            format="dd/MM/yyyy"
            :value-format="datePickerFormat"
            @input="changeValue('anchor_at', $event)"
          />
          <el-tooltip
            placement="right"
            :class="$style.tooltip"
          >
            <div slot="content">
              <span>
                <b>Anchor date</b><br>
                A customer's first bill will be prorated from the
                start date of their subscription to the anchor date.
              </span>
            </div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </el-form-item>
      </div>
    </el-form>
    <products-anchor-dates
      v-if="!edit && data.billing_type === 'prorata'"
      :class="$style.anchor"
      :selected-anchor-date="data.anchor_at"
    />
  </div>
</template>

<style lang="scss" module>


.root {
  display: flex;
  flex-direction: column;
}

.lastItem {
  margin-bottom: 1rem;
}

.disabled {
  label {
    color: #C0C4CC !important;
  }
}

.billing {
  display: flex;
  margin-bottom: .2rem;

  :global {
    .el-form-item__content {
      padding-left: 3rem;
    }
  }
}

.anchor {
  margin-bottom: -1rem;
}
</style>
