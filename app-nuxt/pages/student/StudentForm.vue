<template>
  <v-main class="bg-grey-lighten-2">
    <v-container class="py-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="12" class="mt-n16">
          <v-card outlined class="rounded-lg">
            <v-card-title class="mt-5 text-h4 font-weight-black justify-center">
              แบบฟอร์มข้อมูลนักศึกษา
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
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

              <v-form
                ref="form"
                v-model="isFormValid"
                lazy-validation
                @submit.prevent="handleSubmit"
              >
                <!-- 1. ข้อมูลส่วนตัว -->
                <v-subheader class="mt-4 text-h5 font-weight-black"
                  >1. ข้อมูลส่วนตัว</v-subheader
                >
                <v-row class="mt-4" dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.fullName"
                      :rules="[(v) => !!v || 'กรุณากรอกชื่อ-นามสกุล']"
                      label="ชื่อ-นามสกุล"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.nickName"
                      :rules="[(v) => !!v || 'กรุณากรอกชื่อเล่น']"
                      label="ชื่อเล่น"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.studentID"
                      :rules="[(v) => !!v || 'กรุณากรอกรหัสประจำตัวนักศึกษา']"
                      label="รหัสประจำตัวนักศึกษา"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.citizenID"
                      :rules="[(v) => !!v || 'กรุณากรอกเลขบัตรประชาชน']"
                      label="เลขบัตรประชาชน"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.birthDate"
                      :rules="[(v) => !!v || 'กรุณาเลือกวันเดือนปีเกิด']"
                      label="วันเดือนปีเกิด"
                      type="date"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.age"
                      :rules="[
                        (v) => !!v || 'กรุณากรอกอายุ',
                        (v) => (v && v > 0) || 'อายุต้องมากกว่า 0',
                      ]"
                      label="อายุ"
                      type="number"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="student.phone"
                      :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
                      label="เบอร์โทรศัพท์"
                      type="tel"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ที่อยู่ส่วนตัว -->
                <v-subheader class="mt-4 text-h6 font-weight-black"
                  >ที่อยู่ส่วนตัว</v-subheader
                >
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.houseNo"
                      :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                      label="บ้านเลขที่"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.villageNo"
                      :rules="[(v) => !!v || 'กรุณากรอกหมู่ที่']"
                      label="หมู่ที่"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.road"
                      label="ถนน"
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.subDistrict"
                      :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                      label="ตำบล"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.district"
                      :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                      label="อำเภอ"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.province"
                      :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                      label="จังหวัด"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.address.postalCode"
                      :rules="[(v) => !!v || 'กรุณากรอกรหัสไปรษณีย์']"
                      label="รหัสไปรษณีย์"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- 1.1 ข้อมูลการศึกษา -->
                <v-subheader class="mt-4 text-h6 font-weight-black"
                  >1.1 ข้อมูลการศึกษา</v-subheader
                >
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="student.educationLevel"
                      :items="['ปวช1', 'ปวช2', 'ปวช3', 'ปวส1', 'ปวส2']"
                      :rules="[(v) => !!v || 'กรุณาเลือกระดับการศึกษา']"
                      label="กำลังศึกษาระดับชั้น"
                      required
                      variant="underlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="student.plan"
                      :items="['ปกติ', 'ทวิภาคี']"
                      :rules="[(v) => !!v || 'กรุณาเลือกแผนการศึกษา']"
                      label="แผนการศึกษา"
                      required
                      variant="underlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="student.major"
                      :items="['อุตสาหกรรม', 'พาณิชยกรรม']"
                      :rules="[(v) => !!v || 'กรุณาเลือกสาขาวิชา']"
                      label="สาขาวิชา"
                      required
                      variant="underlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.department"
                      :rules="[(v) => !!v || 'กรุณากรอกแผนกวิชาชีพ']"
                      label="แผนกวิชาชีพ"
                      required
                      variant="underlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="student.room"
                      :items="[
                        'AW',
                        'AG',
                        'BW',
                        'BG',
                        'CW',
                        'CG',
                        'D1',
                        'D5',
                        'E1',
                        'E5',
                      ]"
                      :rules="[(v) => !!v || 'กรุณาเลือกกลุ่ม/ห้อง']"
                      label="กลุ่ม/ห้อง"
                      required
                      variant="underlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.previousSchool"
                      :rules="[(v) => !!v || 'กรุณากรอกสถานศึกษาเดิม']"
                      label="สถานศึกษาเดิมของนักเรียน"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.previousSchoolDistrict"
                      :rules="[(v) => !!v || 'กรุณากรอกอำเภอของสถานศึกษาเดิม']"
                      label="อำเภอ (สถานศึกษาเดิม)"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="student.previousSchoolProvince"
                      :rules="[(v) => !!v || 'กรุณากรอกจังหวัดของสถานศึกษาเดิม']"
                      label="จังหวัด (สถานศึกษาเดิม)"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- 2. ข้อมูลครอบครัว -->
                <v-subheader class="mt-4 text-h5 font-weight-black"
                  >2. ข้อมูลครอบครัว</v-subheader
                >
                <!-- ข้อมูลบิดา -->
                <v-card outlined class="mt-2 pa-3">
                  <v-card-title class="text-h6 font-weight-black"
                    >ข้อมูลบิดา</v-card-title
                  >
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.father.name"
                        :rules="[(v) => !!v || 'กรุณากรอกชื่อบิดา']"
                        label="ชื่อบิดา"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.father.age"
                        :rules="[
                          (v) => !!v || 'กรุณากรอกอายุ',
                          (v) => (v && v > 0) || 'อายุต้องมากกว่า 0',
                        ]"
                        label="อายุ"
                        type="number"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.father.job"
                        :rules="[(v) => !!v || 'กรุณากรอกอาชีพ']"
                        label="อาชีพ"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="student.father.phone"
                        :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
                        label="เบอร์โทรศัพท์"
                        type="tel"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="student.father.salary"
                        :rules="[(v) => !!v || 'กรุณากรอกเงินเดือน']"
                        label="เงินเดือน"
                        type="number"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <!-- ที่อยู่บิดา -->
                    <v-col cols="12">
                      <v-subheader class="font-weight-black text-h6"
                        >ที่อยู่บิดา</v-subheader
                      >
                      <v-row dense>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.father.address.houseNo"
                            :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                            label="บ้านเลขที่"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.father.address.villageNo"
                            :rules="[(v) => !!v || 'กรุณากรอกหมู่ที่']"
                            label="หมู่ที่"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.father.address.road"
                            label="ถนน"
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.father.address.subDistrict"
                            :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                            label="ตำบล"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.father.address.district"
                            :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                            label="อำเภอ"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.father.address.province"
                            :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                            label="จังหวัด"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.father.address.postalCode"
                            :rules="[(v) => !!v || 'กรุณากรอกรหัสไปรษณีย์']"
                            label="รหัสไปรษณีย์"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- ข้อมูลมารดา -->
                <v-card outlined class="mt-8 pa-3">
                  <v-card-title class="text-h6 font-weight-black"
                    >ข้อมูลมารดา</v-card-title
                  >
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.mother.name"
                        :rules="[(v) => !!v || 'กรุณากรอกชื่อมารดา']"
                        label="ชื่อมารดา"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.mother.age"
                        :rules="[
                          (v) => !!v || 'กรุณากรอกอายุ',
                          (v) => (v && v > 0) || 'อายุต้องมากกว่า 0',
                        ]"
                        label="อายุ"
                        type="number"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="student.mother.job"
                        :rules="[(v) => !!v || 'กรุณากรอกอาชีพ']"
                        label="อาชีพ"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="student.mother.phone"
                        :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
                        label="เบอร์โทรศัพท์"
                        type="tel"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="student.mother.salary"
                        :rules="[(v) => !!v || 'กรุณากรอกเงินเดือน']"
                        label="เงินเดือน"
                        type="number"
                        required
                        variant="underlined"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <!-- ที่อยู่มารดา -->
                    <v-col cols="12">
                      <v-subheader class="text-h6 font-weight-black"
                        >ที่อยู่มารดา</v-subheader
                      >
                      <v-row dense>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.mother.address.houseNo"
                            :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                            label="บ้านเลขที่"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.mother.address.villageNo"
                            :rules="[(v) => !!v || 'กรุณากรอกหมู่ที่']"
                            label="หมู่ที่"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.mother.address.road"
                            label="ถนน"
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="student.mother.address.subDistrict"
                            :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                            label="ตำบล"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.mother.address.district"
                            :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                            label="อำเภอ"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.mother.address.province"
                            :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                            label="จังหวัด"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="student.mother.address.postalCode"
                            :rules="[(v) => !!v || 'กรุณากรอกรหัสไปรษณีย์']"
                            label="รหัสไปรษณีย์"
                            required
                            variant="underlined"
                            clearable
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- 3. ปัจจุบันนักเรียน/นักศึกษา อาศัยอยู่กับใคร -->
                <div class="mt-8">
                  <v-subheader class="mt-4 text-h5 font-weight-black">
                    3. ปัจจุบันนักเรียน นักศึกษา อาศัยอยู่กับใคร
                  </v-subheader>
                  <v-radio-group
                    v-model="student.currentLivingWith"
                    row
                    mandatory
                    variant="underlined"
                    clearable
                    :rules="[(v) => !!v || 'กรุณาเลือก']"
                  >
                    <v-radio label="บิดา/มารดา" value="บิดา/มารดา"></v-radio>
                    <v-radio label="อื่นๆ" value="อื่นๆ"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="student.currentLivingWith === 'อื่นๆ'"
                    v-model="student.otherLivingWith"
                    :rules="[(v) => !!v || 'กรุณาระบุ']"
                    label="ระบุคนที่อาศัยอยู่ด้วย"
                    required
                    variant="underlined"
                    clearable
                  ></v-text-field>
                </div>
                <v-expand-transition>
                  <div v-if="student.currentLivingWith === 'อื่นๆ'" class="mt-4">
                    <v-subheader class="font-weight-black"
                      >3.1 ข้อมูลบุคคลที่อาศัยอยู่ด้วย</v-subheader
                    >
                    <v-row dense>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.name"
                          :rules="[(v) => !!v || 'กรุณากรอกชื่อ']"
                          label="ชื่อ"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.age"
                          :rules="[
                            (v) => !!v || 'กรุณากรอกอายุ',
                            (v) => (v && v > 0) || 'อายุต้องมากกว่า 0',
                          ]"
                          label="อายุ"
                          type="number"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.otherPerson.job"
                          :rules="[(v) => !!v || 'กรุณากรอกอาชีพ']"
                          label="อาชีพ"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>

                      <!-- ที่อยู่บุคคลอื่นที่อาศัยอยู่ด้วย -->
                      <v-col cols="12">
                        <v-subheader class="font-weight-black"
                          >ที่อยู่บุคคลอื่น</v-subheader
                        >
                        <v-row dense>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.houseNo"
                              :rules="[(v) => !!v || 'กรุณากรอกบ้านเลขที่']"
                              label="บ้านเลขที่"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.villageNo"
                              :rules="[(v) => !!v || 'กรุณากรอกหมู่ที่']"
                              label="หมู่ที่"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.road"
                              label="ถนน"
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.subDistrict"
                              :rules="[(v) => !!v || 'กรุณากรอกตำบล']"
                              label="ตำบล"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.district"
                              :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                              label="อำเภอ"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.province"
                              :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                              label="จังหวัด"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              v-model="student.otherPerson.address.postalCode"
                              :rules="[(v) => !!v || 'กรุณากรอกรหัสไปรษณีย์']"
                              label="รหัสไปรษณีย์"
                              required
                              variant="underlined"
                              clearable
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.otherPerson.phone"
                          :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
                          label="เบอร์โทรศัพท์"
                          type="tel"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.otherPerson.salary"
                          :rules="[(v) => !!v || 'กรุณากรอกเงินเดือน']"
                          label="เงินเดือน"
                          type="number"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>

                <!-- 4. การพักอาศัยปัจจุบัน -->
                <v-subheader class="mt-4 text-h5 font-weight-black">
                  4. ขณะนี้นักเรียน นักศึกษา พักอาศัยโดย
                </v-subheader>
                <v-radio-group
                  v-model="student.currentResidence"
                  row
                  mandatory
                  variant="underlined"
                  clearable
                  :rules="[(v) => !!v || 'กรุณาเลือก']"
                >
                  <v-radio label="เช่าหอพัก" value="เช่าหอพัก"></v-radio>
                  <v-radio
                    label="อยู่กับผู้ปกครอง (ข้อ 2)"
                    value="อยู่กับผู้ปกครอง (ข้อ 2)"
                  ></v-radio>
                  <v-radio
                    label="อยู่กับผู้ปกครอง (ข้อ 3)"
                    value="อยู่กับผู้ปกครอง (ข้อ 3)"
                  ></v-radio>
                  <v-radio label="อื่นๆ" value="อื่นๆ"></v-radio>
                </v-radio-group>
                <v-expand-transition>
                  <div v-if="student.currentResidence === 'เช่าหอพัก'" class="mt-2">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.dormName"
                          :rules="[(v) => !!v || 'กรุณากรอกชื่อที่พัก']"
                          label="ชื่อที่พัก"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="student.dormAddress"
                          :rules="[(v) => !!v || 'กรุณากรอกที่อยู่']"
                          label="ที่อยู่"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>
                <v-expand-transition>
                  <div v-if="student.currentResidence === 'อื่นๆ'" class="mt-2">
                    <v-text-field
                      v-model="student.otherResidence"
                      :rules="[(v) => !!v || 'กรุณาระบุการพักอาศัย']"
                      label="ระบุการพักอาศัย"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </div>
                </v-expand-transition>

                <!-- 5. สุขภาพ -->
                <v-subheader class="mt-4 text-h5 font-weight-black"
                  >5. สุขภาพ</v-subheader
                >
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="student.bloodType"
                      :items="['A', 'B', 'AB', 'O', 'ไม่ระบุ']"
                      label="หมู่เลือด"
                      variant="underlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-radio-group
                      v-model="student.hasChronicDisease"
                      label="มีโรคประจำตัวหรือไม่"
                      row
                      mandatory
                      variant="underlined"
                      clearable
                      :rules="[(v) => !!v || 'กรุณาเลือก']"
                    >
                      <v-radio label="ไม่มี" value="ไม่มี"></v-radio>
                      <v-radio label="มี" value="มี"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" v-if="student.hasChronicDisease === 'มี'">
                    <v-text-field
                      v-model="student.chronicDisease"
                      :rules="[(v) => !!v || 'กรุณาระบุโรคประจำตัว']"
                      label="ระบุโรคประจำตัว"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-subheader class="font-weight-black"
                      >เคยได้รับการรักษาจาก</v-subheader
                    >
                    <v-row dense>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.treatmentHospital"
                          :rules="[(v) => !!v || 'กรุณากรอกชื่อโรงพยาบาล']"
                          label="ชื่อโรงพยาบาล"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.treatmentDistrict"
                          :rules="[(v) => !!v || 'กรุณากรอกอำเภอ']"
                          label="อำเภอ"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="student.treatmentProvince"
                          :rules="[(v) => !!v || 'กรุณากรอกจังหวัด']"
                          label="จังหวัด"
                          required
                          variant="underlined"
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <!-- 6. การเดินทาง -->
                <v-subheader class="mt-4 text-h5 font-weight-black"
                  >6. การเดินทางของนักเรียน นักศึกษา</v-subheader
                >
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="รถโดยสารประจำทาง"
                      value="Bus"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="รถรับ-ส่ง"
                      value="Shuttle"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="ปั่นจักรยาน"
                      value="Bicycle"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="เดินเท้า"
                      value="Walking"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="รถจักรยานยนต์"
                      value="รถจักรยานยนต์"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    v-if="
                      student.transportation &&
                      student.transportation.includes('รถจักรยานยนต์')
                    "
                  >
                    <v-text-field
                      v-model="student.motorcycle.regNumber"
                      :rules="[(v) => !!v || 'กรุณากรอกทะเบียนรถ']"
                      label="ทะเบียนรถ (รถจักรยานยนต์)"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.motorcycle.brand"
                      :rules="[(v) => !!v || 'กรุณากรอกยี่ห้อ']"
                      label="ยี่ห้อ"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.motorcycle.model"
                      :rules="[(v) => !!v || 'กรุณากรอกรุ่น']"
                      label="รุ่น"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.motorcycle.color"
                      :rules="[(v) => !!v || 'กรุณากรอกสี']"
                      label="สี"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-checkbox
                      v-model="student.transportation"
                      label="รถยนต์"
                      value="รถยนต์"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    v-if="
                      student.transportation && student.transportation.includes('รถยนต์')
                    "
                  >
                    <v-text-field
                      v-model="student.car.regNumber"
                      :rules="[(v) => !!v || 'กรุณากรอกทะเบียนรถ']"
                      label="ทะเบียนรถ (รถยนต์)"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.car.brand"
                      :rules="[(v) => !!v || 'กรุณากรอกยี่ห้อ']"
                      label="ยี่ห้อ"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.car.model"
                      :rules="[(v) => !!v || 'กรุณากรอกรุ่น']"
                      label="รุ่น"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="student.car.color"
                      :rules="[(v) => !!v || 'กรุณากรอกสี']"
                      label="สี"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-checkbox
                      v-model="student.transportation"
                      label="อื่นๆ"
                      value="Other"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    md="10"
                    v-if="
                      student.transportation && student.transportation.includes('Other')
                    "
                  >
                    <v-text-field
                      v-model="student.otherTransportation"
                      :rules="[(v) => !!v || 'กรุณาระบุการเดินทาง']"
                      label="ระบุการเดินทาง"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.travelDistance"
                      :rules="[(v) => !!v || 'กรุณากรอกระยะทาง']"
                      label="ระยะการเดินทาง (กิโลเมตร)"
                      type="number"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="student.travelTime"
                      :rules="[(v) => !!v || 'กรุณากรอกระยะเวลา']"
                      label="ใช้ระยะเวลา (เช่น 30 นาที)"
                      required
                      variant="underlined"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ปุ่มบันทึก -->
                <v-row class="mt-10">
                  <v-col cols="12" class="text-right font-weight-black">
                    <v-btn @click="handleSubmit" type="submit" color="primary" large>
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
<!-- v-dialog สำหรับแสดงข้อความสำเร็จ -->
<v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-black">
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          {{ dialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// กำหนด page meta (Nuxt 3)
definePageMeta({
  layout: 'layoutstudent'
})

// สร้าง instance ของ router
const router = useRouter()

// ตัวแปรสำหรับการ validate form, dialog, error message
const form = ref(null)
const isFormValid = ref(true)
const dialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const errorMessage = ref('')

// ดึงข้อมูลนักศึกษาเก็บไว้ใน localStorage (สมมุติ key 'student')
let localStudentObj = {}
const localStudentStr = localStorage.getItem('student')
if (localStudentStr) {
  try {
    localStudentObj = JSON.parse(localStudentStr)
  } catch (e) {
    console.error('Error parsing local student data', e)
  }
}
// ใช้ student_id จาก localStorage เป็นตัวคัดกรอง (เช่น "S123456")
const currentUserStudentID = localStudentObj.student_id

// Reactive object สำหรับเก็บข้อมูลนักศึกษา (ใช้ camelCase)
const student = reactive({
  id: null,
  fullName: '',
  nickName: '',
  studentID: '',
  citizenID: '',
  birthDate: '',
  age: '',
  phone: '',
  address: {
    houseNo: '',
    villageNo: '',
    road: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  },
  educationLevel: '',
  plan: '',
  major: '',
  department: '',
  room: '',
  previousSchool: '',
  previousSchoolDistrict: '',
  previousSchoolProvince: '',
  father: {
    name: '',
    age: '',
    job: '',
    phone: '',
    salary: '',
    relationship: 'บิดา',  // กำหนดค่า default เป็น 'บิดา'
    address: {
      houseNo: '',
      villageNo: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: ''
    }
  },
  mother: {
    name: '',
    age: '',
    job: '',
    phone: '',
    salary: '',
    relationship: 'มารดา',  // กำหนดค่า default เป็น 'มารดา'
    address: {
      houseNo: '',
      villageNo: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: ''
    }
  },
  currentLivingWith: '',
  otherLivingWith: '',
  otherPerson: {
    name: '',
    age: '',
    job: '',
    phone: '',
    salary: '',
    relationship: 'อื่นๆ',  // กำหนดค่า default เป็น 'มารดา'
    address: {
      houseNo: '',
      villageNo: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: ''
    }
  },
  currentResidence: '',
  dormName: '',
  dormAddress: '',
  otherResidence: '',
  bloodType: '',
  hasChronicDisease: '',
  chronicDisease: '',
  treatmentHospital: '',
  treatmentDistrict: '',
  treatmentProvince: '',
  transportation: [],
  motorcycle: {
    regNumber: '',
    brand: '',
    model: '',
    color: ''
  },
  car: {
    regNumber: '',
    brand: '',
    model: '',
    color: ''
  },
  otherTransportation: '',
  travelDistance: '',
  travelTime: ''
})

// ฟังก์ชัน mapping สำหรับแปลงข้อมูลจาก API (snake_case) ให้เป็นรูปแบบ camelCase
const mapStudentData = (data) => {
  return {
    id: data.id,
    fullName: data.full_name || '',
    nickName: data.nick_name || '',
    studentID: data.student_id || '',
    citizenID: data.citizen_id || '',
    birthDate: data.birth_date || '',
    age: data.age || '',
    phone: data.phone || '',
    address: {
      houseNo: data.address?.house_no || '',
      villageNo: data.address?.village_no || '',
      road: data.address?.road || '',
      subDistrict: data.address?.sub_district || '',
      district: data.address?.district || '',
      province: data.address?.province || '',
      postalCode: data.address?.postal_code || ''
    },
    educationLevel: data.education_level || '',
    plan: data.plan || '',
    major: data.major || '',
    department: data.department || '',
    room: data.room || '',
    previousSchool: data.previous_school || '',
    previousSchoolDistrict: data.previous_school_district || '',
    previousSchoolProvince: data.previous_school_province || '',
    father: data.father || {
      name: '',
      age: '',
      job: '',
      phone: '',
      salary: '',
      address: {
        houseNo: '',
        villageNo: '',
        road: '',
        subDistrict: '',
        district: '',
        province: '',
        postalCode: ''
      }
    },
    mother: data.mother || {
      name: '',
      age: '',
      job: '',
      phone: '',
      salary: '',
      address: {
        houseNo: '',
        villageNo: '',
        road: '',
        subDistrict: '',
        district: '',
        province: '',
        postalCode: ''
      }
    },
    currentLivingWith: data.current_living_with || '',
    otherLivingWith: data.other_living_with || '',
    currentResidence: data.current_residence || '',
    dormName: data.dorm_name || '',
    dormAddress: data.dorm_address || '',
    otherResidence: data.other_residence || '',
    bloodType: data.blood_type || '',
    hasChronicDisease: data.has_chronic_disease || '',
    chronicDisease: data.chronic_disease || '',
    treatmentHospital: data.treatment_hospital || '',
    treatmentDistrict: data.treatment_district || '',
    treatmentProvince: data.treatment_province || '',
    transportation: data.transportation || [],
    motorcycle: data.motorcycle || {
      regNumber: '',
      brand: '',
      model: '',
      color: ''
    },
    car: data.car || {
      regNumber: '',
      brand: '',
      model: '',
      color: ''
    },
    otherTransportation: data.other_transportation || '',
    travelDistance: data.travel_distance || '',
    travelTime: data.travel_time || ''
  }
}

// ดึงข้อมูลนักศึกษาจาก API เมื่อ component ถูก mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:7000/students/me')
    console.log('API Response:', response.data)
    
    let currentStudent;
    if (Array.isArray(response.data)) {
      // คัดกรองโดยใช้ student_id จาก localStorage
      currentStudent = response.data.find(item => item.student_id === currentUserStudentID)
      if (!currentStudent) {
        currentStudent = response.data[0]
      }
    } else {
      currentStudent = response.data
    }
    
    if (currentStudent) {
      const mappedData = mapStudentData(currentStudent)
      console.log('Mapped Data:', mappedData)
      Object.assign(student, mappedData)
      console.log('Reactive Student Object:', student)
    }
  } catch (error) {
    console.error('Error fetching student data:', error)
    errorMessage.value = 'ไม่สามารถดึงข้อมูลนักศึกษาได้'
  }
})

