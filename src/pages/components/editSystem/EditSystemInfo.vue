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
      <a-form-item label="配置名称">
        <a-input
          v-decorator="[
            'dicName',
            {
              rules: [
                {
                  required: true,
                  message: '请输入配置名称',
                },
              ],
            },
          ]"
          placeholder="请输入配置名称"
        />
      </a-form-item>
      <a-form-item label="套餐价格">
        <a-input
          v-decorator="[
            'dicValue',
            {
              rules: [
                {
                  required: true,
                  message: '请输入套餐价格',
                },
              ],
            },
          ]"
          placeholder="请输入套餐价格"
        />
      </a-form-item>
      <a-form-item label="配置介绍">
        <a-input
          type="textarea"
          v-decorator="['typeDescription']"
          placeholder="请输入配置介绍"
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