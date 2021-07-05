<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :confirm-loading="confirmLoading"
    okText="保存"
    @cancel="cancel"
    @ok="create"
  >
    <a-form
      :form="form"
      layout="vertical"
      :labelCol="{ span: 2 }"
      :wrapperCol="{ span: 15, offset: 1 }"
    >
      <a-form-item label="图片" required>
        <a-upload
          list-type="picture"
          :fileList="fileList"
          :multiple="true"
          :customRequest="photoCustomRequest"
          :before-upload="beforeUpload"
          :remove="photosReomve"
        >
          <a-button> <a-icon type="upload" /> 选择图片 </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { putObject, renameFile } from "../../../utils/upload";
export default {
  props: ["visible"],
  data() {
    return {
      modalTitle: "上传图片",
      confirmLoading: false,
      fileList: [],
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  methods: {
    //图片删除
    photosReomve(info) {
      let list = this.fileList.filter((item) => item.uid !== info.uid);
      this.fileList = list.map(function (value, index) {
        value.uid = index + 1;
        return value;
      });
      console.log(this.fileList);
    },
    //图片上传
    photoCustomRequest(info) {
      const file = info.file;
      const newFile = renameFile(file);
      putObject(newFile).then((res) => {
        if (res.statusCode == 200) {
          this.fileList.push({
            uid: this.fileList.length + 1, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            name: res.Location, // 文件名
            status: "done", // 状态有：uploading done error removed
            url: "http://" + res.Location,
            thumbUrl: "http://" + res.Location,
          });
          this.$message.success("图片上传成功！");
        }
      });
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
    //取消
    cancel() {
      this.fileList = [];
      this.$emit("pictureCancel");
    },
    create() {
      this.$emit("pictureCreate", this.fileList);
    },
  },
};
</script>
<style lang="less" scoped>
</style>