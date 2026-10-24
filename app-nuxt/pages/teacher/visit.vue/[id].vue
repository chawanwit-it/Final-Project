<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card outlined class="rounded-xl shadow-lg">
            <v-card-title class="text-h5">
              รายงานการเยี่ยมบ้านนักเรียน
            </v-card-title>
            <v-card-text>
              <p><strong>รหัสนักเรียน:</strong> {{ student.id }}</p>
              <p><strong>ชื่อ:</strong> {{ student.first_name }} {{ student.last_name }}</p>
              <p><strong>ห้อง:</strong> {{ student.class }}</p>
              <p><strong>วันที่ออกเยี่ยม:</strong> {{ visitData.visit_date }}</p>

              <v-divider></v-divider>
              <p><strong>สภาพแวดล้อมที่บ้าน:</strong> {{ visitData.environment_condition }}</p>
              <p><strong>พฤติกรรมของนักเรียน:</strong> {{ visitData.student_behavior }}</p>
              <p><strong>ข้อเสนอแนะจากครู:</strong> {{ visitData.suggestion }}</p>

              <!-- ภาพจากการเยี่ยมบ้าน -->
              <v-img v-if="visitData.image" :src="visitData.image" alt="ภาพการเยี่ยมบ้าน" aspect-ratio="1" class="rounded-lg" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      student: {},
      visitData: {},
      errorMessage: "",
    };
  },
  async created() {
    const studentId = this.$route.params.id; // ดึง studentId จาก URL
    try {
      // ดึงข้อมูลนักเรียนจาก API
      const studentResponse = await this.$axios.get(`/teacher/student/${studentId}`);
      this.student = studentResponse.data;

      // ดึงข้อมูลการเยี่ยมบ้านจาก API
      const visitResponse = await this.$axios.get(`/teacher/studentVisit/${studentId}`);
      this.visitData = visitResponse.data;
    } catch (error) {
      this.errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Error fetching data.";
      console.error(this.errorMessage);
    }
  },
};
</script>

<style scoped>
/* ปรับแต่งสไตล์ */
.v-card {
  margin-top: 20px;
}
</style>
