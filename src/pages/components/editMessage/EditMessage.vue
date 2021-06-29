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
      <a-form-item label="消息内容">
        <a-input
          type="textarea"
          v-decorator="['content']"
          placeholder="请输入消息内容"
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