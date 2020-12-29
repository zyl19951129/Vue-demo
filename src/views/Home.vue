<template>
  <div class="home">
    <el-container>
      <el-header>
        <div @click="$router.push('/welcome')">
          <img src="../../public/NK.jpg" alt="" width="60px" height="60px" />
          <span>NK 后台管理系统</span>
        </div>
        <template>
          <el-button type="info" @click="open">退出</el-button>
        </template>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            active-text-color="##409EFF"
            unique-opened
            router
          >
            <el-submenu
              :index="value.id + ''"
              v-for="value in menus"
              :key="value.id"
            >
              <template #title>
                <i :class="menuIconMapForLevel1[value.id]"></i>
                <span>{{ value.authName }}</span>
              </template>
              <template>
                <el-menu-item
                  :index="value1.path"
                  v-for="value1 in value.children"
                  :key="value1.id"
                >
                  <i class="el-icon-menu"></i>
                  <span>{{ value1.authName }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <router-view></router-view>
          <el-footer>
            <span>© 2020 香ICP证024351号 香ICP备10007328号</span>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menus: [],
      menuIconMapForLevel1: {
        125: 'el-icon-s-custom',
        103: 'el-icon-lock',
        101: 'el-icon-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
    };
  },
  methods: {
    handleClose() {},
    handleOpen() {},
    open() {
      const h = this.$createElement;
      this.$msgbox({
        message: h('p', null, [
          h('span', null, '确认是否退出'),
          h('i', { style: 'color: teal' }),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        localStorage.removeItem('token');
        this.$router.push('/login');
      });
    },
  },
  created() {
    return this._plugns.getInfo().then((res) => {
      if (res.data.meta.status === 200) {
        this.menus = res.data.data;
      } else {
        this.$message.error(res.data.meta.msg);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.home {
  & > .el-container {
    height: 100vh;
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgb(51, 55, 68);
      img {
        vertical-align: middle;
        border-radius: 50%;
      }
      span {
        color: #fff;
        text-align: center;
        margin-left: 20px;
        font-size: 24px;
      }
    }
    .el-container {
      .el-aside {
        background-color: rgb(51, 55, 68);
        .el-menu {
          border-right: none;
        }
      }
    }
    .el-container {
      position: relative;
      .el-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
        text-align: center;
        line-height: 60px;
        background-color: rgb(51, 55, 68);
        span {
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
