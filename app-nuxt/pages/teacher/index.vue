<template>
  <v-main>
    <v-container fluid class="pa-md-12">
      <section>
        <h2
          class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
        >
          นักเรียนที่อยู่ในความดูแลทั้งหมด
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            slim
            variant="flat"
            :to="{ path: '/teacher/repost' }"
          >
            รายงานการเยี่ยมบ้าน
          </v-btn>
        </h2>

        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          {{ semester }}
        </div>
        <!-- <v-card elevation="2" class="pa-6 rounded-lg"> -->
        <!-- Data Table -->
        <v-data-table
          class="bg-transparent"
          :headers="headers"
          :items="items"
          items-per-page="30"
        >
          <!-- คอลัมน์สถานะ ใช้ v-chip เปลี่ยนสีตาม getColor -->
          <template #item.status="data">
            <v-chip :color="getColor(data.item.status)">
              {{ data.item.status }}
            </v-chip>
          </template>

          <!-- ปุ่มดูข้อมูล -->
          <template #item.actions="data">
            <v-btn
              :to="
                data.item.student_id ? '/teacher/student/' + data.item.student_id : '#'
              "
              class="text-none"
              color="primary"
              style="min-width: 0"
              rounded="xl"
              slim
              variant="flat"
            >
              ดูข้อมูล
            </v-btn>
          </template>
          <!-- :disabled="!data.item.student_id"  -->

          <!-- ปุ่มออกเยี่ยมบ้าน -->
          <template #item.actions-map="data">
            <v-btn
              @click="startVisitFromTable(data.item)"
              class="text-none"
              color="success"
              style="min-width: 0"
              rounded="lg"
              slim
              variant="flat"
            >
              ออกเยี่ยมบ้าน
            </v-btn>
          </template>
        </v-data-table>
        <!-- </v-card> -->
      </section>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { onBeforeRouteUpdate } from 'vue-router';

definePageMeta({
  layout: "layoutteacher",
});

// กำหนด data
const router = useRouter();
const headers = ref([
  { title: "ชื่อ-นามสกุล", value: "name" },
  { title: "ครูที่ปรึกษาห้อง", value: "room" },
  { title: "เบอร์โทร", value: "phone" },
  { title: "สถานะ", value: "status" },
  { title: "", value: "actions" },
  { title: "", value: "actions-map" },
]);
const items = ref([]);
const teacher = reactive({});
const teacher_id = ref(null);
const semester = ref("");

// ฟังก์ชันกำหนดสีของ v-chip ตามสถานะ
function getColor(status) {
  if (status === "ยังไม่เยี่ยม") return "orange";
  else if (status === "เยี่ยมบ้านแล้ว" || status === "สำเร็จ") return "green";
  return "grey";
}

// สร้าง visit_id ไว้โพสต์ไป backend (ถ้าต้องการ)
function generateVisitId() {
  return "visit_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

onBeforeRouteUpdate((to, from, next) => {
  // เมื่อ route เปลี่ยนแปลงให้รีเฟรชข้อมูล
  fetchStudents();
  next();
});

// เมื่อกดปุ่ม "ออกเยี่ยมบ้าน"
async function startVisitFromTable(student) {
  const clientVisitId = generateVisitId();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:7000/teacher/home_visits",
      {
        visit_id: clientVisitId,
        student_id: student.student_id,
        teacher_id: teacher_id.value,
        visit_date: new Date().toISOString().split("T")[0],
        // เริ่มสถานะเป็น "ยังไม่เยี่ยม" หรือ "กำลังเยี่ยม" ตามต้องการ
        visit_status: "ยังไม่เยี่ยม",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const createdVisitId = response.data.visit_id || response.data.id;
    console.log("Created home visit, received id:", createdVisitId);

    // Redirect ไปยังหน้า Map หรือฟอร์มเยี่ยมบ้าน
    // router.push({
    //   path: `/teacher/studentmap/${student.student_id}`,
    //   query: { visit_id: createdVisitId },
    // });
     // เปลี่ยนหน้าแบบโหลดทั้งหน้า (reload)
     window.location.href = `/teacher/studentmap/${student.student_id}?visit_id=${createdVisitId}`;
     
  } catch (error) {
    console.error("Error creating home visit:", error);
    // หากมีการใช้ $toast ในโปรเจคให้ปลดคอมเมนต์บรรทัดด้านล่าง
    // useNuxtApp().$toast.error("ไม่สามารถเริ่มการเยี่ยมบ้านได้ในขณะนี้");
  }
}

async function fetchStudents() {
  
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("ไม่มี token ใน localStorage");
    router.push("/login");
    return;
  }
  try {
    // เรียก API ทั้งสองพร้อมกัน
    const [studentsRes, semesterRes] = await Promise.all([
      axios.get("http://localhost:7000/teacher/students", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:7000/teacher/semester-names"),
    ]);

    // ตรวจสอบรูปแบบของ semesterRes.data ให้แน่ใจว่าเป็น array
    let semestersArray = [];
    if (Array.isArray(semesterRes.data)) {
      semestersArray = semesterRes.data;
    } else if (semesterRes.data && typeof semesterRes.data === "object") {
      semestersArray = [semesterRes.data];
    }

    // Flatten data ของนักเรียน
    let flattened = [];
    studentsRes.data.forEach((teacherData) => {
      if (teacherData.students && teacherData.students.length) {
        teacherData.students.forEach((student) => {
          let semesterName = null;
          // หากมี student.semester_id ให้ค้นหาชื่อภาคเรียนจาก semestersArray
          if (student.semester_id) {
            const matchingSemester = semestersArray.find(
              (s) => s.id === student.semester_id
            );
            semesterName = matchingSemester ? matchingSemester.name : null;
          }
          // หากไม่พบหรือไม่มีการระบุ semester_id ให้ใช้ค่า semester ล่าสุด (เช่น element แรกใน semestersArray)
          if (!semesterName && semestersArray.length > 0) {
            semesterName = semestersArray[0].name;
          }

          flattened.push({
            student_id: student.student_id,
            name: student.student_name,
            room: student.student_room,
            phone: student.student_phone,
            status: student.visit_status || "ยังไม่เยี่ยม",
            semester: semesterName,
          });
        });
      }
    });

    console.log("Flattened data:", flattened);
    items.value = flattened;

    // ตั้งค่า semester จาก record แรกใน flattened ถ้ามีข้อมูล
    if (flattened.length > 0 && flattened[0].semester) {
      semester.value = flattened[0].semester;
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    if (error.response && error.response.status === 401) {
      router.push("/login");
    }
  }
}

onMounted(() => {
  // 1) ดึงข้อมูล teacher จาก localStorage
  const teacherString = localStorage.getItem("teacher");
  if (!teacherString) {
    console.warn("ไม่พบข้อมูล teacher ใน localStorage");
    router.push("/login");
    return;
  }
  try {
    const teacherData = JSON.parse(teacherString);
    Object.assign(teacher, teacherData);
    if (teacher && teacher.id) {
      teacher_id.value = teacher.id;
    } else {
      console.warn("ข้อมูล teacher ไม่ถูกต้อง:", teacher);
      router.push("/login");
      return;
    }
  } catch (error) {
    console.error("Error parsing teacher data:", error);
    router.push("/login");
    return;
  }
  // 2) เรียก API เพื่อดึงข้อมูลนักเรียน
  fetchStudents();
});

</script>
