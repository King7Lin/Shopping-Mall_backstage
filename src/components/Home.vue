<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>商城后台管理</span>
      </div>
      <el-button type="primary" size="default" @click="loginOut">
        退出
      </el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏 -->
        <el-menu
          :collapse="collapse"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.path + ''"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="'/' + subItem.path"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单
      menulist: [],
      iconObj: {
        125: "el-icon-user",
        103: "el-icon-price-tag",
        101: "el-icon-shopping-cart-2",
        102: "el-icon-tickets",
        145: "el-icon-s-marketing",
      },
      collapse: false,
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -moz-transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -o-transition: width 0.25s;
  .el-menu {
    border: none;
    transition: all 10ms;
  }
}
.el-main {
  background-color: #eaedf1;
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