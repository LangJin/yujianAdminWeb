<template>
  <div class="UserDetail">
    <!-- 学生详情 -->
    <a-card :bordered="false">
      <detail-list title="用户信息">
        <detail-list-item term="头像">
          <div class="photo_cl">
            <viewer class="photo_cl">
              <img v-if="info.avatarUrl" :src="info.avatarUrl" alt="" />
              <img v-else src="@/assets/img/avater.png" alt="" />
            </viewer>
          </div>
        </detail-list-item>
        <detail-list-item term="用户名称">{{ info.nickName }}</detail-list-item>
        <detail-list-item term="电话">{{ info.phone }}</detail-list-item>
        <detail-list-item term="年龄">{{ info.age }}</detail-list-item>
        <detail-list-item term="性别">{{
          info.gender === 1 ? "男" : info.gender === 2 ? "女" : "未知"
        }}</detail-list-item>
        <detail-list-item term="身高">{{ info.height }}</detail-list-item>
        <detail-list-item term="体重">{{ info.weight }}</detail-list-item>
        <detail-list-item term="学历">{{ info.education }}</detail-list-item>
        <detail-list-item term="职业">{{ info.occupation }}</detail-list-item>
        <detail-list-item term="状态">{{
          info.status === 0 ? "禁用" : info.status === 1 ? "正常" : "注销"
        }}</detail-list-item>
        <detail-list-item term="距离">{{ info.distance }}</detail-list-item>
        <detail-list-item term="孩子状态">{{ info.children }}</detail-list-item>
        <detail-list-item term="感情状态">{{ info.feeling }}</detail-list-item>
        <detail-list-item term="身材">{{ info.figure }}</detail-list-item>
        <detail-list-item term="年收入">{{ info.income }}</detail-list-item>
        <detail-list-item term="邀请码">{{
          info.invitationCode
        }}</detail-list-item>
        <detail-list-item term="是否喝酒">{{
          info.isDrink === 1 ? "喝酒" : "不喝酒"
        }}</detail-list-item>
        <detail-list-item term="是否喜欢">{{
          info.isLike === 1 ? "喜欢" : "不喜欢"
        }}</detail-list-item>
        <detail-list-item term="是否在线">{{
          info.isOnLine === 1 ? "在线" : "不在线"
        }}</detail-list-item>
        <detail-list-item term="是否抽烟">{{
          info.isSmoking === 1 ? "抽烟" : "不抽烟"
        }}</detail-list-item>
        <detail-list-item term="是否会员">{{
          info.isVip === 1 ? "是" : "否"
        }}</detail-list-item>
        <detail-list-item term="会员结束时间">{{
          info.vipEndTime
        }}</detail-list-item>
        <detail-list-item term="用户来源">{{
          info.scene === 1 ? "系统" : "注册"
        }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="兴趣爱好">
          {{ info.interestsStr }}
        </detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="简介">{{ info.introduce ? info.introduce : '暂无介绍' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="相册">
          <viewer :images="info.photos" class="album_box">
            <div v-for="(photo, p) in info.photos" :key="p" class="photo_cl albums">
              <img :src="photo" alt="" />
            </div>
          </viewer>
        </detail-list-item>
      </detail-list>
    </a-card>
  </div>
</template>

<script>
import DetailList from "@/components/tool/DetailList";
import { userService as us } from "@/services";
const DetailListItem = DetailList.Item;
export default {
  name: "BasicDetail",
  components: {
    DetailListItem,
    DetailList,
  },
  data() {
    return {
      userId: undefined,
      info: {}, //学生信息
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.getUserDetailById();
  },
  methods: {
    //获取userId学生信息
    getUserDetailById() {
      us.getUserDetailById(this.userId).then((res) => {
        if (res.data.code === 1) {
          let data = res.data.data[0];
          let interestsStr = "";
          data.interests.map(function(value){
            interestsStr = interestsStr.concat(value).concat('，');
          })
          data.interestsStr = interestsStr.substring(0, interestsStr.length - 1);
          this.info = data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  color: @title-color;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.photo_cl {
  width: 60px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
  }
}
.album_box{
  display: flex;
  flex-wrap: wrap;
  width: 925px;
}
.albums{
  margin-right: 12px;
  margin-top: 12px;
}
</style>
