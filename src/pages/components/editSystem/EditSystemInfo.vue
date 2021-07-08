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
      <a-form-item label="名称">
        <a-input
          v-decorator="[
            'dicName',
            {
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            },
          ]"
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item label="价格">
        <a-input
          v-decorator="[
            'dicValue',
            {
              rules: [
                {
                  required: true,
                  message: '请输入价格',
                },
              ],
            },
          ]"
          placeholder="请输入价格"
        />
      </a-form-item>
      <a-form-item label="性别">
        <a-radio-group
          v-decorator="[
            'gender',
            {
              rules: [
                {
                  required: true,
                  message: '请选择性别',
                },
              ],
            },
          ]"
        >
          <a-radio :value="1"> 男 </a-radio>
          <a-radio :value="2"> 女 </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="天数">
        <a-input
          v-decorator="[
            'typeDescription',
            {
              rules: [
                {
                  required: true,
                  message: '请输入天数',
                },
              ],
            },
          ]"
          placeholder="请输入天数"
        />
      </a-form-item>
      <a-form-item label="返利金额">
        <a-input
          v-decorator="[
            'rebate',
            {
              rules: [
                {
                  required: true,
                  message: '请输入返利金额',
                },
              ],
            },
          ]"
          placeholder="请输入返利金额"
        />
      </a-form-item>
      <!-- <a-form-item label="配置介绍">
        <a-input
          type="textarea"
          v-decorator="['typeDescription']"
          placeholder="请输入配置介绍"
        />
      </a-form-item> -->
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