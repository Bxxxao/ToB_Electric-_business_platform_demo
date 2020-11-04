<template>
    <div class="login_container">
        <div class="login_box">
            <!-- logo区 -->
            <div class="avatar_box">
                <img src="../assets/img/logo.png" alt="">
            </div>
            <!-- 登陆表单区 -->
            <!-- 只要加上ref并命名就可以以这个命名作为引用对象，并调用elementui的方法 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item label="" prop="username"> 
                     <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="" prop="password">
                     <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item label="" class="btns">
                     <el-button type="primary" @click="login">登陆</el-button>
                     <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <!-- :model是v-bind:model的缩写，这种只是将父组件的数据传递到了子组件,不起到双向绑定.
    v-model才是双向绑定 -->
</template>

<script>
export default {
    name:'login',
    data(){
        return {
            // 登陆表单的数据绑定对象
            loginForm:{
                username:"admin",
                password:"123456"
            },
            loginFormRule:{
                // 验证用户名是否合法
                username:[ { required: true, message: '请输入登陆名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                // 验证密码是否合法
                password:[
                    { required: true, message: '请输入登陆密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetForm(){
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
            // $refs 表单的引用
            // loginFormRef是表单的引用对象  
        },
        login(){
            this.$refs.loginFormRef.validate(async vaild => {
                if(!vaild) return;
                // 如果返回值时Promise类型，可以用await简化这次Promise操作，但是await只能用于async方法中，所以上面的箭头函数也需要变成async（异步）类型,这样返回的就不是一个Promise对象而是一个具体的对象了
                // 另外，返回的具体对象中的属性，只有data属性是我们真实需要的,这里可以进行数据的解构
                const {data:res} = await this.$http.post('login',this.loginForm);
                // console.log(res.data);
                if(res.meta.status!=200) return this.$message({
                    type:'error',
                    message:"登陆失败"
                });
                this.$message.success({
                    // type:'success',
                    message:"登陆成功"
                })
                // console.log(res);
                
                window.sessionStorage.setItem("token",res.data.token)
                this.$router.replace("/home")
                
                // 上面可以直接res.data
                // 1.将登陆成功之后的token保存到客户端的sessionStorage中，因为这个是会话式存储，localStorage是持续性存储
                    // 1.1项目中除了登陆以外的其他api接口，必须在登陆之后才能访问
                    // 1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        // padding是内边距
        box-shadow: 0 0 10px #ddd;
        // 前两个参数是x轴和y轴，第三个参数是向外扩散的大小，第四个参数是颜色，前两个为0是因为全方位扩散
        position: absolute;
        // absolute是绝对位置
        // left:50%是div这个盒子的50%，要移动图片自身需要有transform
        left: 50%;
        transform: translate(-50%,-50%);
        // 这个是移动这个图片自身的50%，两个参数分别是x轴和y轴，正负号决定方向
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding:0 20px;
        box-sizing: border-box;
        
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>