<template>
  <!--布局容器-->
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div class="system">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!--页面主题区域-->
    <el-container>
      <!--侧边栏菜单区域-->
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active='activePath'
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/' + item.path"
              v-for="item in item.children"
              :key="item.id"
              @click="saveNavState('/' + item.path)"
            >
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主题-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        "125": "iconfont iconyonghu",
        "103": "iconfont icon12quanxianguanli",
        "101": "iconfont iconshangpinguanli",
        "102": "iconfont icondingdanguanli",
        "145": "iconfont iconshujutongji"
      },
      isCollapse: false,
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //重定向到登录页面
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath){
     window.sessionStorage.setItem('activePath',activePath)
     this.activePath=activePath
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    }
  }
};
</script>
<style scoped>
.home_container {
  height: 100%;
}
.el-menu {
  border-right: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedfa;
}
.system {
  display: flex;
  align-items: center;
}
.system img {
  width: 40px;
  height: 40px;
}
.system span {
  color: #fff;
  font-size: 20px;
  margin-left: 20px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
