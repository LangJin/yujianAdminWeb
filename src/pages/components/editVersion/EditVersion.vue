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
    <a-form :form="form"  :labelCol="{ span: 4 }" :wrapperCol="{ span: 15, offset: 1 }">
      <a-form-item
        label="版本名称"
      >
        <a-input
          v-decorator="[
            'versionName',
            {
              rules: [
                {
                  required: true,
                  message: '请输入版本名称',
                },
              ],
            },
          ]"
          placeholder="请输入版本名称"
        />
      </a-form-item>
      <a-form-item
        label="版本描述"
      >
        <a-input
          type="textarea"
          v-decorator="['versionDescription']"
          placeholder="请输入版本描述"
        />
      </a-form-item>
      <a-form-item
        label="版本类型"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-select
          v-decorator="[
            'versionType',
            {
              rules: [{ required: true, message: '请选择版本类型' }],
            },
          ]"
          placeholder="请选择版本类型"
        >
          <a-select-option :value="1">安卓</a-select-option>
          <a-select-option :value="2">ios</a-select-option>
        </a-select>
      </a-form-item>
       <a-form-item
        label="下载地址"
      >
        <a-input
          v-decorator="[
            'downloadPath',
            {
              rules: [
                {
                  required: true,
                  message: '请输入下载地址',
                },
              ],
            },
          ]"
          placeholder="请输入下载地址"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: ["visible", "modalTitle", "confirmLoading"],
  data() {
    return {
      
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "form_in_modal",
    });
  },
  methods: {
   
  },
};
</script>
<style lang="less" scoped>

</style>