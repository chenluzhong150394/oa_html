<template>
  <div class="error-page">
      <h4>201811211038</h4>
      <p>1.新增股东收益页</p>
      <h4>201811201335更新版本</h4>
      <p>1.更改设备信息、管理页面字段显示顺序</p>
      <h4>201811192312更新版本</h4>
      <p>1.修改接口请求方式</p>
      <p>2.修改部分页面样式显示</p>
      <p>3.分页器加载</p>
      <h4>201811161520更新版本</h4>
      <p>1.每日数据鼠标移入显示详情</p>
      <h4>201811150940更新版本</h4>
      <p>1.重构员工绩效操作界面</p>
      <p>2.添加股东,合伙人功能移至权限管理页面中</p>
      <p>3.修复添加新用户后后台返回权限全为true的bug</p>
      <p>4.增加删除绩效记录功能</p>
      <h4>201811121433更新版本</h4>
      <p>1.新增系统更新日志页面</p>
      <p>2.修复token值失效后无法正常跳转至登录页面bug</p>
  </div>
</template>

<script>
export default {
  methods: {

  }
}
</script>


<style lang='scss' scoped>
.error-page{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    padding: 30px 0px 0px 30px;
    h4{
        margin: 8px 0 6px 0;
    }
    p{
        font-size: 14px;
        color: #666666;
    }
}
</style>
