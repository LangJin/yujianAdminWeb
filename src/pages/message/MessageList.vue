<template>
  <div class="MessageList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="消息列表"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
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
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="messageDetail(record)"
          v-auth="`detail`"
        >
          <a-icon type="file-text" /> 详情
        </a>
      </div>
    </custom-table>
    <!-- 详情抽屉 -->
    <a-drawer
      title="消息列表"
      placement="right"
      :closable="false"
      :visible="visible"
      :width="540"
      :destroyOnClose="true"
      @close="onClose"
    >
      <a-spin :spinning="spinning">
        <div class="item_box">
          <div v-for="(item, index) in messageList" :key="index">
            <div class="date">
              {{ item.createTime }}
            </div>
            <div class="mar_bott d_flex" v-if="item.userId !== userId">
              <div class="avater">
                <img
                  v-if="info.toUserVO.avatarUrl"
                  :src="info.toUserVO.avatarUrl"
                  mode="aspectFill"
                />
                <img v-else src="../../assets/img/icon_logo.png" mode="" />
              </div>
              <div class="adverse_box">
                <div class="de_text">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div class="mar_bott self" v-else>
              <div class="avater">
                <img
                  v-if="info.userVO.avatarUrl"
                  :src="info.userVO.avatarUrl"
                  mode="aspectFill"
                />
                <img v-else src="../../assets/img/icon_logo.png" mode="" />
              </div>
              <div class="self_box">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="textarea_box">
          <a-form-item>
            <a-textarea
              :rows="4"
              :value="value"
              @change="handleChange"
              placeholder="请输入备注..."
            />
          </a-form-item>
          <a-button
            html-type="submit"
            :loading="confirmLoading"
            type="primary"
            @click="handleSubmit"
          >
            提 交
          </a-button>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import { messageService as ms } from "@/services";

export default {
  name: "MessageList",
  components: { CustomTable },
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
          title: "发送人姓名",
          dataIndex: "userName",
        },
        {
          title: "接收人姓名",
          dataIndex: "toUserName",
        },
        {
          title: "消息内容",
          dataIndex: "content",
          searchAble: true,
          width: "30%",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      confirmLoading: false,
      isShowAdd: false,
      visible: false,
      toUserId: undefined,
      userId: undefined,
      info: {
        toUserVO: {},
        userVO: {},
      },
      messageList: [],
      messPageNum: 1,
      messPageSize: 50,
      messTotal: 0,
      value: "",
      spinning: false,
    };
  },
  created() {
    this.getMessageList();
  },
  methods: {
    //获取消息列表
    getMessageList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      ms.messageList(pageSize, pageNum, { ...conditions }).then((result) => {
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
      this.getMessageList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getMessageList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getMessageList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getMessageList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getMessageList();
    },
    //详情按钮
    messageDetail(record) {
      this.userId = record.userId;
      this.toUserId = record.toUserId;
      this.getUserMessage();
      this.value = "";
      this.visible = true;
    },
    //获取用户聊天记录
    getUserMessage() {
      this.spinning = true;
      ms.getUserMessage(
        this.userId,
        this.toUserId,
        this.messPageSize,
        this.messPageNum
      ).then((res) => {
        if (res.data.code == 1) {
          let result = res.data.data[0];
          this.info = result;
          this.messageList = result.messageVO;
          this.spinning = false;
        }
      });
    },
    //抽屉关闭
    onClose() {
      this.visible = false;
    },
    //发送消息
    handleSubmit() {
      if (!this.value) {
        return;
      }
      let params = {
        content: this.value,
        toUserId: this.toUserId,
      };
      this.saveMessage(params);
    },
    //发送消息
    saveMessage(params) {
      this.confirmLoading = true;
      ms.saveMessage(this.userId, params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.value = "";
          this.getUserMessage();
        }
        this.confirmLoading = false;
      });
    },
    handleChange(e) {
      this.value = e.target.value;
    },
  },
};
</script>

<style scoped lang="less">
.MessageList {
  background-color: @base-bg-color;
  padding: 24px;
}
.item_box {
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  height: 320px;
  margin-bottom: 10px;
  overflow-y: scroll;
}

.adverse_box,
.self_box {
  max-width: 255px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
}

.date {
  text-align: center;
  color: #888888;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.d_flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.mar_bott {
  margin-bottom: 10px;
  align-items: inherit;

  .avater {
    width: 40px;
    height: 40px;
    margin-left: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.self {
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;

  .avater {
    margin-right: 10px;
  }
}

.self_box {
  background-color: #f1caab;
}
</style>