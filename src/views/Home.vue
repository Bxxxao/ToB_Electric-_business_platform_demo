<template>
<!-- 用el-container时，不要在外面再加div -->
<el-container class="home-container">
    <!-- 头部信息 -->
    <el-header>
        <div>
            <img src="../assets/img/scaulogo.jpg" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <div @click="togglebutton" class="togglebutton">|||</div>
            <el-menu
            :default-active="this.$route.path"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse = "isCollapse"
            :collapse-transition = "false"
            :unique-opened = "true"
            router>
            <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">{{subitem.authName}}</el-menu-item>

      </el-submenu>


    </el-menu>
        </el-aside>
        <!-- 主内容 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>



</template>

<script>
export default {
    created(){
        this.getmenuList();

    },
    name:'home',
    data(){
        return{
            isCollapse:false,
            menulist:[],

        }
    },
    methods:{
        logout(){
            window.sessionStorage.removeItem("token");
            this.$router.replace('/login')
        },
        togglebutton(){
            this.isCollapse = !this.isCollapse
        },
        // 获取左侧菜单
        async getmenuList(){
           const {data:res} = await this.$http.get('menus')
           console.log(res);
           if(res.meta.status != 200) return this.$message.error(res.meta.msg)
           this.menulist = res.data 
           
        }
    }
}
</script>

<style lang="less" scoped>
    
    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #373d41;
        font-size: 20px;
        color: #fff;
        padding-left: 0;
        > div {
            display: flex;
            align-items: center;
        }
        img{
            width: 45px;
            height: 30px;
            margin-right: 10px;
        }
    }
    .el-aside {
        background-color: #333744;
    }
    .el-main {
        background-color: #eaedf1;
    }
    .home-container {
        height: 100%;
    }
    .togglebutton {
        color: #fff;
        letter-spacing: 0.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .el-menu{
        border-right: none;
    }
</style>