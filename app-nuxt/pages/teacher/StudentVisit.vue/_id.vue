<template>
  <v-main class="bg-grey-lighten-2">
    <v-container class="py-8 px-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card outlined class="rounded-xl shadow-lg">
            <v-card-title class="mt-5 text-h4 justify-center bg-blue-600 py-4">
              แบบฟอร์มรายงานการเยี่ยมบ้านนักศึกษา
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <p>นักเรียนที่มีรหัส ID: {{ studentId }} กำลังถูกเยี่ยมบ้าน</p>
              <!-- แสดงข้อมูลหรือแบบฟอร์มที่เกี่ยวข้องกับนักเรียน -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  props: ["id"], // รับพารามิเตอร์จากเส้นทาง
  computed: {
    studentId() {
      return this.id; // คืนค่าพารามิเตอร์ id
    },
  },
};
</script>
