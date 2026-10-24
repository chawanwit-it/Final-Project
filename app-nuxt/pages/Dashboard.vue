<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <!-- Toolbar ส่วนหัว -->
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>Dashboard</v-toolbar-title>
        </v-toolbar>

        <!-- ส่วนแสดงการ์ดสถิติ -->
        <v-row class="my-4" dense>
          <v-col cols="12" sm="6" md="3" v-for="card in overviewCards" :key="card.title">
            <v-card :color="card.color" dark class="pa-4" hover>
              <v-card-title class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-subtitle-1 font-weight-regular opacity-75">
                    {{ card.title }}
                  </div>
                  <div class="text-h4 font-weight-bold mt-2">{{ card.value }}</div>
                </div>
                <v-icon size="48" class="ml-4">{{ card.icon }}</v-icon>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <!-- ส่วนแสดงกราฟ -->
        <overview-bar-chart />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import OverviewBarChart from "@/components/OverviewBarChart.vue";

export default {
  name: "Dashboard",
  components: {
    OverviewBarChart,
  },
  data() {
    return {
      // ข้อมูลสำหรับการ์ดสถิติ
      overviewCards: [
        {
          title: "ผู้ใช้งานทั้งหมด",
          value: 50,
          icon: "mdi-account-multiple",
          color: "deep-purple accent-4",
        },
        {
          title: "จำนวนนักเรียน",
          value: 120,
          icon: "mdi-school",
          color: "teal darken-1",
        },
        {
          title: "จำนวนครู",
          value: 30,
          icon: "mdi-human-male-board",
          color: "orange darken-2",
        },
        {
          title: "จำนวนเจ้าหน้าที่",
          value: 10,
          icon: "mdi-office-building",
          color: "red accent-3",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* ปรับสไตล์เพิ่มเติมตามต้องการ */
</style>
