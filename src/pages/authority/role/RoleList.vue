<template>
  <div class="RoleList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="角色列表"
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
        {{ text === 0 ? "正常" : "冻结" }}
      </template>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="editRecord(record.id)"
          v-auth="`edit`"
        >
          <a-icon type="form" />编辑
        </a>
        <a
          style="margin-right: 8px"
          @click="editRecordStatus(record.id, record.status)"
          v-auth="`status`"
        >
          <a-icon type="edit" />状态
        </a>
        <a-popconfirm
          title="确定删除此条记录吗?"
          @confirm="deleteRecord(record.id)"
          v-auth="`delete`"
        >
          <a style="margin-right: 8px"> <a-icon type="delete" />删除</a>
        </a-popconfirm>
        <a @click="assignPermissions(record.id)" v-auth="`assign`"
          ><a-icon type="setting" />分配权限</a
        >
      </div>
    </custom-table>
    <!-- 新增、修改角色 -->
    <edit-role
      ref="collectionForm"
      :visible.sync="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @create="handleCreate"
    ></edit-role>
    <!-- 修改状态 -->
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
          <a-select-option :value="0"> 正常 </a-select-option>
          <a-select-option :value="1"> 冻结 </a-select-option>
        </a-select>
      </a-form-item>
    </a-modal>
    <!-- 权限抽屉 -->
    <a-drawer
      title="分配权限"
      :width="360"
      :destroy-on-close="true"
      :visible.sync="drawerVisible"
      @close="onDrawerClose"
    >
      <a-tree
        checkable
        :tree-data="treeData"
        :showLine="false"
        v-model="checkedKeys"
        :replaceFields="replaceFields"
        @select="onSelect"
        @check="onCheck"
      >
      </a-tree>
      <a-button class="drawerBtn" type="primary" @click="handleSubmite">
        确定
      </a-button>
    </a-drawer>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditRole from "../../components/editRole/EditRole";
import { roleService as rs } from "@/services";

export default {
  name: "RoleList",
  components: { CustomTable, EditRole },
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
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "角色编号",
          dataIndex: "code",
        },
        {
          title: "角色名称",
          dataIndex: "name",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "",
      roleId: undefined,
      statusTitle: "修改状态",
      statusVisible: false,
      confirmLoading: false,
      statusCode: 0,
      isShowAdd: true,
      drawerVisible: false, //抽屉
      treeData: [],
      checkedKeys: [], //选中节点，3级
      permissionKey: [], //所有节点，包括1,2,3级
      replaceFields: { title: "menuName", key: "menuCode" },
    };
  },
  created() {
    this.getRoleList();
  },
  authorize: {
    // deleteRecord: "delete",
  },
  methods: {
    //获取角色列表
    getRoleList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      rs.roleList(pageSize, pageNum, { ...conditions }).then((result) => {
        const list = result.data.data;
        const { curPage, pageSize, total } = result.data.pagination;
        this.dataSource = list;
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
      this.getRoleList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getRoleList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getRoleList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getRoleList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getRoleList();
    },
    //删除角色
    deleteRecord(id) {
      this.loading = true;
      rs.deleteRole(id).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.getRoleList();
        }
        this.loading = false;
      });
    },
    onAddNew() {
      this.modalTitle = "新增角色";
      this.roleId = undefined;
      this.visible = true;
    },
    //修改状态
    editRecordStatus(id, status) {
      this.roleId = id;
      this.statusCode = status;
      this.statusVisible = true;
    },
    //状态确定事件
    statusOk() {
      this.confirmLoading = true;
      rs.updateRoleStatus(this.roleId, this.statusCode).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.statusVisible = false;
          this.getRoleList();
        }
        this.confirmLoading = false;
      });
    },
    //状态取消事件
    statusCancel() {
      this.roleId = undefined;
      this.statusVisible = false;
    },
    //状态下拉框
    handleSelectChange(value) {
      this.statusCode = value;
    },
    //修改角色
    editRecord(id) {
      this.roleId = id;
      let newData = this.dataSource.filter((item) => item.id === id)[0];
      this.modalTitle = "修改角色";
      this.visible = true;
      const form = this.$refs.collectionForm.form;
      this.$nextTick(() => {
        form.setFieldsValue({
          name: newData.name,
        });
      });
    },
    //保存、修改角色取消事件
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
    },
    //保存、修改角色确定事件
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let addValue = {};
        if (this.roleId !== undefined) {
          addValue.id = this.roleId;
        } else {
          addValue.sort = this.dataSource.length + 1;
        }
        let params = { ...values, ...addValue };
        this.saveAndUpdateRole(params, form);
      });
    },
    //保存角色信息
    saveAndUpdateRole(params, form) {
      this.confirmLoading = true;
      rs.saveRole(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getRoleList();
        }
        this.confirmLoading = false;
      });
    },
    //分配权限
    assignPermissions(id) {
      this.checkedKeys = [];
      this.permissionKey = [];
      this.roleId = id;
      this.getMenuTreeData();
      this.drawerVisible = true;
    },
    //通过角色id获取菜单树
    getMenuTreeData() {
      rs.getMenuTree(this.roleId).then((res) => {
        if (res.data.code == 1) {
          let tempData = res.data.data;
          this.treeData = tempData;

          this.getTreeAllKeys(tempData);
          this.getCheckedKeys(tempData);
        }
      });
    },
    //获取所有选中节点
    getTreeAllKeys(data) {
      data.forEach((ele) => {
        if (ele.isCheck == 1) {
          this.permissionKey.push(ele.menuCode);
          // 判断有子元素,并且子元素的长度大于0就再次调用自身
          if (ele.children && ele.children.length > 0) {
            this.getTreeAllKeys(ele.children);
          }
        }
      });
    },
    //获取选中节点（3级）
    getCheckedKeys(data) {
      data.forEach((ele) => {
        if (ele.isCheck == 1) {
          // 判断有子元素,并且子元素的长度大于0就再次调用自身
          if (ele.children && ele.children.length > 0) {
            this.getCheckedKeys(ele.children);
          } else {
            this.checkedKeys.push(ele.menuCode);
          }
        }
      });
    },
    //抽屉关闭事件
    onDrawerClose() {
      this.roleId = undefined;
      this.drawerVisible = false;
    },
    //抽屉中，tree 点击树节点触发
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
    },
    //抽屉中，tree 复选框选中事件
    onCheck(checkedKeys, info) {
      this.permissionKey = [...checkedKeys, ...info.halfCheckedKeys];
      console.log("onCheck", checkedKeys, info);
    },
    //分配权限确定按钮事件
    handleSubmite() {
      rs.saveMenuRole(this.roleId, this.permissionKey).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.drawerVisible = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.RoleList {
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
.drawerBtn {
  margin-top: 40px;
  margin-left: 10px;
}
</style>