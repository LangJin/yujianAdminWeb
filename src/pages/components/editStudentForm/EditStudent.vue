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
    <a-form layout="vertical" :form="form">
      <a-form-item
        label="头像"
        required
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 18, offset: 1 }"
      >
        <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="action"
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
      <a-form-item
        label="姓名"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-input
          v-decorator="[
            'name',
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
      <!-- <a-form-item
        label="年龄"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
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
        />
      </a-form-item>
      <a-form-item
        label="地区"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-input
          v-decorator="[
            'area',
            {
              rules: [
                {
                  required: true,
                  message: '请输入地区',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="学历"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
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
        />
      </a-form-item>
      <a-form-item
        label="缴费金额"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-input
          v-decorator="[
            'payMoney',
            {
              rules: [
                {
                  required: true,
                  message: '请输入缴费金额',
                },
              ],
            },
          ]"
        />
      </a-form-item> -->
      <a-form-item
        label="手机号"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
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
      <!-- <a-form-item
        label="学校"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-input
          v-decorator="[
            'school',
            {
              rules: [
                {
                  required: true,
                  message: '请输入学校名称',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="用户类型"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-radio-group v-decorator="[
            'type',
            {
              rules: [
                {
                  required: true,
                  message: '请选择用户类型',
                },
              ],
            },
          ]"  @change="TypeChange">
          <a-radio :value="1"> 普通用户 </a-radio>
          <a-radio :value="2"> 缴费用户 </a-radio>
        </a-radio-group>
      </a-form-item> -->
      <a-form-item
        label="是否冻结"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 15, offset: 1 }"
      >
        <a-switch v-decorator="['status', { valuePropName: 'checked', initialValue: false }]" @change="onChange" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: ["visible", "modalTitle","imageUrl", "loading", "confirmLoading"],
  data() {
    return {
      action: "",
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  methods: {
    handleChange(info) {
      this.$emit("handleChange", info);
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
      if (!isJpgOrPng) {
        this.$message.error("上传的图片格式为JPG,PNG,GIF");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片不能超过2M");
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    TypeChange(e) {
      console.log("radio checked", e.target.value);
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