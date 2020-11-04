<template>
    <div>
        <!-- 角色列表面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>    
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addFormVisible=true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色数据表格区域 -->
            <el-table :data="rolelist" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1==0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="RemoveRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2==0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="RemoveRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col >
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18"> 
                                        <el-tag v-for="(item3) in item2.children"  type="warning" :key="item3.id" closable @close="RemoveRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作"
                width="300px" >
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑角色" placement="top-start" :enterable="false">
                    <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除角色" placement="top-start" :enterable="false">
                    <el-button icon="el-icon-delete" type="danger" size="mini" @click="RemoveRoleById(scope.row.id)">删除</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
                    <el-button icon="el-icon-setting" type="warning" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
                    </el-tooltip>
                </template>
                
                </el-table-column>


            </el-table>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="addFormVisible"
        width="50%" @close = "addFormClear">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>

        <!-- 底部按钮区 -->
        <span slot="footer">
            <el-button @click="addFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addFormVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
        title="修改"
        :visible.sync="EditFormVisible"
        width="50%"
        >
        <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="EditForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="EditForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="EditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditRolesInfo" >确 定</el-button>
        </span>
</el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
        title="修改"
        :visible.sync="EditFormVisible"
        width="50%"
        @close="EditFormClear"
        >
        <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="EditForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="EditForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="EditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditRolesInfo" >确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
        title="分配权限"
        :visible.sync="showRightdialogVisible"
         width="50%"
        >
        <!-- 树形组件 -->
        <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id" default-expand-all    :default-expanded-keys="defKeys"></el-tree>

        <span slot="footer" class="dialog-footer">
        <el-button @click="showRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showRightdialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>    
    </div>
</template>

<script>
export default {
    name:'roles',
    data(){
        return {
            // 定义一个角色用户的数组，初始为空数组，之后通过调用接口数据得到角色数据
            rolelist:[],
            // 定义一个权限列表的数组，
            // 定义一个角色用户的数组，初始为空数组，之后通过调用接口数据得到权限数据
            rightlist:[],
            // defKey分配权限列表中默认展开的节点数组
            defKeys:[105,116],
            addForm:{
                roleName:'',
                roleDesc:''

            },
            EditForm:{
                roleName:'',
                roleDesc:''
            },
            treeProps:{
                label:'authName',
                children:'children'
            },
            addFormVisible:false,
            EditFormVisible:false,
            showRightdialogVisible:false,
            addFormRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            EditFormRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    // 在界面出现时，就应该获取角色列表数据，所以在生命周期函数的创建函数时获取数据
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status != 200){
                return this.$message.error('获取角色列表失败')
            }
            this.rolelist = res.data
            console.log(this.rolelist);
            
        },
        // 点击按钮添加新角色
            addRoles(){
            // validate方法传入的第一个参数valid是一个boolean值，为false时，校验失败，不能发起网络请求
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return 
                // 可以发起网络请求
                const {data:res} = await this.$http.post('roles',{params:this.addrole})
                if(res.meta.status != 201){
                return this.$message.error('添加用户失败')
            }
                this.$message.success('添加用户成功')
                this.addFormVisible = false
            })
            

        },
        // 监听添加角色表单的重置功能
        addFormClear(){
            this.$refs.addFormRef.resetFields()
        },
        EditFormClear(){
            this.$refs.EditFormRef.resetFields()
        },


        // 展示编辑角色对话框
        async showEditDialog(id){
            this.EditFormVisible = true
            const {data:res} = await this.$http.get(`roles/${id}`)
            if(res.meta.status != 200){
                return this.$message.error('角色查询失败')
            }
            this.$message.success('角色查询成功')
            this.EditForm = res.data
        },
        // 编辑角色信息
        EditRolesInfo(){
            this.$refs.EditFormRef.validate(async valid => {
                if(!valid) return
                // 以下可以发出网络请求
                const {data:res} = await this.$http.put(`roles/${this.EditForm.id}`,{id:this.EditForm.id,roleName:this.EditForm.roleName,roleDesc:this.EditForm.roleDesc})
                if(res.meta.status != 200){
                    this.$message.error('修改用户数据失败')
                }
                // 关闭修改用户对话框
                this.EditFormVisible = false
                // 刷新角色列表数据
                this.getRolesList()
                this.$message.success('修改用户数据成功')
            })
        },
        async RemoveRoleById(id){
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult == 'confirm'){
            const {data:res} = await this.$http.delete(`roles/${id}`)
            if(res.meta.status != 200){
                return this.$message.error('删除角色失败')
            }
            this.$message.success('删除角色成功')
            this.getRolesList()
        }    
    },
    // 根据id删除对应的权限
    async RemoveRightById(role,rightId){
        // 弹框提示用户是否要取消
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult != 'confirm'){
            return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta != 200){
            return this.$message.error('删除失败')
        }
        role.children = res.data
        
    },
    // 展示分配权限对话框
    async showRightDialog(role){
       const {data:res} = await this.$http.get('rights/tree')
       if(res.meta.status != 200){
           return this.$message.error('获取权限列表失败')
       }
       this.rightlist = res.data
       console.log(this.rightlist);
    //    获取三级结点的id
        this.getLeafKeys(role,this.defKeys)
        this.showRightdialogVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id,并保存到defKey中
    getLeafKeys(node,arr){
        // 该结点没有children属性，就是三级结点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item => 
            this.getLeafKeys(item,arr)
        );
    }
}
}
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    // 纵向居中
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>