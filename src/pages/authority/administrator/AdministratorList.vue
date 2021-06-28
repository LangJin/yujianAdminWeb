<template>
  <div class="UserList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="管理员列表"
      :loading="loading"
      rowKey="index"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      @addNew="onAddNew"
      :pagination="{
        current: pageNum,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <template slot="status" slot-scope="{ text }">
        {{ text === 0 ? "正常" : "冻结" }}
      </template>
      <template slot="type" slot-scope="{ text }">
        {{ text === 1 ? "普通用户" : "缴费用户" }}
      </template>
      <div slot="classPh" class="classPh" slot-scope="{ text }">
        <viewer :images="[text]" class="classPh">
          <img v-if="text" :src="text" alt="" />
          <img v-else src="@/assets/img/avater.png" alt="" />
        </viewer>
      </div>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="editStudent(record.code)"
          v-auth="`edit`"
        >
          <a-icon type="form" />编辑
        </a>
        <a
          style="margin-right: 8px"
          @click="assignRole(record.code, record.userRoleCode)"
          v-auth="`assign`"
        >
          <a-icon type="form" />分配角色
        </a>
        <!-- <a
          style="margin-right: 8px"
          @click="editStatus(record.code, record.status)"
          v-auth="`status`"
        >
          <a-icon type="edit" />状态
        </a> -->
        <a-popconfirm
          title="确定删除此管理员吗？"
          @confirm="deleteRecord(record.id)"
          v-auth="`delete`"
        >
          <a style="margin-right: 8px">
            <a-icon type="delete" />删除
          </a>
        </a-popconfirm>
      </div>
    </custom-table>
    <edit-user
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      :imageUrl="imageUrl"
      :loading="imageLoading"
      @cancel="handleCancel"
      @create="handleCreate"
      @handleChange="uploadImg"
    ></edit-user>
    <a-modal
      :title="statusTitle"
      :visible="statusVisible"
      :confirm-loading="confirmLoading"
      @ok="statusOk"
      @cancel="statusCancel"
    >
      <a-form-item
        label="角色"
        :labelCol="{ span: 2 }"
        :wrapperCol="{ span: 12, offset: 1 }"
      >
        <a-select
          v-model="roleCode"
          placeholder="请选择角色"
          style="width: 220px"
          @change="handleSelectChange"
        >
          <a-select-option
            v-for="(item, index) in roleList"
            :key="index"
            :value="item.code"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditUser from "@/pages/components/editUser/EditUser";
import md5 from "js-md5";
import { putObject, renameFile } from "@/utils/upload";
import { userService as us, roleService as rs } from "@/services";

export default {
  name: "UserList",
  components: { CustomTable, EditUser },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          // customRender: (text, record, index) => `${index + 1}`,
          width: "7%",
        },
        {
          title: "用户头像",
          dataIndex: "headUrl",
          scopedSlots: { customRender: "classPh" },
          width: "10%",
        },
        {
          title: "用户编码",
          dataIndex: "code",
          visible: false,
        },
        {
          title: "登录账户",
          dataIndex: "loginAccount",
          searchAble: true,
          width: "12%",
        },
        {
          title: "昵称",
          dataIndex: "nickName",
          searchAble: true,
          width: "12%",
        },
        {
          title: "真实姓名",
          dataIndex: "realName",
          searchAble: true,
        },
        {
          title: "上次登录时间",
          dataIndex: "lastLoginTime",
          dataType: "time",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width: "8%",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "新增学生",
      userCode: undefined,
      imageUrl: undefined,
      imageLoading: false,
      fileName: undefined,
      statusTitle: "分配角色",
      statusVisible: false,
      confirmLoading: false,
      isShowAdd: true,
      roleList: [],
      roleCode: "",
    };
  },
  created() {
    this.getSystemUserList();
  },
  authorize: {
    // deleteRecord: "delete",
  },
  methods: {
    getSystemUserList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      us.systemUserList(pageNum, pageSize, { ...conditions }).then((result) => {
        const list = result.data.data;
        const { curPage, pageSize, total } = result.data.pagination;
        list.map(function (value, index) {
          value.index = index + 1;
        });
        this.dataSource = list;
        this.pageNum = curPage;
        this.total = total;
        this.pageSize = pageSize;
        this.loading = false;
      });
    },
    //获取所有有效角色
    getAllRole() {
      rs.getAllRoles().then((res) => {
        if (res.data.code == 1) {
          this.roleList = res.data.data;
        }
      });
    },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageNum = 1;
      this.conditions = conditions;
      this.getSystemUserList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getSystemUserList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getSystemUserList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getSystemUserList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getSystemUserList();
    },
    deleteRecord(id) {
      us.deleteUserById(id).then(res => {
        if(res.data.code === 1){
          this.$message.success(res.data.msg);
          this.getSystemUserList();
        }
      })
    },
    onAddNew() {
      this.modalTitle = "新增用户";
      this.imageUrl = undefined;
      this.userCode = undefined;
      this.visible = true;
    },
    //分配角色
    assignRole(code, roleCode) {
      this.userCode = code;
      this.roleCode = roleCode;
      this.getAllRole();
      this.statusVisible = true;
    },
    editStudent(code) {
      this.userCode = code;
      let newData = this.dataSource.filter((item) => item.code === code)[0];
      this.modalTitle = "修改用户信息";
      this.visible = true;
      const form = this.$refs.collectionForm.form;
      this.imageUrl = newData.headUrl;
      this.$nextTick(() => {
        form.setFieldsValue({
          nickName: newData.nickName,
          realName: newData.realName,
          loginAccount: newData.loginAccount,
        });
      });
    },
    //上传图片
    uploadImg(info) {
      this.imageLoading = true;
      const file = info.file;
      const newFile = renameFile(file);
      // this.fileName = newFile.name;
      putObject(newFile).then((res) => {
        if (res.statusCode == 200) {
          this.imageLoading = false;
          this.fileName = "http://" + res.Location;
          this.imageUrl = "http://" + res.Location;
          this.$message.success("图片上传成功！");
        }
      });
    },
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
      this.imageUrl = undefined;
      this.fileName = undefined;
    },
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        values.loginPassword = md5(values.loginPassword);
        let addValue = {};
        if (this.userCode !== undefined) {
          addValue.code = this.userCode;
        }
        if (this.fileName == undefined) {
          addValue.headUrl = this.imageUrl;
        } else {
          addValue.headUrl = this.fileName;
        }
        // values.status = values.status == true ? 0 : 1;
        let params = { ...values, ...addValue };
        this.saveAndUpdateSystemUser(params, form);
      });
    },
    saveAndUpdateSystemUser(params, form) {
      this.confirmLoading = true;
      us.saveSystemUser(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getSystemUserList();
        }
        this.confirmLoading = false;
      });
    },
    statusOk() {
      if (this.roleCode == "") {
        this.$message.warning("请选择角色");
        return false;
      }
      this.confirmLoading = true;
      us.saveUserRole(this.userCode, this.roleCode).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.statusVisible = false;
          this.getSystemUserList();
        }
        this.confirmLoading = false;
      });
    },
    statusCancel() {
      this.roleCode = "";
      this.statusVisible = false;
    },
    handleSelectChange(value) {
      this.roleCode = value;
    },
  },
};
</script>

<style scoped lang="less">
.UserList {
  background-color: @base-bg-color;
  padding: 24px;
}
.classPh {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>