<template>
  <v-main class="bg-grey-lighten-2">
    <v-container fluid class="mt-6">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="rounded-lg shadow-lg overflow-hidden">
            <!-- Form Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
              <h1 class="text-h4 font-weight-bold text-center mb-2">
                ออกเยี่ยมบ้านนักศึกษา
              </h1>
            </div>

            <v-card-text class="pa-6">
              <!-- Student Information Card -->
              <div v-if="student" class="mb-8">
                <v-card outlined class="rounded-lg border-2 border-gray-200">
                  <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
                    <v-card-title class="text-h5 text-blue-900">
                      <v-icon color="blue-darken-2" class="mr-2">
                        mdi-account-circle
                      </v-icon>
                      <strong>ข้อมูลนักศึกษา</strong>
                    </v-card-title>
                  </div>

                  <v-card-text class="pa-6">
                    <v-row>
                      <!-- ชื่อ-นามสกุล -->
                      <v-col cols="12" md="6">
                        <div class="mb-4">
                          <label class="text-gray-600 text-sm text-h6 font-medium mb-1">
                            <strong>ชื่อ - นามสกุล</strong>
                          </label>
                          <p class="text-lg font-medium">
                            {{ student.fullName || "-" }}
                          </p>
                        </div>
                      </v-col>

                      <!-- รหัสนักศึกษา -->
                      <v-col cols="12" md="6">
                        <div class="mb-4">
                          <label class="text-gray-600 text-sm text-h6 font-medium mb-1">
                            <strong>รหัสนักศึกษา</strong>
                          </label>
                          <p class="text-lg font-medium">
                            {{ student.studentID || "-" }}
                          </p>
                        </div>
                      </v-col>

                      <!-- ที่อยู่นักศึกษา -->
                      <v-col cols="12">
                        <div class="mb-4">
                          <label class="text-gray-600 text-sm text-h6 font-medium mb-1">
                            <strong>ที่อยู่นักศึกษา</strong>
                          </label>
                          <div class="text-lg mt-4">
                            <v-row>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>บ้านเลขที่:</strong>
                                  {{ student.address?.houseNo || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>หมู่ที่:</strong>
                                  {{ student.address?.villageNo || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>ถนน:</strong>
                                  {{ student.address?.road || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>ตำบล:</strong>
                                  {{ student.address?.subDistrict || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>อำเภอ:</strong>
                                  {{ student.address?.district || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>จังหวัด:</strong>
                                  {{ student.address?.province || "-" }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="3">
                                <p>
                                  <strong>รหัสไปรษณีย์:</strong>
                                  {{ student.address?.postalCode || "-" }}
                                </p>
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Map Section -->
              <div v-if="student && student.address" class="mb-6">
                <h3 class="text-h6 font-weight-medium mb-4 text-gray-800">
                  <v-icon color="blue-darken-2" class="mr-2">mdi-map-marker</v-icon>
                  ตำแหน่งที่ตั้งบนแผนที่
                </h3>
                <div class="rounded-lg overflow-hidden shadow-md">
                  <iframe
                    :src="mapUrl"
                    width="100%"
                    height="450"
                    frameborder="0"
                    style="border: 0"
                    allowfullscreen=""
                    loading="lazy"
                    class="w-full"
                  ></iframe>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-8">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                ></v-progress-circular>
                <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>

              <!-- Error State -->
              <v-alert v-if="errorMessage" type="error" class="mb-6" closable>
                {{ errorMessage }}
              </v-alert>
            </v-card-text>
            <v-card-actions class="pa-6">
              <v-spacer></v-spacer>
              <v-btn color="error" @click="cancelProcess" outlined> ยกเลิก </v-btn>
              <v-btn color="primary" @click="finishProcess" outlined> เสร็จสิ้น </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
  name: "StudentVisitForm",
  data() {
    return {
      loading: false,
      errorMessage: "",
      student: {
        fullName: "",
        studentID: "",
        address: {
          houseNo: "",
          villageNo: "",
          road: "",
          subDistrict: "",
          district: "",
          province: "",
          postalCode: "",
        },
      },
      currentVisitId: null, // สำหรับเก็บ visit_id ที่ได้จาก query หรือ localStorage
    };
  },
  mounted() {
    console.log("TeacherStudentMap - Route query:", this.$route.query);
    console.log("Route params id:", this.$route.params.id);
    const studentId = this.$route.params.id;
    if (studentId) {
      this.fetchStudentData(studentId);
    }
    // ตรวจสอบ query parameter "visit_id"
    if (this.$route.query && this.$route.query.visit_id) {
      this.currentVisitId = this.$route.query.visit_id;
      console.log("Current visit_id from query:", this.currentVisitId);
      localStorage.setItem("visit_id", this.currentVisitId);
    } else {
      // หากไม่มีใน query ให้ลองดึงจาก localStorage
      const storedVisitId = localStorage.getItem("visit_id");
      if (storedVisitId) {
        this.currentVisitId = storedVisitId;
        console.log("Retrieved currentVisitId from localStorage:", this.currentVisitId);
        // อัปเดต URL ให้มี query parameter visit_id (ใช้ router.replace เพื่อไม่สร้างประวัติใหม่)
        this.$router.replace({
          query: { ...this.$route.query, visit_id: storedVisitId },
        });
      } else {
        console.log("No visit_id found in query or localStorage");
      }
    }
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchStudentData(newId);
        }
      },
    },
    "$route.query.visit_id": {
      immediate: true,
      handler(newVisitId) {
        if (newVisitId) {
          this.currentVisitId = newVisitId;
          console.log("Updated current visit_id from watch:", this.currentVisitId);
          localStorage.setItem("visit_id", this.currentVisitId);
        } else {
          console.log("No visit_id in query from watch");
        }
      },
    },
  },
  methods: {
    async fetchStudentData(studentId) {
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await axios.get(
          `http://localhost:7000/teacher/student/${studentId}`
        );
        console.log("Fetched student data:", response.data);
        const data = response.data;
        // หาก API ส่งข้อมูลภายใน field "student"
        if (data.student) {
          this.student = {
            ...this.student,
            ...data.student,
            address: data.student.address
              ? { ...this.student.address, ...data.student.address }
              : { ...this.student.address },
          };
        } else {
          // กรณี API ส่งข้อมูลเป็น object โดยตรง
          this.student = {
            ...this.student,
            ...data,
            address: data.address
              ? { ...this.student.address, ...data.address }
              : { ...this.student.address },
          };
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
        this.errorMessage = "ไม่สามารถดึงข้อมูลนักศึกษาได้ กรุณาลองใหม่อีกครั้ง";
      } finally {
        this.loading = false;
      }
    },
    async finishProcess() {
      console.log("Finishing visit with id:", this.currentVisitId);
      if (!this.currentVisitId) {
        this.$toast && this.$toast.error("ไม่พบ visit_id สำหรับการทำรายการเสร็จสิ้น");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        this.$toast && this.$toast.error("ไม่พบ token สำหรับการยืนยันตัวตน");
        return;
      }
      try {
        const response = await axios.patch(
          `http://localhost:7000/teacher/edit/home_visits/${this.currentVisitId}`,
          { visit_status: "เยี่ยมบ้านแล้ว" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Finish process response:", response.data);
        this.$toast && this.$toast.success("การเยี่ยมบ้านเสร็จสิ้นแล้ว");
        this.$router.push("/teacher");
        this.currentVisitId = null;
        localStorage.removeItem("visit_id");
      } catch (error) {
        console.error("Error finishing visit:", error);
        // ถ้าได้รับ error 404 ให้แจ้งเตือนและ redirect กลับไปหน้าหลัก
        if (error.response && error.response.status === 404) {
          this.$toast &&
            this.$toast.error("ไม่พบข้อมูลการเยี่ยมบ้านที่ต้องการทำรายการเสร็จสิ้น");
          this.$router.push("/teacher");
          localStorage.removeItem("visit_id");
        } else {
          const errorMsg =
            (error.response && error.response.data && error.response.data.error) ||
            error.message ||
            "ไม่สามารถทำรายการเสร็จสิ้นได้";
          this.$toast && this.$toast.error(errorMsg);
        }
      }
    },
    async cancelProcess() {
      console.log("cancelProcess ถูกเรียกแล้ว");
      if (!this.currentVisitId) {
        this.$toast && this.$toast.error("ไม่พบ visit_id สำหรับการยกเลิก");
        return;
      }
      console.log("Cancelling visit with id:", this.currentVisitId);
      const token = localStorage.getItem("token");
      if (!token) {
        this.$toast && this.$toast.error("ไม่พบ token สำหรับการยืนยันตัวตน");
        return;
      }
      try {
        await axios.delete(
          `http://localhost:7000/teacher/home_visits/${this.currentVisitId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.$toast && this.$toast.info("ยกเลิกการเยี่ยมบ้านแล้ว");
        this.$router.push("/teacher");
        this.currentVisitId = null;
        localStorage.removeItem("visit_id");
      } catch (error) {
        console.error("Error cancelling visit:", error);
        if (error.response && error.response.status === 404) {
          this.$toast && this.$toast.error("ไม่พบข้อมูลการเยี่ยมบ้านที่ต้องการยกเลิก");
          this.$router.push("/teacher");
          localStorage.removeItem("visit_id");
        } else {
          const errorMsg =
            (error.response && error.response.data && error.response.data.error) ||
            error.message ||
            "ไม่สามารถยกเลิกการเยี่ยมบ้านได้";
          this.$toast && this.$toast.error(errorMsg);
        }
      }
    },

      async updateVisitStatus(visitId, newStatus) {
      console.log("Updating visit status:", visitId, newStatus);
      if (!visitId) {
        this.$toast && this.$toast.error("ไม่พบ visit_id สำหรับการอัปเดตสถานะ");
        return;
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        this.$toast && this.$toast.error("ไม่พบ token สำหรับการยืนยันตัวตน");
        return;
      }

      try {
        const response = await axios.patch(
          `http://localhost:7000/teacher/home_visits/${visitId}`,
          { visit_status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Update status response:", response.data);
        this.$toast && this.$toast.success(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
        
        // ถ้าสถานะเป็น "เยี่ยมบ้านแล้ว" ให้ redirect กลับไปหน้าหลัก
        if (newStatus === "เยี่ยมบ้านแล้ว") {
          this.$router.push("/teacher");
          this.currentVisitId = null;
          localStorage.removeItem("visit_id");
        }
        
        // Emit event เพื่อให้ parent component รู้ว่ามีการอัปเดตสถานะ
        this.$emit('status-updated', { visitId, newStatus });
        
        return true;
      } catch (error) {
        console.error("Error updating visit status:", error);
        if (error.response && error.response.status === 404) {
          this.$toast && this.$toast.error("ไม่พบข้อมูลการเยี่ยมบ้านที่ต้องการอัปเดตสถานะ");
          this.$router.push("/teacher");
          localStorage.removeItem("visit_id");
        } else {
          const errorMsg =
            (error.response && error.response.data && error.response.data.error) ||
            error.message ||
            "ไม่สามารถอัปเดตสถานะได้";
          this.$toast && this.$toast.error(errorMsg);
        }
        return false;
      }
    },

    // ปรับปรุงฟังก์ชัน finishProcess ให้ใช้ updateVisitStatus
    async finishProcess() {
      return this.updateVisitStatus(this.currentVisitId, "เยี่ยมบ้านแล้ว");
    },

    // ปรับปรุงฟังก์ชัน startVisitFromTable
    async startVisitFromTable(student) {
      const clientVisitId = this.generateVisitId();
      const token = localStorage.getItem("token");
      
      try {
        const response = await axios.post(
          "http://localhost:7000/teacher/home_visits",
          {
            visit_id: clientVisitId,
            student_id: student.student_id,
            teacher_id: this.teacher_id,
            visit_date: new Date().toISOString().split("T")[0],
            visit_status: "กำลังเยี่ยม", // เปลี่ยนสถานะเริ่มต้นเป็น "กำลังเยี่ยม"
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const createdVisitId = response.data.visit_id || response.data.id;
        console.log("Created home visit, received id:", createdVisitId);
        this.currentVisitId = createdVisitId;
        
        this.$router.push({
          path: `/teacher/studentmap/${student.student_id}`,
          query: { visit_id: createdVisitId },
        });
      } catch (error) {
        console.error("Error creating home visit:", error);
        this.$toast && this.$toast.error("ไม่สามารถเริ่มการเยี่ยมบ้านได้ในขณะนี้");
      }
    }
  },
  computed: {
    mapUrl() {
      if (this.student && this.student.address) {
        const {
          houseNo,
          road,
          subDistrict,
          district,
          province,
          postalCode,
        } = this.student.address;
        const addressStr = `${houseNo} ${road} ${subDistrict} ${district} ${province} ${postalCode}`;
        return `https://maps.google.com/maps?q=${encodeURIComponent(
          addressStr
        )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
      return "";
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

/* .v-card:hover {
    transform: translateY(-2px);
  } */

.border-2 {
  border-width: 2px;
}

.rounded-xl {
  border-radius: 1rem;
}

.bg-gradient-to-r {
  background: linear-gradient(to right, var(--v-theme-primary), var(--v-theme-secondary));
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
