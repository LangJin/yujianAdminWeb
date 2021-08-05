<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <!-- <img alt="logo" class="logo" src="@/assets/img/logo.png" /> -->
        <span class="title">{{ systemName }}</span>
      </div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert
              type="error"
              :closable="true"
              v-show="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px"
            />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入用户名"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入账户名',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import Mock from "mockjs";
import md5 from "js-md5";
import "@/mock/extend";
import { login, getUserInfo } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";
import { withdrawService as ws } from "@/services";
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    ...mapMutations("account", [
      "setUser",
      "setPermissions",
      "setRoles",
      "setWithdrawCount",
    ]),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = md5(this.form.getFieldValue("password"));
          login(name, password).then(this.afterLogin);
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code == 1) {
        this.getUserInfo();
        this.getUntreatedWithdrawNum();
        //设置token
        setAuthorization({
          token: loginRes.data[0].token,
          expireAt: new Date(loginRes.data.expireAt),
        });
        const { roles, permission } = loginRes.data[0];
        //保存权限
        this.setRoles(roles);

        //获取路由配置
        const routesConfig = [permission];
        loadRoutes(routesConfig); //加载路由
        this.$router.push("/dashboard");
        this.$message.success(Mock.mock("@TIMEFIX").CN + "，欢迎回来", 3);
      } else {
        this.error = loginRes.message;
      }
    },
    //获取用户个人信息
    getUserInfo() {
      getUserInfo().then((res) => {
        const userInfo = res.data.data[0];
        const user = {
          name: userInfo.nickName,
          position: "",
        };
        if (userInfo.headUrl == "" || userInfo.headUrl == undefined) {
          user.avatar =
            "https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png";
        } else {
          user.avatar = userInfo.headUrl;
        }
        this.setUser(user); //保存用户信息 store
      });
    },
    //获取未处理提现条数
    getUntreatedWithdrawNum() {
      ws.getUntreatedWithdrawNum().then((res) => {
        if (res.data.code == 1) {
          let count = res.data.data[0];
          const withdrawCount = { count: count };
          this.setWithdrawCount(withdrawCount);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
