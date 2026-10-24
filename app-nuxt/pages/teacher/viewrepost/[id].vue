<template>
  <v-main>
    <v-container fluid class="pa-6">
      <v-card class="mx-auto report-card" elevation="2">
        <v-card-text class="pa-8">
          <!-- Report Header -->
          <div class="report-header text-center mb-8">
            <h1 class="text-h4 font-weight-bold mb-2">รายงานการเยี่ยมบ้านนักศึกษา</h1>
            <h2 class="text-h5 mb-2">วิทยาลัยเทคนิคชัยภูมิ</h2>
            <p class="text-subtitle-1">{{ report.semester_name }}</p>
            <p class="text-subtitle-2">วันที่พิมพ์: {{ getCurrentDate() }}</p>
          </div>

          <!-- Student Information Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">1. ข้อมูลนักศึกษา</h3>
            </div>
            <v-row class="mt-4" dense>
              <v-col cols="12" sm="6">
                <div class="info-group">
                  <span class="info-label">ชื่อ-นามสกุล:</span>
                  <span class="info-value">{{ report.student_name }}</span>
                </div>
                <div class="info-group mt-2">
                  <span class="info-label">รหัสนักศึกษา:</span>
                  <span class="info-value">{{ report.student_number }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-group">
                  <span class="info-label">ห้อง:</span>
                  <span class="info-value">{{ report.student_room }}</span>
                </div>
                <div class="info-group mt-2">
                  <span class="info-label">เบอร์โทร:</span>
                  <span class="info-value">{{ report.student_phone }}</span>
                </div>
              </v-col>
            </v-row>
          </section>

          <!-- Visit Information Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">
                2. ข้อมูลการเยี่ยมบ้าน
              </h3>
            </div>
            <v-row class="mt-4" dense>
              <v-col cols="12" sm="6">
                <div class="info-group">
                  <span class="info-label">วันที่เยี่ยมบ้าน:</span>
                  <span class="info-value">{{ formatDate(report.visit_date) }}</span>
                </div>
              </v-col>
            </v-row>
          </section>

          <!-- Report Details Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">
                3. รายละเอียดการเยี่ยมบ้าน
              </h3>
            </div>
            <v-row class="mt-4" dense>
              <v-col cols="12" sm="6">
                <v-card class="detail-card" flat>
                  <div class="detail-header">สภาพแวดล้อมที่พักอาศัย</div>
                  <div class="detail-content">{{ report.environment_condition }}</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="detail-card" flat>
                  <div class="detail-header">การปฏิบัติตนของนักศึกษา</div>
                  <div class="detail-content">{{ report.student_behavior }}</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="detail-card" flat>
                  <div class="detail-header">สถานะทางการเงินของครอบครัว</div>
                  <div class="detail-content">{{ report.family_finance }}</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="detail-card" flat>
                  <div class="detail-header">ความต้องการทุนการศึกษา</div>
                  <div class="detail-content">{{ report.scholarship_need }}</div>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Behavior and Suggestions Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">
                4. พฤติกรรมและข้อเสนอแนะ
              </h3>
            </div>
            <v-row class="mt-4" dense>
              <v-col cols="12">
                <v-card class="detail-card" flat>
                  <div class="detail-header">พฤติกรรมเชิงบวก</div>
                  <div class="detail-content">{{ report.positive_behavior }}</div>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="detail-card" flat>
                  <div class="detail-header">ปัญหาและแนวทางแก้ไข</div>
                  <div class="detail-content">{{ report.problem_solving }}</div>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Feedback Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">
                5. ความคิดเห็นและข้อเสนอแนะ
              </h3>
            </div>
            <v-row class="mt-4" dense>
              <v-col cols="12">
                <v-card class="detail-card" flat>
                  <div class="detail-header">ความคิดเห็นของผู้ปกครอง</div>
                  <div class="detail-content">{{ report.parent_feedback }}</div>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="detail-card" flat>
                  <div class="detail-header">ข้อเสนอแนะของครูที่ปรึกษา</div>
                  <div class="detail-content">{{ report.suggestion }}</div>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- New Image Section -->
          <section class="section-container">
            <div class="section-header">
              <h3 class="text-h5 font-weight-bold primary--text">
                6. ภาพถ่ายการเยี่ยมบ้าน
              </h3>
            </div>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                v-for="(imgUrl, index) in report.images"
                :key="index"
              >
                <v-card>
                  <v-img :src="imgUrl" :alt="`ภาพที่ ${index + 1}`" cover>
                    <template #placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary" />
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Signature Section -->
          <section class="signature-section mt-8">
            <v-row justify="space-between">
              <v-col cols="5" class="text-center">
                <div class="signature-box">
                  <p class="signature-line">
                    ลงชื่อ ................................................
                  </p>
                  <p class="signature-line">
                    ( ................................................ )
                  </p>
                  <p class="signature-title">ครูที่ปรึกษา</p>
                  <p class="signature-date">วันที่ ........../........../..........</p>
                </div>
              </v-col>
              <v-col cols="5" class="text-center">
                <div class="signature-box">
                  <p class="signature-line">
                    ลงชื่อ ................................................
                  </p>
                  <p class="signature-line">
                    ( ................................................ )
                  </p>
                  <p class="signature-title">เจ้าหน้าที่งานครูที่ปรึกษา</p>
                  <p class="signature-date">วันที่ ........../........../..........</p>
                </div>
              </v-col>
            </v-row>
          </section>
        </v-card-text>
        <v-btn
                      color="grey"
                      variant="outlined"
                      class="mr-4 ma-4"
                      @click="goBack"
                      prepend-icon="mdi-arrow-left"
                    >
                      กลับ
                    </v-btn>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  layout: "layoutteacher",
});

