<template>
  <v-main>
    <v-container fluid class="pa-md-12">
      <!-- wrap เนื้อหาที่ต้องการพิมพ์ไว้ใน section พร้อม ref -->
      <h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold">
        นักเรียนที่เยี่ยมบ้านสำเร็จ
        <!-- แสดงปุ่มเมื่อมีการเลือกแถวอย่างน้อย 1 แถว -->
        <v-btn
          v-if="selected.length > 0"
          class="text-none"
          color="primary"
          rounded="lg"
          slim
          variant="flat"
          @click="goToPrintReports"
        >
          พิมพ์รายงานที่เลือกทั้งหมด
        </v-btn>
      </h3>

      <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
        รายชื่อนักเรียนที่มีสถานะเยี่ยมบ้านแล้ว
      </div>

      <!-- ตารางแสดงข้อมูลนักเรียนที่เยี่ยมบ้านแล้ว -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="students"
        item-value="student_id"
        items-per-page="5"
        return-object
        show-select
      >
        <!-- แสดงสถานะด้วย v-chip -->
        <template #item.status="data">
          <v-chip :color="getColor(data.item.status)">
            {{ data.item.status }}
          </v-chip>
        </template>

        <!-- ปุ่มดูรายงาน -->
        <template #item.actions-edit="data">
          <v-btn
            :to="data.item.student_id ? '/teacher/printReport/' + data.item.visit_id : '#'"
            class="text-none"
            color="primary"
            style="min-width: 0"
            slim
            variant="text"
          >
            พิมพ์รายงาน
          </v-btn>
        </template>

        <!-- ปุ่มรายงาน (ตัวเลือกเพิ่มเติม) -->
        <template #item.actions="data">
          <v-btn
            v-if="data.item.student_id"
            :to="{
              name: data.item.is_reported
                ? 'teacher-viewrepost-id'
                : 'teacher-studentrepost-id',
              params: { id: data.item.visit_id },
            }"
            class="text-none"
            color="primary"
            style="min-width: 0"
            slim
            variant="text"
          >
            {{ data.item.is_reported ? "ดูข้อมูล" : "รายงานผล" }}
          </v-btn>

          <!-- เพิ่มปุ่ม "แก้ไข" เมื่อรายงานเสร็จแล้ว -->
          <v-btn
            v-if="data.item.student_id && data.item.is_reported"
            :to="{
              name: 'teacher-editreport-id',
              params: { id: data.item.visit_id },
            }"
            class="text-none ml-2"
            color="secondary"
            style="min-width: 0"
            slim
            variant="text"
          >
            แก้ไข
          </v-btn>

          <!-- กรณี student_id ไม่มี จะแสดงปุ่ม disabled หรือไม่ก็แล้วแต่ -->
          <v-btn
            v-else
            disabled
            class="text-none"
            color="primary"
            style="min-width: 0"
            slim
            variant="text"
          >
            ไม่มีข้อมูล
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </v-main>
</template>

<script setup>
definePageMeta({
  layout: "layoutteacher",
});
</script>

<script>
import axios from "axios";

export default {
  name: "VisitedStudents",
  data() {
    return {
      selected: [],
      headers: [
        { title: "ชื่อ-นามสกุล", key: "name", align: "start" },
        { title: "ห้อง", key: "room", align: "center" },
        { title: "เบอร์โทร", key: "phone", align: "center" },
        { title: "สถานะ", key: "status", align: "center" },
        { title: "", key: "actions", align: "center" },
        { title: "", key: "actions-edit", align: "center" },
        { title: "", key: "actions-view", align: "center" },
      ],
      students: [],
      selected: [],

    };
  },
  mounted() {
    this.fetchVisitedStudents();
  },
  methods: {
    async fetchVisitedStudents() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("ไม่มี token ใน localStorage");
          this.$router.push("/login");
          return;
        }
        const res = await axios.get("http://localhost:7000/teacher/visited-students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map ข้อมูลที่ได้รับและเพิ่ม property is_reported โดยเช็คที่คอลัมน์ image
        const mappedStudents = res.data.map((student) => ({
          student_id: student.student_id,
          visit_id: student.visit_id,
          name: student.student_name,
          room: student.student_room,
          phone: student.student_phone,
          status: student.visit_status,
          is_reported: student.image && student.image.trim() !== "" ? true : false,
        }));
        this.students = mappedStudents;
      } catch (error) {
        console.error("Error fetching visited students:", error);
      }
    },
    // กำหนดสีของ v-chip ตามสถานะ
    getColor(status) {
      if (status === "ยังไม่เยี่ยม") return "orange";
      else if (status === "เยี่ยมบ้านแล้ว" || status === "เยี่ยมบ้านสำเร็จ")
        return "green";
      return "grey";
    },
        // ฟังก์ชันเปลี่ยนเส้นทางไปหน้าปริ้น
        goToPrintReports() {
      // ส่งเฉพาะ visit_id ของรายการที่เลือก (หรือส่งทั้งข้อมูล)
      const selectedIds = this.selected.map(item => item.visit_id);
      this.$router.push({ name: 'PrintableReports', query: { ids: JSON.stringify(selectedIds) } });
    },
  },
};
</script>

<style scoped>
.v-data-table {
  font-size: 16px;
}
.v-simple-table th,
.v-simple-table td {
  padding: 20px 24px;
}
.large-text th,
.large-text td {
  font-size: 18px;
}
</style>