// ฟังก์ชันจัดการส่งข้อมูลเมื่อผู้ใช้กด submit
const handleSubmit = async () => {
  try {
    // แปลง reactive object เป็น plain object
    const payload = JSON.parse(JSON.stringify(student));
    
    // --- Process Other Person สำหรับคนที่อาศัยอยู่ด้วย ---
    if (
      payload.currentLivingWith === 'อื่นๆ' &&
      payload.otherPerson &&
      payload.otherPerson.name.trim() !== ''
    ) {
      // ถ้า otherPerson.relationship ว่างหรือเป็น "อื่นๆ" ให้ตั้งเป็น "Other"
      if (
        !payload.otherPerson.relationship ||
        payload.otherPerson.relationship.trim() === "" ||
        payload.otherPerson.relationship === "อื่นๆ"
      ) {
        payload.otherPerson.relationship = "Other";
      }
      // ถ้า familyMembers ยังไม่มี ให้สร้าง array ใหม่
      if (!payload.familyMembers) {
        payload.familyMembers = [];
      }
      // เพิ่มข้อมูลจาก otherPerson เข้าไปใน familyMembers
      payload.familyMembers.push(payload.otherPerson);
    }
    
    // --- Process Transportation ---
    // สมมุติว่า payload.transportation เป็น array ที่รับค่าจาก checkbox
    // โดยถ้าผู้ใช้เลือก "อื่นๆ" ให้เอาค่าจากช่อง otherTransportation มาใช้เป็นรายละเอียด
    if (
      payload.transportation &&
      Array.isArray(payload.transportation) &&
      payload.transportation.includes('อื่นๆ')
    ) {
      // ลบ string "อื่นๆ" ออกจาก array
      payload.transportation = payload.transportation.filter(item => item !== 'อื่นๆ');
      // ถ้ามีการกรอกข้อมูลใน otherTransportation ให้เพิ่มเป็น object
      if (payload.otherTransportation && payload.otherTransportation.trim() !== "") {
        payload.transportation.push({
          mode: "อื่นๆ",
          description: payload.otherTransportation
        });
      }
    }
    
    payload.updatedAt = new Date().toISOString();
    console.log('Payload to be sent:', payload);
    
    // ดึง token จาก localStorage
    const token = localStorage.getItem('token');
    let response;
    if (student.id) {
      response = await axios.put(
        `http://localhost:7000/students/insert/${student.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } else {
      payload.createdAt = new Date().toISOString();
      response = await axios.post(
        'http://localhost:7000/students/insert',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }
    
    if (response.status === 200 || response.status === 201) {
      console.log('บันทึกข้อมูลนักศึกษาเรียบร้อยแล้ว');
      dialog.value = true;
      dialogTitle.value = 'สำเร็จ';
      dialogMessage.value = 'บันทึกข้อมูลนักศึกษาเรียบร้อยแล้ว';
      setTimeout(() => {
        dialog.value = false;
        router.push('/student/');
      }, 1500);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    errorMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง';
  }
};


</script>
