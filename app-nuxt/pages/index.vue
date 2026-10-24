<template>
  <v-main class="mt-n12">
    <v-container class="pa-sm-6 pa-md-12" fluid>
      <v-responsive class="text-center mx-auto" max-width="700">
        <p class="mt-2 text-h4 text-md-h2 font-weight-bold">ยินดีต้อนรับเข้าสู่</p>

        <p class="mt-2 text-h5 font-weight-bold text-md-h4">ระบบเยี่ยมบ้านออนไลน์</p>

        <p class="mt-4 text-body-1 text-medium-emphasis">
          ระบบเยี่ยมบ้านนี้ออกแบบมาเพื่อให้บริการดูแลชุมชนอย่างครบวงจร
          ด้วยการจัดการข้อมูลที่เป็นระบบและปลอดภัย
          ทำให้การติดตามผลการเยี่ยมบ้านเป็นไปอย่างรวดเร็วและแม่นยำ
          ช่วยให้ผู้ดูแลสามารถวางแผนและปรับปรุงการบริการได้อย่างมีประสิทธิภาพ
        </p>
      </v-responsive>

      <v-row class="mt-8">
        <v-col v-for="(item, i) in features" :key="i" class="d-flex" cols="12" md="4">
          <v-responsive class="mx-auto" max-width="500" width="100%">
            <v-list-item class="px-0" rounded="lg" :subtitle="item.subtitle">
              <template #title>
                <p class="text-body-2 font-weight-bold pb-2">
                  <v-icon class="mr-2" color="primary" :icon="item.icon" size="small" />
                  {{ item.title }}
                </p>
              </template>

              <v-chip
                append-icon="mdi-arrow-right"
                class="mt-6"
                color="primary"
                link
                size="small"
                text="ดูรายละเอียดเพิ่มเติม"
              />
            </v-list-item>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
const features = [
  {
    title: "การประสานงานเยี่ยมบ้าน",
    subtitle:
      "ระบบนี้ช่วยให้คุณประสานงานการเยี่ยมบ้านกับทีมได้อย่างรวดเร็วและปลอดภัย ด้วยการแจ้งเตือนและบันทึกข้อมูลอัตโนมัติ ลดภาระการทำงานซ้ำซ้อนของเจ้าหน้าที่",
    icon: "mdi-cloud-upload",
  },
  {
    title: "การจัดเก็บข้อมูลส่วนบุคคล",
    subtitle:
      "ข้อมูลการเยี่ยมบ้านจะถูกเก็บอย่างปลอดภัยด้วยมาตรฐาน SSL ช่วยรักษาความเป็นส่วนตัวของผู้รับบริการและสร้างความเชื่อมั่นให้กับผู้ดูแล",
    icon: "mdi-lock",
  },
  {
    title: "ติดตามผลได้ทันที",
    subtitle:
      "ด้วยระบบรายงานและแจ้งเตือนแบบเรียลไทม์ ผู้ดูแลสามารถติดตามสถานะการเยี่ยมบ้านและประเมินผลการให้บริการได้อย่างมีประสิทธิภาพ",
    icon: "mdi-sync",
  },
];
</script>
