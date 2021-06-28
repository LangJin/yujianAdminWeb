<template>
  <page-layout>
    <a-spin :spinning="spinning">
      <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-form layout="vertical" :form="form">
          <a-form-item
            label="用户头像"
            required
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 18, offset: 1 }"
          >
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              :customRequest="uploadImg"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item
            label="昵称"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 15, offset: 1 }"
          >
            <a-input
              v-decorator="[
                'nickName',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入昵称',
                    },
                  ],
                },
              ]"
              placeholder="请输入昵称"
            />
          </a-form-item>
          <a-form-item
            label="真实姓名"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 15, offset: 1 }"
          >
            <a-input
              v-decorator="[
                'realName',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入真实姓名',
                    },
                  ],
                },
              ]"
              placeholder="请输入真实姓名"
            />
          </a-form-item>
          <!-- <a-form-item
          label="登录账户"
          :labelCol="{ span: 2 }"
          :wrapperCol="{ span: 15, offset: 1 }"
        >
          <a-input
            v-decorator="[
              'loginAccount',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入登录账户',
                  },
                ],
              },
            ]"
            placeholder="请输入登录账户"
          />
        </a-form-item> -->
          <a-form-item
            label="登录密码"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 15, offset: 1 }"
          >
            <a-input
              type="password"
              v-decorator="[
                'loginPassword',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入登录密码',
                    },
                  ],
                },
              ]"
              placeholder="请输入登录密码"
            />
          </a-form-item>
          <a-form-item
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 3 }"
          >
            <a-button type="primary" @click="onSubmit" :disabled="disabled">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-spin>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import md5 from "js-md5";
import { putObject, renameFile } from "@/utils/upload";
import { userService as us } from "@/services";
import { mapMutations } from "vuex";
export default {
  name: "UserInfo",
  components: {
    PageLayout,
  },
  data() {
    return {
      fileName: undefined,
      imageUrl: undefined,
      loading: false,
      disabled: false,
      spinning: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    ...mapMutations("account", ["setUser"]),
    getUserInfo() {
      this.spinning = true;
      us.getUserInfo().then((res) => {
        if (res.data.code == 1) {
          const userInfo = res.data.data[0];
          this.imageUrl = userInfo.headUrl;
          this.$nextTick(() => {
            this.form.setFieldsValue({
              nickName: userInfo.nickName,
              realName: userInfo.realName,
              // loginAccount: userInfo.loginAccount
              // loginPassword: userInfo.loginPassword,
            });
          });
        }
        this.spinning = false;
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
    //上传图片
    uploadImg(info) {
      this.loading = true;
      const file = info.file;
      const newFile = renameFile(file);
      // this.fileName = newFile.name;
      putObject(newFile).then((res) => {
        if (res.statusCode == 200) {
          this.loading = false;
          this.fileName = "http://" + res.Location;
          this.imageUrl = "http://" + res.Location;
          this.$message.success("图片上传成功！");
        }
      });
    },
    onSubmit() {
      if (
        (this.fileName == undefined || this.fileName.length <= 0) &&
        (this.imageUrl == undefined || this.imageUrl.length <= 0)
      ) {
        this.$message.warning("请上传头像");
        return;
      }
      this.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        values.loginPassword = md5(values.loginPassword);
        let addValue = {};
        if (this.fileName == undefined) {
          addValue.headUrl = this.imageUrl;
        } else {
          addValue.headUrl = this.fileName;
        }
        let params = { ...values, ...addValue };
        this.updateUserInfo(params);
      });
    },
    updateUserInfo(params) {
      this.disabled = true;
      us.updateUserInfo(params).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.form.resetFields();
          this.getUserInfo();
          const user = {
            name: params.nickName,
            position: "",
            avatar: this.imageUrl,
          };
          this.setUser(user);
        }
        this.disabled = false;
      });
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
