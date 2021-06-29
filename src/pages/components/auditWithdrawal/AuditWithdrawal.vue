<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :confirm-loading="confirmLoading"
    okText="保存"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
    @ok="
      () => {
        $emit('create');
      }
    "
  >
    <a-form
      :form="form"
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 15, offset: 1 }"
    >
      <a-form-item
        label="审核"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-select
          v-decorator="[
            'status',
            {
              rules: [{ required: true, message: '请选择审核状态' }],
            },
          ]"
          placeholder="请选择审核状态"
        >
          <a-select-option :value="1">通过</a-select-option>
          <a-select-option :value="2">失败</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注">
        <a-input
          type="textarea"
          v-decorator="['remark']"
          placeholder="请输入备注"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: ["visible", "modalTitle", "confirmLoading"],
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "form_in_modal",
    });
  },
  methods: {},
};
</script>
<style lang="less" scoped>
</style>