<template>
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
        default-active="subitem.id + ''" background-color="#333744" text-color="#fff" 
      active-text-color="#409EFF" :router="true"
      :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
       >
      <!-- 上面的unique-opened如果前面不加上冒号，true就是一个字符串，加上可以起到动态绑定值 -->

      <!-- 一级菜单 -->
      <!-- 使用v-for时，最后动态绑定key值，即 :key="" 绑定的值要唯一，比如id -->
      <el-submenu :index="''+item.id" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-location"></i>
            <!-- 文本 -->
            <span>{{subitem.authName}}</span>
          </template>
          
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
</template>