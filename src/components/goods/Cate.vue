<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/weclome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            change-on-select
            collapse-tags
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setCateDialogVisible"
      width="50%"
      @close="setCateDialogClose"
    >
      <el-form
        :model="setCate"
        :rules="setCateFromRules"
        label-width="100px"
        ref="setCateFrom"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="setCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 添加分类对话框
      addCateDialogVisible: false,
      addCateFrom: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类验证规则
      addCateFromRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      selectedKeys: [],
      // 编辑对话框
      setCateDialogVisible: false,
      // 编辑内容
      setCate: {
        cat_name:''
      },
      // 编辑规则
      setCateFromRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      saveCateId: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(res.data);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 展开添加分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });

      if (res.meta.status !== 200) return this.$message.error("获取数据失败");

      this.parentCateList = res.data;
      console.log(res.data);
    },
    // 选择项发生变化
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateFrom.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateFrom.cat_level = this.selectedKeys.length - 1;
        return;
      } else {
        this.addCateFrom.cat_pid = 0;
        this.addCateFrom.cat_level = 0;
      }

      console.log(this.selectedKeys);
    },
    addCate() {
      console.log(this.addCateFrom);
      this.$refs.addCateFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateFrom
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加失败");

        this.$message.success("添加成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 对话框挂关闭
    addCateDialogClose() {
      this.$refs.addCateFromRef.resetFields();
      this.selectedKeys = [];
      this.addCateFrom.cat_pid = 0;
      this.addCateFrom.cat_level = 0;
    },
    // 删除
    async removeCateById(id) {
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

      const { data: res } = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.info("删除分类失败");
      this.$message.success("删除分类成功");
      this.getCateList();
      console.log(id);
    },
    // 打开编辑对话框
    editCate(id) {
      console.log(id);
      this.saveCateId = id
      this.setCateDialogVisible = true;
    },
    saveCateInfo() {
      console.log(this.setCate);
      this.$refs.setCateFrom.validate(async (valid) => {
        if (!valid) return this.$message.error("修改失败");

        const { data: res } = await this.$http.put(
          `categories/${this.saveCateId}`,
          {
            cat_name: this.setCate.cat_name
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.setCateDialogVisible = false;
        this.getCateList();
      });
    },
    setCateDialogClose(){
      this.$refs.setCateFrom.resetFields()
    }
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>