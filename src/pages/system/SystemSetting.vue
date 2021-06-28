<template>
  <div class="SystemList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="通用设置"
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
      <template slot="isTrue" slot-scope="{ text }">
        {{ text === 1 ? "有效" : "无效" }}
      </template>
      <template slot="status" slot-scope="{ text }">
        {{ text === 0 ? "冻结" : "正常" }}
      </template>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="editSystemInfo(record.id)"
          v-auth="`edit`"
        >
          <a-icon type="form" /> 编辑
        </a>
      </div>
    </custom-table>
    <edit-system-info
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @create="handleCreate"
    ></edit-system-info>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditSystemInfo from "@/pages/components/editSystem/EditSystemInfo";
import { systemService as ss } from "@/services";

export default {
  name: "SystemList",
  components: { CustomTable, EditSystemInfo },
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
          title: "名称",
          dataIndex: "dicName"
        },
        {
          title: "价格",
          dataIndex: "dicValue",
        },
        {
          title: "编码",
          dataIndex: "typeCode",
          searchAble: true
        },
        {
          title: "介绍",
          dataIndex: "typeDescription",
          searchAble: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width: "8%",
        },
        {
          title: "是否有效",
          dataIndex: "isTrue",
          scopedSlots: { customRender: "isTrue" },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "修改信息",
      versionId: undefined,
      confirmLoading: false,
      statusCode: 0,
      isShowAdd: false,
      systemId: undefined,
    };
  },
  created() {
    this.getSystemDictionary();
  },
  methods: {
    getSystemDictionary() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      ss.getSystemDictionary(pageSize, pageNum, { ...conditions }).then(
        (result) => {
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
        }
      );
    },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageNum = 1;
      this.conditions = conditions;
      this.getSystemDictionary();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getSystemDictionary();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getSystemDictionary();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getSystemDictionary();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getSystemDictionary();
    },
    //新增用户
    onAddNew() {
      this.visible = true;
    },
    //编辑系统信息
    editSystemInfo(id) {
      this.systemId = id;
      this.visible = true;
      const form = this.$refs.collectionForm.form;
      const target = this.dataSource.filter((item) => item.id === id)[0];
      form.resetFields();
      this.$nextTick(() => {
        form.setFieldsValue({
          dicName: target.dicName,
          dicValue: target.dicValue,
          typeDescription: target.typeDescription,
        });
      });
    },
    //新增、修改取消事件
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
    },
    //新增、修改弹窗确定事件
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let addValues = {};
        if (this.systemId !== undefined) {
          addValues.id = this.systemId;
        }
        let params = { ...values, ...addValues };
        this.saveSystemDictionary(params, form);
      });
    },
    //保存、修改信息
    saveSystemDictionary(params, form) {
      this.confirmLoading = true;
      ss.saveSystemDictionary(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getSystemDictionary();
        }
        this.confirmLoading = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.SystemList {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>