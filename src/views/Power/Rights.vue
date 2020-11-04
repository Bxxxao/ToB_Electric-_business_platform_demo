<template>
    <div>
        <!-- 权限列表面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>    
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightslist"  stripe border>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="权限说明" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path" ></el-table-column>
                <el-table-column label="权限等级" prop="level" >
                    <!-- 使用作用域插槽得到level，使用作用域插槽时，可以不用prop -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level=='0'">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level=='1'">二级权限</el-tag>
                        <el-tag type="warning" v-else>三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'rights',
    data(){
        return {
            // 所有的权限列表，默认为空
            rightslist:[],
        }
    },
    created(){
        // 在该页面创建时，就应该获取权限列表的数据
        this.getrightslist()
    },
    methods:{
        // 获取权限列表
        async getrightslist(){
           const {data:res} = await this.$http.get('rights/list')
        //    console.log(res);
        if(res.meta.status != 200){
            return this.$message.error('获取权限列表失败')
        }
        this.rightslist = res.data
        
        
        

           
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>