<template>
  <v-main class="bg-grey-lighten-2">
    <v-container fluid class="mt-n16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card outlined class="rounded-lg shadow-lg">
            <!-- ส่วนหัวของฟอร์ม: แสดงชื่อและปุ่มกลับ -->
            <v-card-title class="d-flex justify-space-between align-center bg-blue-600 py-4">
              <span class="text-h4 white--text">แก้ไขรายงานการเยี่ยมบ้านนักศึกษา</span>
              <v-btn color="white" text @click="goBack">
                <v-icon left>mdi-arrow-left</v-icon>
                กลับ
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <!-- แสดงข้อความ error -->
              <v-alert
                v-if="errorMessage"
                type="error"
                dismissible
                class="mb-4"
                @input="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>
              <!-- แบบฟอร์มแก้ไขรายงาน -->
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="handleSubmit">
                <v-row dense>
                  <!-- 1. สภาพแวดล้อมบริเวณบ้าน -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h5">1. สภาพแวดล้อมบริเวณบ้าน</v-subheader>
                    <v-radio-group v-model="advisorHomeEnvironment" row>
                      <v-radio label="สภาพแวดล้อมดี" value="ดี" color="primary" class="mr-4"></v-radio>
                      <v-radio label="สภาพแวดล้อมพอใช้" value="พอใช้" color="primary" class="mr-4"></v-radio>
                      <v-radio label="สภาพแวดล้อมไม่ดี" value="ไม่ดี" color="primary" class="mr-4"></v-radio>
                      <v-radio label="สภาพแวดล้อมควรปรับปรุง" value="ควรปรับปรุง" color="primary"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- 2. การปฏิบัติตนของนักเรียน/นักศึกษา -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h5">2. การปฏิบัติตนของนักเรียน/นักศึกษา</v-subheader>
                    <v-checkbox-group v-model="advisorStudentBehavior" row>
                      <v-checkbox
                        v-for="option in advisorStudentBehaviorOptions"
                        :key="option"
                        :label="option"
                        :value="option"
                        color="primary"
                        class="mr-4"
                      ></v-checkbox>
                    </v-checkbox-group>
                    <v-textarea
                      v-model="advisorStudentBehaviorOther"
                      label="อื่นๆ (ระบุ)"
                      outlined
                      dense
                      class="mt-2"
                      rows="2"
                      variant="underlined"
                    ></v-textarea>
                  </v-col>
                  <!-- 3. รายได้การใช้จ่ายในครอบครัว -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h5">3. รายได้การใช้จ่ายในครอบครัว</v-subheader>
                    <v-radio-group v-model="advisorFamilyFinance" row>
                      <v-radio label="เพียงพอ" value="เพียงพอ" color="primary" class="mr-4"></v-radio>
                      <v-radio label="บางครั้งไม่เพียงพอ" value="บางครั้งไม่เพียงพอ" color="primary" class="mr-4"></v-radio>
                      <v-radio label="ไม่เพียงพอ" value="ไม่เพียงพอ" color="primary"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- 4. ความต้องการทุนการศึกษา -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h5">4. ทุนการศึกษา</v-subheader>
                    <v-radio-group v-model="advisorScholarshipNeed" row>
                      <v-radio label="ไม่ต้องการ" value="ไม่ต้องการ" color="primary" class="mr-4"></v-radio>
                      <v-radio label="ต้องการ" value="ต้องการ" color="primary"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- 5. พฤติกรรมและข้อเสนอแนะ -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h5">5. พฤติกรรมและข้อเสนอแนะ</v-subheader>
                    <v-textarea
                      v-model="advisorPositiveBehavior"
                      label="พฤติกรรมที่ดี"
                      outlined
                      variant="underlined"
                      rows="2"
                      class="mb-3"
                    ></v-textarea>
                    <v-textarea
                      v-model="advisorImprovementBehavior"
                      label="พฤติกรรมที่ต้องปรับปรุง"
                      outlined
                      variant="underlined"
                      rows="2"
                      class="mb-3"
                    ></v-textarea>
                    <v-textarea
                      v-model="advisorProblemSolving"
                      label="ปัญหา / แนวทางการแก้ปัญหา"
                      outlined
                      variant="underlined"
                      rows="2"
                      class="mb-3"
                    ></v-textarea>
                    <v-textarea
                      v-model="advisorParentOpinion"
                      label="ความคิดเห็นของผู้ปกครอง"
                      outlined
                      variant="underlined"
                      rows="2"
                      class="mb-3"
                    ></v-textarea>
                    <v-textarea
                      v-model="advisorTeacherSuggestion"
                      label="ข้อเสนอแนะของครูที่ปรึกษา"
                      outlined
                      variant="underlined"
                      rows="2"
                    ></v-textarea>
                  </v-col>
                  <!-- 6. รูปภาพ -->
                  <v-col cols="12" class="mb-4">
                    <v-subheader class="mt-4 text-h6 font-weight-bold text-primary">
                      6. รูปภาพ (2-3 รูป)
                    </v-subheader>
                    <v-file-input
                      v-model="advisorUploadedImages"
                      label="เลือกรูปภาพ"
                      multiple
                      accept="image/*"
                      variant="outlined"
                      prepend-icon="mdi-camera"
                      dense
                      class="mt-3 custom-file-input"
                      @change="openDialog"
                      clearable
                      :rules="[ (v) => !v || v.length <= 3 || 'กรุณาเลือกรูปภาพไม่เกิน 3 รูป' ]"
                      :show-size="true"
                      hint="รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB"
                    ></v-file-input>
                    <!-- Preview Dialog -->
                    <v-dialog v-model="dialogConfirm" max-width="800">
                      <v-card class="pa-4">
                        <v-card-title class="text-h6 pb-4">
                          ตัวอย่างรูปภาพที่เลือก
                        </v-card-title>
                        <v-card-text>
                          <v-row dense class="mx-0" align="center" justify="center">
                            <v-col
                              v-for="(file, index) in advisorUploadedImages"
                              :key="index"
                              cols="12"
                              class="py-2"
                            >
                              <v-card elevation="4" class="rounded-lg overflow-hidden">
                                <v-img
                                  :src="getImageUrl(file)"
                                  height="200"
                                  class="grey lighten-2"
                                  cover
                                >
                                  <template #placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                      <v-progress-circular indeterminate color="primary" />
                                    </v-row>
                                  </template>
                                </v-img>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="grey" variant="text" @click="cancelShowImages">
                            ยกเลิก
                          </v-btn>
                          <v-btn color="primary" variant="elevated" @click="confirmShowImages">
                            ยืนยัน
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <!-- Main Preview -->
                    <v-slide-y-transition>
                      <div v-if="showImagesPreview" class="mt-4">
                        <v-row dense class="mx-0">
                          <v-col
                            v-for="(file, index) in advisorUploadedImages"
                            :key="index"
                            cols="12"
                            sm="6"
                            md="4"
                            class="pa-2"
                          >
                            <v-card elevation="1" class="rounded-lg overflow-hidden">
                              <v-img
                                :src="getImageUrl(file)"
                                height="200"
                                class="grey lighten-2"
                                :aspect-ratio="4 / 3"
                                cover
                              >
                                <template v-slot:placeholder>
                                  <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                              <v-btn
                                icon
                                size="small"
                                color="error"
                                variant="flat"
                                class="remove-btn"
                                @click="removeImage(index)"
                              >
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </v-card>
                          </v-col>
                        </v-row>
                      </div>
                    </v-slide-y-transition>
                  </v-col>
                </v-row>
                <!-- ปุ่มบันทึกและกลับ -->
                <v-row class="mt-10">
                  <v-col cols="12" class="text-right">
                    <v-btn color="grey" variant="outlined" class="mr-4" @click="goBack">
                      <v-icon left>mdi-arrow-left</v-icon>
                      กลับ
                    </v-btn>
                    <v-btn :disabled="!isFormValid" type="submit" color="primary" large>
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";
export default {
  name: "StudentVisitFormEdit",
  data() {
    return {
      isFormValid: false,
      errorMessage: "",
      advisorHomeEnvironment: "",
      advisorStudentBehavior: [],
      advisorStudentBehaviorOther: "",
      advisorFamilyFinance: "",
      advisorScholarshipNeed: "",
      advisorPositiveBehavior: "",
      advisorImprovementBehavior: "",
      advisorProblemSolving: "",
      advisorParentOpinion: "",
      advisorTeacherSuggestion: "",
      advisorUploadedImages: [],
      advisorStudentBehaviorOptions: [
        "อ่านหนังสือทำการบ้าน",
        "ช่วยงานผู้ปกครอง",
        "ทำงานบ้าน",
        "ไม่ช่วยงานเลย",
      ],
      dialogConfirm: false,
      showImagesPreview: false,
      visitReportId: null, // รับค่าจาก route params (parameter: id)
    };
  },
  created() {
    // รับค่า report id จาก route params (เช่น /teacher/studentvisit/edit/:id)
    this.visitReportId = this.$route.params.id;
    console.log("visitReportId from route:", this.visitReportId);
    if (!this.visitReportId) {
      this.errorMessage = "ไม่พบรหัสรายงานใน URL";
    } else {
      this.fetchVisitReport();
    }
  },
  methods: {
    async fetchVisitReport() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.errorMessage = "ไม่มี token ใน localStorage";
          this.$router.push("/login");
          return;
        }
        const res = await axios.get(
          `http://localhost:7000/teacher/home_visits/${this.visitReportId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        this.advisorHomeEnvironment = data.environment_condition || "";
        this.advisorStudentBehavior = data.student_behavior ? data.student_behavior.split(",") : [];
        this.advisorFamilyFinance = data.family_finance || "";
        this.advisorScholarshipNeed = data.scholarship_need || "";
        this.advisorPositiveBehavior = data.positive_behavior || "";
        this.advisorImprovementBehavior = data.improvement_behavior || "";
        this.advisorProblemSolving = data.problem_solving || "";
        this.advisorParentOpinion = data.parent_opinion || "";
        this.advisorTeacherSuggestion = data.suggestion || "";
        if (data.image) {
          this.advisorUploadedImages = [data.image];
          this.showImagesPreview = true;
        }
      } catch (error) {
        console.error("Error fetching visit report:", error);
        this.errorMessage = "เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน";
      }
    },
    handleSubmit() {
      if (!this.$refs.form.validate()) {
        this.errorMessage = "กรุณากรอกข้อมูลให้ครบถ้วน";
        return;
      }
      if (this.advisorUploadedImages.length === 0) {
        this.errorMessage = "กรุณาอัปโหลดรูปภาพ";
        return;
      }
      this.updateVisitReport();
    },
    async updateVisitReport() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.errorMessage = "ไม่มี token ใน localStorage";
          this.$router.push("/login");
          return;
        }
        const updateData = {
          environment_condition: this.advisorHomeEnvironment || null,
          student_behavior: this.advisorStudentBehavior.length > 0 ? this.advisorStudentBehavior.join(",") : null,
          family_finance: this.advisorFamilyFinance || null,
          scholarship_need: this.advisorScholarshipNeed || null,
          positive_behavior: this.advisorPositiveBehavior || null,
          problem_solving: this.advisorProblemSolving || null,
          suggestion: this.advisorTeacherSuggestion || null,
        };
        const res = await axios.patch(
          `http://localhost:7000/teacher/home_visits/${this.visitReportId}`,
          updateData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        console.log("Update response:", res.data);
        alert("แก้ไขข้อมูลรายงานการเยี่ยมบ้านสำเร็จ");
        this.$router.push("/teacher");
      } catch (error) {
        console.error("Error updating visit report:", error);
        this.errorMessage = "เกิดข้อผิดพลาดในการแก้ไขข้อมูล";
      }
    },
    goBack() {
      this.$router.push("/teacher");
    },
    removeImage(index) {
      this.advisorUploadedImages.splice(index, 1);
      if (this.advisorUploadedImages.length === 0) {
        this.showImagesPreview = false;
      }
    },
    getImageUrl(file) {
      return file instanceof File ? URL.createObjectURL(file) : file;
    },
    openDialog() {
      if (this.advisorUploadedImages && this.advisorUploadedImages.length > 0) {
        this.dialogConfirm = true;
        this.showImagesPreview = false;
      }
    },
    confirmShowImages() {
      this.showImagesPreview = true;
      this.dialogConfirm = false;
    },
    cancelShowImages() {
      this.advisorUploadedImages = [];
      this.showImagesPreview = false;
      this.dialogConfirm = false;
    },
  },
  beforeDestroy() {
    this.advisorUploadedImages.forEach((file) => {
      if (file instanceof File) {
        URL.revokeObjectURL(file);
      }
    });
  },
};
</script>

<style scoped>
.v-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.v-simple-table th {
  padding: 12px 16px;
  border-bottom: 2px solid #e0e0e0;
}
.v-simple-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}
.custom-file-input {
  max-width: 600px;
}
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}
</style>
