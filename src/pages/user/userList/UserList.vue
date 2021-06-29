<template>
  <div class="UserList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="用户列表"
      :loading="loading"
      rowKey="id"
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
        {{
          text === 0 ? "禁用" : text === 1 ? "正常" : text === 9 ? "注销" : ""
        }}
      </template>
      <div slot="classPh" slot-scope="{ text }">
        <viewer :images="[text]" class="classPh">
          <img v-if="text" :src="text" alt="" />
          <img v-else src="@/assets/img/avater.png" alt="" />
        </viewer>
      </div>
      <div slot="gender" slot-scope="{ text }">
        {{ text === 1 ? "男" : text === 2 ? "女" : "未知" }}
      </div>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="toUserDetail(record.id)"
          v-auth="`detail`"
        >
          <a-icon type="file-text" />详情
        </a>
        <a
          style="margin-right: 8px"
          @click="editStudent(record.id)"
          v-auth="`edit`"
        >
          <a-icon type="form" />编辑
        </a>
        <a
          style="margin-right: 8px"
          @click="editStatus(record.id, record.status)"
          v-auth="`status`"
        >
          <a-icon type="edit" />状态
        </a>
        <!-- <a @click="deleteRecord(record.id)" v-auth="`delete`">
          <a-icon type="delete" />删除</a
        > -->
      </div>
    </custom-table>
    <edit-student
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      :imageUrl="imageUrl"
      :loading="imageLoading"
      @cancel="handleCancel"
      @create="handleCreate"
      @handleChange="uploadImg"
    ></edit-student>
    <a-modal
      :title="statusTitle"
      :visible="statusVisible"
      :confirm-loading="confirmLoading"
      @ok="statusOk"
      @cancel="statusCancel"
    >
      <a-form-item
        label="状态"
        :labelCol="{ span: 2 }"
        :wrapperCol="{ span: 12, offset: 1 }"
      >
        <a-select
          v-model="statusCode"
          style="width: 220px"
          @change="handleSelectChange"
        >
          <a-select-option :value="0"> 冻结 </a-select-option>
          <a-select-option :value="1"> 解冻 </a-select-option>
          <a-select-option :value="9"> 注销 </a-select-option>
        </a-select>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditStudent from "@/pages/components/editStudentForm/EditStudent";
import { putObject, renameFile } from "../../../utils/upload";
import { userService as us } from "@/services";

export default {
  name: "UserList",
  components: { CustomTable, EditStudent },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: "7%",
        },
        {
          title: "头像",
          dataIndex: "avatarUrl",
          scopedSlots: { customRender: "classPh" },
        },
        {
          title: "用户名称",
          dataIndex: "nickName",
          searchAble: true,
          width: "11%",
        },
        {
          title: "电话",
          dataIndex: "phone",
          searchAble: true,
        },
        {
          title: "年龄",
          dataIndex: "age",
        },
        {
          title: "性别",
          dataIndex: "gender",
          scopedSlots: { customRender: "gender" },
        },
        {
          title: "学历",
          dataIndex: "education",
        },
        {
          title: "职业",
          dataIndex: "occupation",
          width: "8%",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width: "8%",
          searchAble: true,
          dataType: "select",
          search: {
            selectOptions: [
              { title: "禁用", value: 0 },
              { title: "正常", value: 1 },
              { title: "注销", value: 9 },
            ],
          },
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
      studentId: undefined,
      imageUrl: undefined,
      imageLoading: false,
      fileName: undefined,
      statusTitle: "修改状态",
      statusVisible: false,
      confirmLoading: false,
      statusCode: 0,
      isShowAdd: true,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      us.userList(pageSize, pageNum, { ...conditions }).then((result) => {
        const list = result.data.data;
        const { curPage, pageSize, total } = result.data.pagination;
        this.dataSource = list.map(function (value) {
          delete value.children;
          return value;
        });
        this.pageNum = curPage;
        this.total = total;
        this.pageSize = pageSize;
        this.loading = false;
      });
    },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageNum = 1;
      this.conditions = conditions;
      this.getUserList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getUserList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getUserList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getUserList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getUserList();
    },
    deleteRecord(id) {
      console.log(id);
    },
    //新增用户
    onAddNew() {
      this.modalTitle = "新增用户";
      this.imageUrl = undefined;
      this.studentId = undefined;
      this.visible = true;
    },
    //详情
    toUserDetail(id) {
      this.$router.push(`userDetail/${id}`);
    },
    //修改用户信息
    editStudent(id) {
      this.studentId = id;
      this.modalTitle = "修改用户信息";
      this.visible = true;
      const form = this.$refs.collectionForm.form;
      us.getUserDetailById(id).then((res) => {
        if (res.data.code === 1) {
          let info = res.data.data[0];
          form.resetFields();
          this.imageUrl = info.avatarUrl;
          this.$nextTick(() => {
            form.setFieldsValue({
              nickName: info.nickName,
              phone: info.phone,
              age: info.age,
              gender: info.gender,
              education: info.education,
              occupation: info.occupation,
            });
          });
        }
      });
    },
    //编辑状态
    editStatus(id, status) {
      this.studentId = id;
      this.statusCode = status;
      this.statusVisible = true;
    },
    //上传图片
    uploadImg(info) {
      this.imageLoading = true;
      const file = info.file;
      const newFile = renameFile(file);
      putObject(newFile).then((res) => {
        if (res.statusCode == 200) {
          this.imageLoading = false;
          this.fileName = "http://" + res.Location;
          this.imageUrl = "http://" + res.Location;
          this.$message.success("图片上传成功！");
        }
      });
    },
    //新增、修改取消事件
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
      this.imageUrl = undefined;
      this.fileName = undefined;
    },
    //新增、修改弹窗确定事件
    handleCreate() {
      if (
        (this.fileName == undefined || this.fileName.length <= 0) &&
        (this.imageUrl == undefined || this.imageUrl.length <= 0)
      ) {
        this.$message.warning("请上传头像");
        return;
      }
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let addVlue = {};
        if (this.studentId !== undefined) {
          addVlue.id = this.studentId;
        }
        if (this.fileName == undefined) {
          addVlue.avatarUrl = this.imageUrl;
        } else {
          addVlue.avatarUrl = this.fileName;
        }
        let params = { ...values, ...addVlue };
        this.saveAndUpdateStudent(params, form);
      });
    },
    //保存、修改学生信息
    saveAndUpdateStudent(params, form) {
      this.confirmLoading = true;
      us.saveAndUpdateUser(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getUserList();
        }
        this.confirmLoading = false;
      });
    },
    //状态确定事件
    statusOk() {
      this.confirmLoading = true;
      us.updateUserStatus(this.studentId, this.statusCode).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.statusVisible = false;
          this.getUserList();
        }
        this.confirmLoading = false;
      });
    },
    //状态取消事件
    statusCancel() {
      this.studentId = undefined;
      this.statusVisible = false;
    },
    //状态下拉框
    handleSelectChange(value) {
      this.statusCode = value;
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