<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" :replace="true">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> 

        <!-- 卡片视图区域 -->
        <el-card >
            <!-- 搜索与添加区域 -->
            <!-- row是行 col是列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getuserlist"> 
                        <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表 -->
            
        <el-table
        :data="userlist"
        border
        style="width: 100%"
        stripe>

            <!-- 在表格前面添加索引 -->
            <el-table-column
            label="#"
            type="index">
            </el-table-column>

            <el-table-column
            prop="username"
            label="姓名">
            </el-table-column>

            <el-table-column
            prop="email"
            label="邮箱">
            </el-table-column>

            <el-table-column
            prop="mobile"
            label="电话">
            </el-table-column>

            <el-table-column
            prop="role_name"
            label="角色">
            </el-table-column>

            <el-table-column
            prop="mg_state"
            label="状态">
            <!-- 通过作用域插槽接收"scope 就可以通过这个scope的一个属性row得到这一行所有的数据，即我们需要在这里获取这一行内容的状态mg_state也可以从中获取-->
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    
                    @change="changestate(scope.row)">
                    <!-- 上面的change是一个事件，所以需要在change前面加上@ -->
                </el-switch>
            </template>
            </el-table-column>

            <el-table-column
            label="操作" width="180">
            <template slot-scope="scope">
                <el-tooltip effect="dark" content="修改用户" placement="top-start" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="删除用户" placement="top-start" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="RemoveUserById(scope.row.id)"></el-button>
                </el-tooltip>

                <el-tooltip effect="dark" content="分配用户" placement="top-start" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
                
               

            </template>
            </el-table-column>

        </el-table>

        <!-- 分页区域 -->

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
       
       </el-card>

    <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%" @close="addFormClear">
        <!-- 内容主体区 label-width是文本的宽度-->
        <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px" status-icon >
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" >
            <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>

            <el-form-item label="手机" prop="telphone">
            <el-input v-model="addForm.telphone"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

    <!-- 修改用户对话框 -->

    <el-dialog
        title="修改用户信息"
        :visible.sync="editdialogVisible"
        width="50%" @close="editdialogClosed"
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
    </el-dialog>
    
    </div>
</template>

<script>
export default {
    name:"users",
    data(){
        // 注意这两个验证方法不要写在return里
        // 验证邮箱合法性
        var checkEmail = (rule,value,callback) => {
            // 验证邮箱合法的正则表达式
            const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/ ;
            if(regEmail.test(value)){
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))

        }
        // 验证手机号合法性
        var checkMobile = (rule,value,callback) => {
            // 验证手机号合法的正则表达式
            const RegMobile = /^1[3|4|5|7|8][0-9]{9}$/
            if(RegMobile.test(value)){
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }

        return{
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                pagesize:1
                // pagesize为每页显示数据数
            },
            userlist:[],
            total:0,
            // 控制添加用户对话框的显示，默认为不显示
            addDialogVisible:false,

            // 控制修改用户对话框的显示，默认为以下数据
            editdialogVisible:false,
            addForm:{
                username:'testman',
                password:'0805',
                email:'123@qq.com',
                telphone:'13388888888'

            },
            // 根据用户id查询用户信息时，将信息保存在这个对象中
            editForm:{},

            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                     { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {
                        validator: checkMobile,trigger: 'blur'
                    }
                ]

            },
            addFormRule:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                     { validator: checkEmail, trigger: 'blur' }
                ],
                telphone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {
                        validator: checkMobile,trigger: 'blur'
                    }
                ]

            }

        }
    },
    created(){
        // 在打开页面的时候就要获取用户页面的数据，所以使用一个生命周期函数created()获取数据
        this.getuserlist()

    },
    methods:{
        async getuserlist(){
            // 因为接口文档中该请求需要请求参数，所以用{params:}获取
            const {data : res} = await this.$http.get('users',{params:this.queryInfo})
            console.log(res);
            if(res.meta.status != 200) return this.$message.error('获取用户列表失败！')
            this.userlist = res.data.users
            this.total = res.data.total
        },
        // 监听pageSize改变的事件
        handleSizeChange(newSize){
            console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getuserlist()
            
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage){
            console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.getuserlist()
        },
        async changestate(userinfo){
            console.log(userinfo);
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status != 200){
                userinfo.mg_state = !userinfo.mg_state;
                return this.$message.error('修改用户状态失败！')
            }
            this.$message.success('修改用户状态成功!')
            

            
        },
        // 监听添加用户表单的重置功能
        addFormClear(){
            this.$refs.addFormRef.resetFields()
        },
        // 点击确定按钮 ，添加新用户
        addUser(){
            // 需要拿到表单的引用，validate方法调用的是一个回调函数
            this.$refs.addFormRef.validate(async vaild => {
                if(!vaild) return
                // 可以发起添加网络请求
                const {data:res} = await this.$http.post('users',this.addForm)
                // console.log(res);
                if(res.meta.status != 201){
                    this.$message.error('添加用户失败')
                }
                this.$message.success("添加用户成功")
                this.addDialogVisible = false
                
            })
        },
        // 展示修改用户的对话框
        async showEditDialog(id){
            this.editdialogVisible = true
            const {data:res} = await this.$http.get(`users/${id}`)
            if(res.meta.status != 200) return this.$message.error('查询用户信息失败')
            this.$message.success('查询用户信息成功')
            this.editForm = res.data
        },
        // 监听修改用户对话框的重置事件
        editdialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 编辑用户提交预校验，validate是表单中的预校验方法，返回的是一个boolean值
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);这里返回的是一个boolean值
            if(!valid) return 
            // 如果valid是true，则发起修改用户数据请求
            const {data:res} = await this.$http.put(`users/${this.editForm.id}`,{id:this.editForm.id,email:this.editForm.email,mobile:this.editForm.mobile})
            if(res.meta.status != 200) return this.$message.error('修改用户数据失败')
            
            // 关闭修改用户对话框
            this.editdialogVisible = false

            // 刷新数据列表
            this.getuserlist()

            // 弹出数据更新成功信息
            this.$message.success('更新用户数据成功')
            })
        },
        // 根据用户id删除，用await简化Promise操作，避免回调地狱，所以没有使用then.catch
       async RemoveUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 注意这里一定要有catch来返回一个err
        // 确认删除，返回confirm字符串，取消删除返回cancel字符串
        // console.log(confirmResult);
        if(confirmResult == 'confirm'){
            const {data : res} = await this.$http.delete(`users/${id}`)
            if(res.meta.status != 200) return this.$message.error('删除失败')
            this.$message.success('删除用户成功')
            // 更新用户数据
            this.getuserlist()
            
        }
        else{
            this.$message.info('已取消删除')
        }
                
        
      }
    }
}
</script>

<style lang="less" scoped>

</style>