<template>
  <v-main class="bg-grey-lighten-2">
    <v-container fluid class="py-4 mt-6">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card outlined class="rounded-lg">
            <v-container>
              <v-card-title class="text-h4 justify-center"> ข้อมูลนักเรียน </v-card-title>
              <v-divider></v-divider>

              <!-- แสดง error message เมื่อเกิดข้อผิดพลาด -->
              <v-alert
                v-if="errorMessage"
                type="error"
                dismissible
                class="mb-4"
                @input="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- ส่วนของข้อมูลนักเรียน -->

              <!-- 1. ข้อมูลส่วนตัว -->
              <div class="mt-4">
                <v-subheader class="mt-4 text-h5 font-weight-black"
                  >1. ข้อมูลส่วนตัว</v-subheader
                >
                <v-row class="mt-4">
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="student.fullName"
                      placeholder="-"
                      label="ชื่อ-นามสกุล"
                      readonly
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.nickName"
                      placeholder="-"
                      label="ชื่อเล่น"
                      readonly
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.studentID"
                      placeholder="-"
                      label="รหัสประจำตัวนักเรียน"
                      readonly
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.citizenID"
                      placeholder="-"
                      label="เลขบัตรประชาชน"
                      readonly
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.birthDate"
                      placeholder="-"
                      label="วันเดือนปีเกิด"
                      type="text"
                      readonly
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.age"
                      label="อายุ"
                      type="number"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="student.phone"
                      label="เบอร์โทรศัพท์"
                      type="tel"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- ที่อยู่ส่วนตัว -->

                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="student.address.houseNo"
                      label="บ้านเลขที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="student.address.villageNo"
                      label="หมู่ที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="student.address.road"
                      label="ถนน"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="student.address.subDistrict"
                      label="ตำบล"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.district"
                      label="อำเภอ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.province"
                      label="จังหวัด"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.postalCode"
                      label="รหัสไปรษณีย์"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <!-- 1.1 ข้อมูลการศึกษา -->
              <div class="mt-4">
                <v-subheader class="mt-4 text-h6 font-weight-black"
                  >1.1 ข้อมูลการศึกษา</v-subheader
                >
                <v-row class="mt-4">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.educationLevel"
                      label="กำลังศึกษาระดับชั้น"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.plan"
                      label="แผนการศึกษา"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.major"
                      label="สาขาวิชา"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.department"
                      label="แผนกวิชาชีพ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.room"
                      label="กลุ่ม/ห้อง"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.previousSchool"
                      label="สถานศึกษาเดิมของนักเรียน"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.previousSchoolDistrict"
                      label="อำเภอ (สถานศึกษาเดิม)"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.previousSchoolProvince"
                      label="จังหวัด (สถานศึกษาเดิม)"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>

              <v-subheader class="mt-4 text-h5 font-weight-black"
                >2. ข้อมูลครอบครัว</v-subheader
              >

              <!-- ข้อมูลบิดา -->
              <v-card v-if="father && father.name" outlined class="mt-6 pa-3">
                <v-card-title class="subtitle-1 font-weight-black"
                  >ข้อมูลบิดา</v-card-title
                >

                <v-row dense class="mt-7">
                  <!-- ชื่อบิดา -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="father.name"
                      label="ชื่อบิดา"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- อายุ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="father.age"
                      label="อายุ"
                      type="number"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- อาชีพ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="father.job"
                      label="อาชีพ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row dense>
                  <!-- เบอร์โทรศัพท์ -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="father.phone"
                      label="เบอร์โทรศัพท์"
                      type="tel"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- เงินเดือน -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="father.salary"
                      label="เงินเดือน"
                      type="number"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- ที่อยู่บิดา -->
                <v-card-title
                  v-if="father && father.address"
                  class="subtitle-1 font-weight-black"
                  >ข้อมูลที่อยู่บิดา</v-card-title
                >
                <v-row dense class="mt-7">
                  <!-- บ้านเลขที่ -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="father.address.houseNo"
                      label="บ้านเลขที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- หมู่ที่ -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="father.address.villageNo"
                      label="หมู่ที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- ถนน -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="father.address.road"
                      label="ถนน"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- ตำบล -->
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="father.address.subDistrict"
                      label="ตำบล"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row dense>
                  <!-- อำเภอ -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="father.address.district"
                      label="อำเภอ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- จังหวัด -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="father.address.province"
                      label="จังหวัด"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>

                  <!-- รหัสไปรษณีย์ -->
                  <v-col cols="12" md="4" class="mb-8">
                    <v-text-field
                      v-model="father.address.postalCode"
                      label="รหัสไปรษณีย์"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>

              <!-- ข้อมูลมารดา -->
              <v-card v-if="mother && mother.name" outlined class="mt-10 pa-3">
                <v-card-title class="subtitle-1 font-weight-black"
                  >ข้อมูลมารดา</v-card-title
                >
                <v-row dense class="mt-7">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mother.name"
                      label="ชื่อมารดา"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mother.age"
                      label="อายุ"
                      type="number"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mother.job"
                      label="อาชีพ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="mother.phone"
                      label="เบอร์โทรศัพท์"
                      type="tel"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="mb-6">
                    <v-text-field
                      v-model="mother.salary"
                      label="เงินเดือน"
                      type="number"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ที่อยู่มารดา -->

                <v-card-title
                  v-if="mother && mother.address"
                  class="subtitle-1 font-weight-black"
                  >ข้อมูลที่อยู่มารดา</v-card-title
                >
                <v-row dense class="mt-7">
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="mother.address.houseNo"
                      label="บ้านเลขที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="mother.address.villageNo"
                      label="หมู่ที่"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="mother.address.road"
                      label="ถนน"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="mother.address.subDistrict"
                      label="ตำบล"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mother.address.district"
                      label="อำเภอ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mother.address.province"
                      label="จังหวัด"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" class="mb-8">
                    <v-text-field
                      v-model="mother.address.postalCode"
                      label="รหัสไปรษณีย์"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>

              <!-- ข้อมูลเกี่ยวกับการอาศัยอยู่ -->
              <div class="mt-6">
                <v-subheader class="mt-4 text-h5 font-weight-black">
                  3. ขณะนี้นักเรียน/นักศึกษา อาศัยอยู่กับ
                </v-subheader>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="student.currentLivingWith"
                    label="อาศัยอยู่กับ"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                  <v-text-field
                    v-if="student.currentLivingWith === 'อื่นๆ'"
                    v-model="student.otherLivingWith"
                    label="ระบุคนที่อาศัยอยู่ด้วย"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>

                <v-expand-transition class="">
                  <div v-if="student.currentLivingWith === 'อื่นๆ'" class="mt-4">
                    <v-subheader class="font-weight-black"
                      >3.1 ข้อมูลบุคคลที่อาศัยอยู่ด้วย</v-subheader
                    >
                    <v-row dense>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.name"
                          label="ชื่อ"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.age"
                          label="อายุ"
                          type="number"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.job"
                          label="อาชีพ"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <!-- ข้อมูลที่อยู่ -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.address.houseNo"
                          label="บ้านเลขที่"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.address.villageNo"
                          label="หมู่ที่"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <!-- ข้อมูลอื่น ๆ -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.otherPerson.phone"
                          label="เบอร์โทรศัพท์"
                          type="tel"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.otherPerson.salary"
                          label="เงินเดือน"
                          type="number"
                          readonly
                          variant="underlined"
                          placeholder="-"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </div>

              <!-- 4. การพักอาศัยปัจจุบัน -->
              <div class="mt-6">
                <v-col cols="12" md="12">
                  <v-subheader class="mt-4 text-h5 font-weight-black">
                    4. ขณะนี้นักเรียน/นักศึกษา พักอาศัยโดย
                  </v-subheader>
                </v-col>

                <v-text-field
                  v-model="student.currentResidence"
                  label="การพักอาศัย"
                  readonly
                  variant="underlined"
                  placeholder="-"
                ></v-text-field>

                <v-expand-transition>
                  <div v-if="student.currentResidence === 'เช่าหอพัก'">
                    <v-row dense no-gutters align="center">
                      <v-col cols="12">
                        <v-text-field
                          v-model="student.dormName"
                          label="ชื่อที่พัก"
                          readonly
                          variant="underlined"
                          placeholder="-"
                          style="padding: 0 50px"
                        ></v-text-field>
                      </v-col>
                      <v-col md="12">
                        <v-text-field
                          v-model="student.dormAddress"
                          label="ที่อยู่"
                          readonly
                          variant="underlined"
                          placeholder="-"
                          style="padding: 0 50px"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>

                <v-expand-transition>
                  <div v-if="student.currentResidence === 'อื่นๆ'">
                    <v-row dense no-gutters align="center">
                      <v-col cols="12">
                        <v-text-field
                          v-model="student.otherResidence"
                          label="ระบุชื่อที่พัก"
                          readonly
                          variant="underlined"
                          placeholder="-"
                          style="padding: 0 50px"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
              </div>

              <v-subheader class="mt-4 text-h5 font-weight-black">5. สุขภาพ</v-subheader>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="student.bloodType"
                  label="หมู่เลือด"
                  readonly
                  variant="underlined"
                  placeholder="-"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="student.hasChronicDisease"
                  label="มีโรคประจำตัวหรือไม่"
                  readonly
                  variant="underlined"
                  placeholder="-"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="student.hasChronicDisease === 'มี'">
                <v-text-field
                  v-model="student.chronicDisease"
                  label="ระบุโรคประจำตัว"
                  readonly
                  variant="underlined"
                  placeholder="-"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-subheader>เคยได้รับการรักษาจาก</v-subheader>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.treatmentHospital"
                      label="ชื่อโรงพยาบาล"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.treatmentDistrict"
                      label="อำเภอ"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.treatmentProvince"
                      label="จังหวัด"
                      readonly
                      variant="underlined"
                      placeholder="-"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <!-- ข้อมูลจักรยานยนต์ -->
              <v-subheader
                v-if="motorcycle && motorcycle.regNumber"
                class="mt-4 text-h5 font-weight-black"
              >
                ข้อมูลจักรยานยนต์
              </v-subheader>
              <v-row v-if="motorcycle && motorcycle.regNumber">
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="motorcycle.regNumber"
                    label="ทะเบียนจักรยานยนต์"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="motorcycle.brand"
                    label="ยี่ห้อ"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="motorcycle.model"
                    label="รุ่น"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="motorcycle.color"
                    label="สี"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- ข้อมูลรถยนต์ -->
              <v-subheader
                v-if="car && car.regNumber"
                class="mt-4 text-h5 font-weight-black"
              >
                ข้อมูลรถยนต์
              </v-subheader>
              <v-row v-if="car && car.regNumber">
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="car.regNumber"
                    label="ทะเบียนรถยนต์"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="car.brand"
                    label="ยี่ห้อ"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="car.model"
                    label="รุ่น"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="car.color"
                    label="สี"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- การเดินทาง -->
              <v-subheader
                v-if="transportations && transportations.length"
                class="mt-4 text-h5 font-weight-black"
              >
                การเดินทาง
              </v-subheader>
              <v-row v-if="transportations && transportations.length">
                <v-col
                  cols="12"
                  md="6"
                  v-for="(trans, index) in transportations"
                  :key="index"
                >
                  <v-text-field
                    v-model="trans.mode"
                    label="อื่นๆ"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                  <v-text-field
                    v-model="trans.description"
                    label="รายละเอียด"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="student.travelDistance"
                    label="ระยะทาง (กิโลเมตร)"
                    type="number"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="student.travelTime"
                    label="ใช้ระยะเวลา"
                    readonly
                    variant="underlined"
                    placeholder="-"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>

            <v-row class="d-flex justify-end pa-10 mt-n12">
              <v-btn
                @click="goBack"
                density="default"
                color="blue-darken-1"
                class="font-weight-black"
                >กลับ</v-btn
              >
            </v-row>
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
  name: "ViewStudent",
  data() {
    return {
      loading: false,
      errorMessage: "",
      student: {
        fullName: "",
        nickName: "",
        studentID: "",
        citizenID: "",
        birthDate: "",
        age: "",
        phone: "",
        // ข้อมูลที่อยู่ของนักเรียน
        address: {
          houseNo: "",
          villageNo: "",
          road: "",
          subDistrict: "",
          district: "",
          province: "",
          postalCode: "",
        },

        // ข้อมูลผู้ที่นักเรียนอยู่ด้วย
        currentLivingWith: "",
        otherLivingWith: "",

        // ข้อมูล "บุคคลอื่น" (สมมติระบบรับได้คนเดียว)
        otherPerson: {
          name: "",
          age: "",
          job: "",
          phone: "",
          salary: "",
          address: {
            houseNo: "",
            villageNo: "",
            // etc.
          },
        },
      },

      // ข้อมูลพ่อ แม่
      father: {
        // อาจมี address แยก ถ้าต้องการ
      },
      mother: {},

      // สมาชิกครอบครัวที่ไม่ใช่พ่อ/แม่ (array)
      otherFamilyMembers: [],

      // รถ / การเดินทาง
      motorcycle: {},
      car: {},
      transportations: [],
    };
  },
  watch: {
    // เมื่อ route เปลี่ยน หรือโหลดหน้าครั้งแรก มี student ID -> fetch
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          console.log("Student ID changed (or initial):", newId);
          this.fetchStudentData(newId);
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
        console.log("API Response:", response.data);

        /**
         * สมมติว่า response.data ส่งมาเป็น:
         * {
         *   student: { fullName, nickName, address: {...}, currentLivingWith, otherLivingWith, ... },
         *   father: {...},
         *   mother: {...},
         *   otherFamilyMembers: [...],
         *   motorcycle: {...},
         *   car: {...},
         *   transportations: [...],
         * }
         */

        // 1) อัปเดต student (merge address ถ้ามี)
        if (response.data.student) {
          this.student = {
            ...this.student,
            ...response.data.student,
            address: {
              ...this.student.address,
              ...(response.data.student.address || {}),
            },
            // เก็บค่าเดิมของ otherPerson ไว้ด้วย ถ้าไม่อยากเคลียร์
            // หรือจะเคลียร์ก็ได้ตาม logic
          };
        }

        // 2) อัปเดต father
        if (response.data.father) {
          this.father = {
            ...this.father,
            ...response.data.father,
            address: {
              ...this.father.address,
              ...(response.data.father.address || {}),
            },
          };
        }

        // 3) อัปเดต mother
        if (response.data.mother) {
          this.mother = {
            ...this.mother,
            ...response.data.mother,
            address: {
              ...this.mother.address,
              ...(response.data.mother.address || {}),
            },
          };
        }

        // 4) อัปเดต otherFamilyMembers
        if (Array.isArray(response.data.otherFamilyMembers)) {
          this.otherFamilyMembers = [...response.data.otherFamilyMembers];

          // ถ้าระบบตั้งไว้ว่าจะมี "อื่นๆ" ได้แค่ 1 คน
          // เอาคนแรกมาเก็บใน student.otherPerson
          if (this.otherFamilyMembers.length > 0) {
            const [firstOther] = this.otherFamilyMembers;
            this.student.otherPerson = {
              ...this.student.otherPerson,
              ...firstOther,
              address: {
                ...this.student.otherPerson.address,
                ...(firstOther.address || {}),
              },
            };
          } else {
            // ถ้าไม่มีใครเลย เคลียร์ค่า otherPerson
            this.student.otherPerson = {
              name: "",
              age: "",
              job: "",
              phone: "",
              salary: "",
              address: {
                houseNo: "",
                villageNo: "",
              },
            };
          }
        }

        // 5) อัปเดต motorcycle
        if (response.data.motorcycle) {
          this.motorcycle = {
            ...this.motorcycle,
            ...response.data.motorcycle,
          };
        }

        // 6) อัปเดต car
        if (response.data.car) {
          this.car = {
            ...this.car,
            ...response.data.car,
          };
        }

        // 7) อัปเดต transportations
        if (Array.isArray(response.data.transportations)) {
          this.transportations = [...response.data.transportations];
        }
      } catch (error) {
        console.error("Fetch student data error:", error);
        this.errorMessage = "ไม่สามารถดึงข้อมูลนักเรียนได้";
      } finally {
        this.loading = false;
      }
    },
    computed: {
  // กรองข้อมูลการเดินทางที่มี mode หรือ description ไม่เป็นค่าว่าง
  validTransportations() {
    return this.transportations.filter(trans => {
      return (trans.mode && trans.mode.trim() !== '') || 
             (trans.description && trans.description.trim() !== '');
    });
  },
  // เช็คว่ามีข้อมูลของรถยนต์, จักรยานยนต์ หรือข้อมูลการเดินทางที่มีอยู่จริงหรือไม่
  hasOtherInfo() {
    return (this.car && this.car.regNumber) || 
           (this.motorcycle && this.motorcycle.regNumber) || 
           (this.validTransportations && this.validTransportations.length > 0);
  }
},
    
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
