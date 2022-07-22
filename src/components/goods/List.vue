<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/weclome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      width="50%"
    >
      <!-- 内容 -->
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editFrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input v-model="editFrom.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editFrom.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editFrom.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
      editDialogVisible: false,
      editFrom: {},
      editFromRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 删除
    async removeById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(`goods/${id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("修改删除失败");
      }
      this.$message.success("参数删除成功");
      this.getGoodsList();
    },
    // 点击添加商品
    goAddPage() {
      this.$router.push("/goods/add");
    },
    // 修改
    async showEditDialog(id) {
      console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`goods/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.editFrom = res.data;
      // console.log(this.editFrom);
    },
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    // 提交修改
    editUserInfo() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return this.$message.error("修改失败");

        const { data: res } = await this.$http.put(
          "goods/" + this.editFrom.goods_id,
          this.editFrom
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>