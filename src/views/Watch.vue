<template>
  <div class="watch">
    <div class="p-live">
      <div class="live-player"></div>
      <div class="live-chatroom"></div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      setting: {
        appId: "fc0k4v6dz3",
        role: "viewer",
        userId: "2333",
        pic: "http://livestatic.videocc.net/assets/wimages/missing_face.png",
        nickName: "polyvtest",
      },
    };
  },
  props: ["channelId", "scene"],
  async mounted() {

    this.init();
  },
  methods: {
    async init() {
      const loading = this.$loading({
        text: '玩命加载中...',
        fullscreen: true
      })
      await this.getToken();
      this.initChatroom();
      this.initLiveSdk();
      loading.close();
    },
    async getToken() {
      const res = await axios.get(
        "https://demo.polyv.net/zhouzhanhong/api/getChatToken.php",
        {
          params: {
            channelId: this.channelId,
            userId: this.setting.userId,
            role: this.setting.role,
          },
        }
      );
      this.setting = { ...this.setting, ...res.data.data };
    },
    /**
     * @desc 初始化聊天室
     */
    initChatroom() {
      const tabData = [
        {
          name: "聊天",
          type: "chat",
        },
        {
          name: "提问",
          type: "ask",
        },
      ];
      // 聊天室tab下面区域里会生成一个 class 为 tab-ppt的 div
      if (this.scene === "ppt")
        tabData.unshift({
          name: "文档",
          type: "ppt",
        });
      this.chatroom = new window.PolyvChatRoom({
        roomId: this.channelId,
        userId: this.setting.userId,
        pic: this.setting.pic,
        nick: this.setting.nickName,
        container: ".live-chatroom",
        width: "100%",
        height: "100%",
        userType: "slice",
        token: this.setting.token,
        mediaChannelKey: this.setting.mediaChannelKey,
        version: "2.0",
        tabData,
        roomMessage: function() {
          // data为聊天室socket消息，当有聊天室消息时会触发此方法
          // console.log(data);
        },
      });
    },
    /**
     * @desc 初始化直播SDK
     */
    initLiveSdk() {
      const sdkSetting = {
        channelId: this.channelId,
        sign: this.setting.liveSign, // 频道验证签名
        timestamp: this.setting.timestamp, // 毫秒级时间戳
        appId: this.setting.appId, // polyv 后台的appId
        socket: this.chatroom.chat.socket, // 设置socket 如果不设置为chatroom的socket，聊天室会出现在线人数不符合的情况
        user: {
          userId: this.setting.userId, // userId 和 chatroom设置的一致
          userName: this.setting.nickName, // userName 和 chatroom设置的一致
          pic: this.setting.pic, // 头像 和 chatroom设置的一致
        },
      };
      this.liveSdk = new window.PolyvLiveSdk(sdkSetting);
      this.addSdkEvent();
    },
    /**
     * @desc 直播SDK示例绑定事件
     */
    addSdkEvent() {
      this.liveSdk.once(window.PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, () => {
        console.log("CHANNEL_DATA_INIT");
        this.setupPlayer();
        this.addPlayerEvent();
      });
      this.liveSdk.on(
        window.PolyvLiveSdk.EVENTS.STREAM_UPDATE,
        this.handleStreamUpload
      );
    },
    addPlayerEvent() {
      this.liveSdk.player.once("loadedmetadata", this.handleLoadedmetadata);
      this.liveSdk.player.on("playing", this.handlePlaying);
      this.liveSdk.player.on("pause", this.handlePause);
    },
    handleStreamUpload() {
      console.log("STREAM_UPDATE");
      this.liveSdk.reloadPlayer();
    },
    /**
     * @desc 移动端触发loadedmetadata, 一般需要在点击播放后。
     */
    handleLoadedmetadata() {
      console.log("loadedmetadata");
    },
    handlePlaying() {
      console.log("playing");
    },
    handlePause() {
      console.log("pause");
    },
    setupPlayer() {
      const playerSetting = {
        el: ".live-player",
        type: "auto",
        controller: true,
      };
      if (this.scene === "ppt") {
        playerSetting.pptEl = ".tab-ppt";
        // 切换tab之后要调用resize去刷新ppt, 触发点击事件后，可能tab还没切换完，
        // 所以将刷新逻辑写在setTimeout里
        document
          .querySelector("[data-type=ppt]")
          .addEventListener("click", () => {
            setTimeout(() => {
              this.liveSdk.player.resize();
            }, 0);
          });
      }
      this.liveSdk.setupPlayer(playerSetting);
    },
  },
  destroyed() {
    this.liveSdk.destroy();
    // this.liveSdk.off(window.PolyvLiveSdk.EVENTS.STREAM_UPDATE,
    //     this.handleStreamUpload)
    console.info("destroy");
  },
};
</script>
<style scoped>
.p-live {
  height: 100vh;
  overflow: hidden;
}
.live-player {
  height: 200px;
}
.live-chatroom {
  height: calc(100% - 200px);
}
</style>
