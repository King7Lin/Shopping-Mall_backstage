<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/weclome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
                <!-- 二三级 -->
              </el-col>
              <el-col :span="19" :offset="0">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary"
            @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" icon="el-icon-delete" type="danger"
            @click="removeUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-setting"
              type="warning"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
<<<<<<< HEAD
=======
      </span>
    </el-dialog>
    <!-- 新增角色 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editFrom"
        :rules="addFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
>>>>>>> rights
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 分配权限对话框
      setRightDialogVisible: false,
      rightList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中节点
      defkeys: [],
      RoleId: "",
<<<<<<< HEAD
=======
      addDialogVisible: false,
      // 添加角色表格
      addFrom: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表格规则
      addFromRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 编辑对话框
      editDialogVisible:false,
      editFrom: {
        roleName: "",
        roleDesc: "",
      },
>>>>>>> rights
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message("获取列表失败");

      this.roleList = res.data;
    },
    // tag删除
    async removeRightById(e, id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        `roles/${e.id}/rights/${id}`
      );

      if (res.meta.status !== 200) return this.$message.info("删除权限失败");

      e.children = res.data;
      console.log(res);
    },
    async showSetRightDialog(role) {
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status !== 200) return this.$message.info("获取权限失败");

      this.rightList = res.data;
      console.log(this.rightList);

      this.getLeafKeys(role, this.defkeys);
      this.setRightDialogVisible = true;
      this.RoleId = role.id;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed() {
      this.defkeys = [];
    },
<<<<<<< HEAD
        // 确认分配权限
=======
    // 确认分配权限
>>>>>>> rights
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.RoleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status !== 200) return this.$message.error("更新失败");

      this.$message.success("更新成功");
      this.getRoleList();
      this.setRightDialogVisible = false;
<<<<<<< HEAD
=======
      console.log(res);
    },
    // 重置新增对话框
    addDialogClosed(){
      this.$refs.addFromRef.resetFields()
    },
    // 新增
    addRole(){
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addFrom);
        console.log(res, this.addFrom);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }

        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getRoleList();
      });
    },
    // 编辑对话框
    async showEditDialog(id){
      console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.editFrom = res.data;
      console.log(res);
      this.editDialogVisible = true
    },
    // 确定提交修改
    editRoleInfo(){
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return this.$message.error("修改失败");

        const { data: res } = await this.$http.put(
          "roles/" + this.editFrom.roleId,
          {
            roleName: this.editFrom.roleName,
            roleDesc: this.editFrom.roleDesc,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.editDialogVisible = false;
        this.getRoleList();
      });
      console.log(this.editFrom);
    },
    // 编辑对话框关闭
    editDialogClosed(){
      this.$refs.editFromRef.resetFields();
    },
    async removeUser(id){
       const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(result);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getRoleList();
>>>>>>> rights
      console.log(res);
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
  margin-left: 3rem;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>