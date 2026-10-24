const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth'); // ใช้ middleware สำหรับการตรวจสอบ token

// API สำหรับดึงผู้ใช้งานที่มี role "Student" พร้อมข้อมูลจากตาราง students
router.get('/:id', async (req, res) => {
  try {
    const students = await db('students').select(
      'student_id',
      'full_name',
      'citizen_id',
      'education_level',
      'plan',
      'major',
      'department',
      'room'
    );
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API สำหรับดึงข้อมูลนักศึกษาของผู้ใช้ที่ล็อกอินอยู่
router.get('/me', authenticateToken, async (req, res) => {
  const userId = req.user.id  // ได้มาจาก JWT token ที่ผ่าน middleware authenticateToken
  try {
    // ดึงข้อมูลนักศึกษาจากตาราง students ตาม user_id
    const student = await db('students')
      .where({ user_id: userId })
      .first()

    if (!student) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักศึกษาสำหรับผู้ใช้นี้' })
    }

    // ถ้ามี address_id อยู่ใน student ให้ดึงข้อมูลที่อยู่จากตาราง addresses
    if (student.address_id) {
      const address = await db('addresses')
        .where({ id: student.address_id })
        .first()
      student.address = address
    }

    // สามารถเพิ่มเติมดึงข้อมูลส่วนอื่น ๆ ได้ เช่น
    // - ดึงข้อมูลครอบครัว (families, familymembers)
    // - ดึงข้อมูลรถยนต์, จักรยานยนต์, การเดินทาง เป็นต้น

    return res.status(200).json(student)
  } catch (err) {
    console.error('Error fetching student data:', err)
    return res.status(500).json({ message: 'Internal Server Error', error: err.message })
  }
})

// API ดึงข้อมูลโปรไฟล์
router.get('/profile/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    // ดึงข้อมูลโปรไฟล์จากฐานข้อมูล
    const profile = await db('students')
      .where({ student_id: studentId })
      .first();

    if (!profile) {
      return res.status(404).json({ error: 'ไม่พบโปรไฟล์ของนักเรียน' });
    }
    
    // สมมุติว่าในฐานข้อมูล field 'img' เก็บ path ของรูป (เช่น '/uploads/avatar-xxxx.jpg')
    // คุณอาจต้องประกอบ URL ให้เป็น absolute ในฝั่ง client
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});


router.post('/insert', authenticateToken, async (req, res) => {
  // รับข้อมูลจาก req.body แบบ camelCase
  const {
    fullName,           // แทน full_name
    nickName,           // แทน nick_name
    studentID,          // แทน student_id
    citizenID,          // แทน citizen_id
    birthDate,          // แทน birth_date
    age,
    phone,
    address,            // object: { houseNo, villageNo, road, subDistrict, district, province, postalCode }
    educationLevel,     // แทน education_level
    plan,
    major,
    department,
    room,
    previousSchool,     // แทน previous_school
    previousSchoolDistrict, // แทน previous_school_district
    previousSchoolProvince, // แทน previous_school_province
    familyStatus,       // แทน family_status
    otherFamilyStatus,  // แทน other_family_status
    totalSiblings,
    childOrder,
    currentLivingWith,
    otherLivingWith,
    currentResidence,
    dormName,
    dormAddress,
    otherResidence,
    bloodType,
    hasChronicDisease,
    chronicDisease,
    treatmentHospital,
    treatmentDistrict,
    treatmentProvince,
    travelDistance,
    travelTime,
    // ข้อมูลผู้ปกครอง (object)
    father,             // object: { name, age, job, phone, salary, relationship, address }
    mother,             // object: { name, age, job, phone, salary, relationship, address }
    // ข้อมูลสมาชิกครอบครัวเพิ่มเติม (ถ้ามี) (Array)
    familyMembers,
    // ข้อมูลสำหรับรถยนต์, จักรยานยนต์ และการเดินทาง
    car,                // object: { regNumber, brand, model, color }
    motorcycle,         // object: { regNumber, brand, model, color }
    transportation      // Array: อาจเป็น array ของ string หรือ object { mode, description }
  } = req.body;

  const userId = req.user.id; // ใช้ userId จาก JWT token

  let trx;
  try {
    trx = await db.transaction();

    // ตรวจสอบว่ามีนักเรียนที่มี user_id นี้อยู่หรือไม่
    const existingStudent = await trx('students').where({ user_id: userId }).first();

    if (existingStudent) {
      // =============================
      // UPDATE: นักเรียนมีอยู่แล้ว
      // =============================

      // 1. Insert address ใหม่เสมอ (ใช้ข้อมูลล่าสุด)
      const addressResult = await trx('addresses').insert({
        house_no: address.houseNo,
        village_no: address.villageNo,
        road: address.road,
        sub_district: address.subDistrict,
        district: address.district,
        province: address.province,
        postal_code: address.postalCode
      });
      const newAddressId = addressResult[0];
      // Update student's address_id ให้ชี้ไปที่ address ใหม่
      await trx('students').where({ id: existingStudent.id }).update({ address_id: newAddressId });
      existingStudent.address_id = newAddressId;

      // 2. Update ข้อมูลนักเรียนในตาราง students
      await trx('students')
        .where({ id: existingStudent.id })
        .update({
          full_name: fullName,
          nick_name: nickName,
          student_id: studentID,
          citizen_id: citizenID,
          birth_date: birthDate,
          age: age,
          phone: phone,
          education_level: educationLevel,
          plan: plan,
          major: major,
          department: department,
          room: room,
          previous_school: previousSchool,
          previous_school_district: previousSchoolDistrict,
          previous_school_province: previousSchoolProvince,
          family_status: familyStatus,
          other_family_status: otherFamilyStatus,
          total_siblings: totalSiblings,
          child_order: childOrder,
          current_living_with: currentLivingWith,
          other_living_with: otherLivingWith,
          current_residence: currentResidence,
          dorm_name: dormName,
          dorm_address: dormAddress,
          other_residence: otherResidence,
          blood_type: bloodType,
          has_chronic_disease: hasChronicDisease,
          chronic_disease: chronicDisease,
          treatment_hospital: treatmentHospital,
          treatment_district: treatmentDistrict,
          treatment_province: treatmentProvince,
          travel_distance: travelDistance,
          travel_time: travelTime
        });

      // 3. จัดการข้อมูลครอบครัว (families & familymembers)
      let familyRecord = await trx('families').where({ student_id: existingStudent.id }).first();
      if (!familyRecord) {
        const familyResult = await trx('families').insert({ student_id: existingStudent.id });
        familyRecord = { id: familyResult[0] };
      }

      // 3.1 สำหรับข้อมูลผู้ปกครอง: father
      if (father !== undefined && father.name) {
        console.log("Inserting father with relationship:", father.relationship);
        // ลบข้อมูลเก่าของบิดา (เฉพาะ "Father" เพราะจะใช้ค่าเดียวกันในระบบ)
        await trx('familymembers')
          .where({ family_id: familyRecord.id })
          .andWhere('relationship', 'Father')
          .del();
        const fatherRelationship =
          father.relationship && father.relationship.trim() !== ""
            ? father.relationship
            : 'Father'; // ตั้งเป็น "Father" ถ้าไม่ได้ระบุ
        await trx('familymembers').insert({
          family_id: familyRecord.id,
          relationship: fatherRelationship,
          name: father.name,
          age: father.age,
          job: father.job,
          phone: father.phone,
          salary: father.salary,
          address_id: newAddressId
        });
      }

      // 3.2 สำหรับข้อมูลผู้ปกครอง: mother
      if (mother !== undefined && mother.name) {
        console.log("Inserting mother with relationship:", mother.relationship);
        // ลบข้อมูลเก่าของมารดา (เฉพาะ "Mother")
        await trx('familymembers')
          .where({ family_id: familyRecord.id })
          .andWhere('relationship', 'Mother')
          .del();
        const motherRelationship =
          mother.relationship && mother.relationship.trim() !== ""
            ? mother.relationship
            : 'Mother'; // ตั้งเป็น "Mother" ถ้าไม่ได้ระบุ
        await trx('familymembers').insert({
          family_id: familyRecord.id,
          relationship: motherRelationship,
          name: mother.name,
          age: mother.age,
          job: mother.job,
          phone: mother.phone,
          salary: mother.salary,
          address_id: newAddressId
        });
      }

      // 3.3 สำหรับสมาชิกครอบครัวเพิ่มเติม (ไม่ใช่ผู้ปกครอง)
      if (familyMembers !== undefined) {
        // ลบข้อมูลสมาชิกครอบครัวที่ไม่ใช่ "Father" และ "Mother"
        await trx('familymembers')
          .where({ family_id: familyRecord.id })
          .andWhere(function () {
            this.whereNot('relationship', 'Father')
              .andWhereNot('relationship', 'Mother');
          })
          .del();
        if (Array.isArray(familyMembers) && familyMembers.length > 0) {
          for (const member of familyMembers) {
            const memberRelationship =
              member.relationship && member.relationship.trim() !== ""
                ? member.relationship
                : 'Other'; // ตั้งเป็น "Other" ถ้าไม่ได้ระบุ
            await trx('familymembers').insert({
              family_id: familyRecord.id,
              relationship: memberRelationship,
              name: member.name,
              age: member.age,
              job: member.job,
              phone: member.phone,
              salary: member.salary,
              address_id: newAddressId
            });
          }
        }
      }

      // 4. สำหรับรถยนต์ (Car)
      if (car !== undefined) {
        // ลบข้อมูลรถยนต์เก่าทั้งหมดสำหรับนักเรียนนี้
        await trx('cars').where({ student_id: existingStudent.id }).del();
        if (car.regNumber && car.brand && car.model && car.color) {
          await trx('cars').insert({
            student_id: existingStudent.id,
            reg_number: car.regNumber,
            brand: car.brand,
            model: car.model,
            color: car.color
          });
        }
      }

      // 5. สำหรับจักรยานยนต์ (Motorcycle)
      if (motorcycle !== undefined) {
        await trx('motorcycles').where({ student_id: existingStudent.id }).del();
        if (motorcycle.regNumber && motorcycle.brand && motorcycle.model && motorcycle.color) {
          await trx('motorcycles').insert({
            student_id: existingStudent.id,
            reg_number: motorcycle.regNumber,
            brand: motorcycle.brand,
            model: motorcycle.model,
            color: motorcycle.color
          });
        }
      }

      // 6. สำหรับการเดินทาง (Transportation)
      if (transportation !== undefined) {
        await trx('transportations').where({ student_id: existingStudent.id }).del();
        if (Array.isArray(transportation) && transportation.length > 0) {
          for (const trans of transportation) {
            if (typeof trans === 'string') {
              await trx('transportations').insert({
                student_id: existingStudent.id,
                mode: trans,
                description: ''
              });
            } else if (typeof trans === 'object') {
              if (trans.mode && trans.description) {
                await trx('transportations').insert({
                  student_id: existingStudent.id,
                  mode: trans.mode,
                  description: trans.description
                });
              }
            }
          }
        }
      }

      await trx.commit();
      return res.status(200).json({
        message: 'ข้อมูลนักเรียนของคุณถูกอัปเดตเรียบร้อยแล้ว',
        studentId: existingStudent.id
      });
    } else {
      // =============================
      // INSERT: ไม่มีข้อมูลนักเรียนสำหรับ user_id นี้
      // =============================
      const addressResult = await trx('addresses').insert({
        house_no: address.houseNo,
        village_no: address.villageNo,
        road: address.road,
        sub_district: address.subDistrict,
        district: address.district,
        province: address.province,
        postal_code: address.postalCode
      });
      const addressId = addressResult[0];

      const studentResult = await trx('students').insert({
        user_id: userId,
        address_id: addressId,
        full_name: fullName,
        nick_name: nickName,
        student_id: studentID,
        citizen_id: citizenID,
        birth_date: birthDate,
        age: age,
        phone: phone,
        education_level: educationLevel,
        plan: plan,
        major: major,
        department: department,
        room: room,
        previous_school: previousSchool,
        previous_school_district: previousSchoolDistrict,
        previous_school_province: previousSchoolProvince,
        family_status: familyStatus,
        other_family_status: otherFamilyStatus,
        total_siblings: totalSiblings,
        child_order: childOrder,
        current_living_with: currentLivingWith,
        other_living_with: otherLivingWith,
        current_residence: currentResidence,
        dorm_name: dormName,
        dorm_address: dormAddress,
        other_residence: otherResidence,
        blood_type: bloodType,
        has_chronic_disease: hasChronicDisease,
        chronic_disease: chronicDisease,
        treatment_hospital: treatmentHospital,
        treatment_district: treatmentDistrict,
        treatment_province: treatmentProvince,
        travel_distance: travelDistance,
        travel_time: travelTime
      });
      const newStudentId = studentResult[0];

      const familyResult = await trx('families').insert({ student_id: newStudentId });
      const familyId = familyResult[0];

      // Insert parent's data (if provided)
      if (father !== undefined && father.name) {
        const fatherRelationship = (father.relationship && father.relationship.trim() !== "")
          ? father.relationship
          : 'บิดา';
        await trx('familymembers').insert({
          family_id: familyId,
          relationship: fatherRelationship,
          name: father.name,
          age: father.age,
          job: father.job,
          phone: father.phone,
          salary: father.salary,
          address_id: addressId
        });
      }
      if (mother !== undefined && mother.name) {
        const motherRelationship = (mother.relationship && mother.relationship.trim() !== "")
          ? mother.relationship
          : 'มารดา';
        await trx('familymembers').insert({
          family_id: familyId,
          relationship: motherRelationship,
          name: mother.name,
          age: mother.age,
          job: mother.job,
          phone: mother.phone,
          salary: mother.salary,
          address_id: addressId
        });
      }
      // Insert additional family members (if any)
      if (Array.isArray(familyMembers)) {
        console.log('Incoming familyMembers:', familyMembers);
        for (const member of familyMembers) {
          console.log('Each member =>', member);
          const memberRelationship = (member.relationship && member.relationship.trim() !== "")
            ? member.relationship
            : 'Other';
          await trx('familymembers').insert({
            family_id: familyId,
            relationship: memberRelationship,
            name: member.name,
            age: member.age,
            job: member.job,
            phone: member.phone,
            salary: member.salary,
            address_id: addressId
          });
        }
      }

      // Insert รถยนต์ (Car)
      if (car !== undefined) {
        if (car.regNumber && car.brand && car.model && car.color) {
          await trx('cars').insert({
            student_id: newStudentId,
            reg_number: car.regNumber,
            brand: car.brand,
            model: car.model,
            color: car.color
          });
        }
      }

      // Insert จักรยานยนต์ (Motorcycle)
      if (motorcycle !== undefined) {
        if (motorcycle.regNumber && motorcycle.brand && motorcycle.model && motorcycle.color) {
          await trx('motorcycles').insert({
            student_id: newStudentId,
            reg_number: motorcycle.regNumber,
            brand: motorcycle.brand,
            model: motorcycle.model,
            color: motorcycle.color
          });
        }
      }

      // Insert การเดินทาง (Transportation) ในกรณี INSERT
      if (Array.isArray(transportation)) {
        const modeMapping = {
          "รถโดยสารประจำทาง": "Bus",
          "รถรับ-ส่ง": "Shuttle",
          "ปั่นจักรยาน": "Bicycle",
          "เดินเท้า": "Walking",
          "รถจักรยานยนต์": "Motorcycle",
          "รถยนต์": "Car",
          "อื่นๆ": "Other"
        };

        for (const trans of transportation) {
          let mappedMode = "";
          let description = "";
          if (typeof trans === 'string') {
            mappedMode = modeMapping[trans] || "";
            if (!mappedMode || mappedMode.trim() === "") {
              mappedMode = "Other";
            }
          } else if (typeof trans === 'object') {
            if (!trans.mode || trans.mode.trim() === "") {
              if (trans.description && trans.description.includes("เดิน")) {
                mappedMode = "Walking";
              } else {
                mappedMode = "Other";
              }
            } else {
              mappedMode = modeMapping[trans.mode] || "";
            }
            description = trans.description || "";
          }
          if (mappedMode && mappedMode.trim() !== "") {
            await trx('transportations').insert({
              student_id: newStudentId,
              mode: mappedMode,
              description: description
            });
            console.log("Inserted transportation:", { student_id: newStudentId, mode: mappedMode, description });
          } else {
            console.log("Skipped transportation due to empty mode:", trans);
          }
        }
      }


      await trx.commit();
      return res.status(201).json({
        message: 'เพิ่มข้อมูลนักเรียนใหม่เรียบร้อยแล้ว',
        studentId: newStudentId
      });
    }
  } catch (err) {
    if (trx) await trx.rollback();
    console.error('Error inserting/updating student data: ', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});




module.exports = router;

