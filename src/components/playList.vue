<template>
  <div class="p-play-list">
    <div class="p-play-list-title">
      测试频道列表
    </div>
    <router-link
      :to="{ path: '/watch', query: {channelId: item.channelId, scene: item.scene}}"
      class="p-play-item"
      v-for="item in listData"
      :key="item.channelId"
    >
      <div class="p-play-cover">
        <img
          src="https://livestatic.videocc.net/assets/wimages/pc_images/logo.png"
        />
      </div>
      <div class="p-play-content">
        <h4>测试频道: {{ item.channelId }}</h4>
        <p>{{ item.desc }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [
        {
          channelId: "345098", //频道id
          desc: "普通直播测试频道1",
          scene: 'alone' // 频道场景 alone普通直播; ppt三分屏
        },
        {
          channelId: "421306",
          desc: "普通直播测试频道2",
          scene: 'alone'
        },
        {
          channelId: "352588",
          desc: "普通直播测试频道3",
          scene: 'alone'
        },
        {
          channelId: "423732",
          desc: "云课堂直播测试",
          scene: 'ppt'
        },

      ],
    };
  }
};
</script>

<style>
.p-play-item {
  display: flex;
  flex-direction: row;
  height: 15vh;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-decoration: none;
}
.p-play-item:link {
  color: #333;
}
.p-play-item:visited {
  color: #333;
}
.p-play-item a {
  display: block;
}
.p-play-cover {
  width: 30vw;
  height: 100%;
  padding-right: 5px;
}
.p-play-cover img {
  width: 100%;
  height: 100%;
}
.p-play-content h4 {
  margin: 5px 0;
}
.p-play-content p {
  margin: 0;
}
</style>
