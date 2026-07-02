# Deployment & Rollback Standards

## Production Deployment Checklist
ก่อนเริ่ม Deploy Release ใหม่ (เช่น สิ้นสุด Sprint) ต้องตรวจสอบสิ่งต่อไปนี้:
- [ ] ติดแท็ก (Tag) Git เวอร์ชันก่อน Deploy (เช่น `v1.0.1`)
- [ ] สำรองฐานข้อมูล (Database Backup) หาก Release นี้มี Database Migration
- [ ] ตรวจสอบ Environment Variables (Secret Keys, API Keys) ให้ตรงกับที่ระบุใน `.env.example`
- [ ] สรุป Release Notes (Features, Fixes, Breaking Changes) 

## Production Rollback Checklist
หากเกิดข้อผิดพลาดร้ายแรงบน Production ให้ดำเนินการตาม Checklist นี้:
- [ ] **1. เตรียมคำสั่ง Rollback:** ดึง Commit Hash ก่อนหน้าจาก Release Notes (หรือ `git revert <hash>`)
- [ ] **2. ย้อนสถานะ Database:** หากมี Migration ใหม่ ให้รันสคริปต์ Downgrade (ห้ามทำให้ข้อมูล User หาย)
- [ ] **3. ตรวจสอบ Environment Variables:** เอา Secret ตัวใหม่ออก (ถ้ามี)
- [ ] **4. Deploy เวอร์ชันเก่า:** สั่ง Re-deploy กลับไปยัง Tag ก่อนหน้า
- [ ] **5. ตรวจ Health Check หลัง Rollback:** รัน Smoke Test หรือ Regression Checklist แบบเร็ว เพื่อยืนยันว่าเว็บกลับมาทำงานปกติ