const route = useRoute();
const router = useRouter();

const report = reactive({
  student_name: "",
  student_number: "",
  student_room: "",
  student_phone: "",
  visit_date: "",
  visit_status: "",
  environment_condition: "",
  student_behavior: "",
  family_finance: "",
  scholarship_need: "",
  positive_behavior: "",
  problem_solving: "",
  parent_feedback: "",
  suggestion: "",
  semester_name:"",
  images: [],
});

const isLoading = ref(false);
const errorMsg = ref("");

const getCurrentDate = () => {
  return new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fetchReport = async (visitId) => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      errorMsg.value = "ไม่พบ Token กรุณาเข้าสู่ระบบ";
      router.push("/login");
      return;
    }
    const response = await axios.get(`http://localhost:7000/teacher/report/${visitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Object.assign(report, response.data);
  } catch (error) {
    console.error("Error fetching report:", error);
    errorMsg.value = "ไม่สามารถดึงข้อมูลได้: " + (error.message || error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchReport(id);
  }
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchReport(newId);
    }
  }
);

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.report-card {
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Sarabun", sans-serif;
}

.section-container {
  margin-top: 32px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.section-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--v-primary-base);
}

.info-group {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.info-label {
  font-weight: 600;
  color: #666;
  min-width: 120px;
}

.info-value {
  flex: 1;
}

.detail-card {
  padding: 16px;
  margin-bottom: 16px;
  background-color: white !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px;
}

.detail-header {
  font-weight: 600;
  color: var(--v-primary-base);
  margin-bottom: 8px;
  font-size: 1.1em;
}

.detail-content {
  white-space: pre-line;
  color: #333;
}

.signature-section {
  margin-top: 48px;
}

.signature-box {
  padding: 16px;
}

.signature-line {
  margin-bottom: 4px;
  font-size: 1.1em;
}

.signature-title {
  margin-top: 8px;
  font-weight: 600;
}

.signature-date {
  margin-top: 8px;
  color: #666;
}
</style>
