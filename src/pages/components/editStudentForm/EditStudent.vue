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
      layout="vertical"
      :form="form"
      :labelCol="{ span: 2 }"
      :wrapperCol="{ span: 15, offset: 1 }"
    >
      <a-form-item label="头像" required>
        <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :customRequest="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input
          v-decorator="[
            'nickName',
            {
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
              ],
            },
          ]"
          placeholder="请输入姓名"
        />
      </a-form-item>
      <a-form-item label="手机">
        <a-input
          type="number"
          v-decorator="[
            'phone',
            {
              rules: [
                {
                  required: true,
                  message: '请输入手机号',
                },
              ],
            },
          ]"
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="年龄">
        <a-input
          v-decorator="[
            'age',
            {
              rules: [
                {
                  required: true,
                  message: '请输入年龄',
                },
              ],
            },
          ]"
          placeholder="请输入年龄"
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
      <a-form-item label="学历">
        <a-input
          v-decorator="[
            'education',
            {
              rules: [
                {
                  required: true,
                  message: '请输入学历',
                },
              ],
            },
          ]"
          placeholder="请输入学历"
        />
      </a-form-item>
      <a-form-item label="职业">
        <a-input
          v-decorator="[
            'occupation',
            {
              rules: [
                {
                  required: true,
                  message: '请输入职业',
                },
              ],
            },
          ]"
          placeholder="请输入职业"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: [
    "visible",
    "modalTitle",
    "imageUrl",
    "loading",
    "confirmLoading",
    "fileList",
  ],
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  methods: {
    //头像上传
    handleChange(info) {
      this.$emit("handleChange", info);
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      if (!isJpgOrPng) {
        this.$message.error("上传的图片格式为JPG,PNG,GIF");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片不能超过2M");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
  img {
    width: 90px;
    height: 90px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>