# Requirements Document

## Introduction

Overthink Simulator เป็น Web App แบบ Responsive (Desktop + Mobile) ที่ผู้ใช้สามารถพิมพ์สถานการณ์สั้นๆ แล้ว AI จะสร้าง "สายโซ่ความคิดมากเกินไป" ที่ค่อยๆ ไต่ระดับจากสมเหตุสมผล → วิตกกังวล → ไร้สาระสุดขีด โดยสะท้อนอารมณ์ที่คนทั่วไปรู้สึกได้จริง แอปสร้างด้วย Next.js (App Router), TailwindCSS และเชื่อมต่อ LLM ผ่าน API route โดยเริ่มจาก mock data ก่อนแล้วค่อยเชื่อมต่อ LLM จริงภายหลัง

## Glossary

- **Overthink_Simulator**: ระบบ Web App หลักที่รับ input สถานการณ์จากผู้ใช้และสร้างสายโซ่ความคิด
- **Thought_Chain**: ลำดับขั้นตอนความคิดที่แสดงเป็นประโยคสั้นๆ เชื่อมต่อกันด้วยลูกศร แสดงการไต่ระดับจากสมเหตุสมผลไปจนถึงไร้สาระ
- **Overthink_Level**: ระดับความคิดมาก 5 ระดับ ตั้งแต่ "Reasonable human" (ระดับ 1) ถึง "Meme/chaos" (ระดับ 5) ที่ควบคุมน้ำเสียงและความเข้มข้นของ Thought_Chain
- **Perspective_Mode**: โหมดมุมมองที่ผู้ใช้เลือกบุคลิกของผู้พูด เช่น Psychologist, Doom thinker, Gen Z, Gen Alpha, Anime protagonist, Thai mom
- **Share_Card**: ภาพที่สร้างขึ้นจาก Thought_Chain สำหรับแชร์บนโซเชียลมีเดีย มีรูปแบบ: [input] ↓ Step X: [text] ↓ Sanity: XX%
- **Sanity_Score**: คะแนนความมีสติ 0-100 ที่คำนวณจากระดับความไร้สาระของ Thought_Chain
- **Trigger_Template**: ปุ่มสถานการณ์สำเร็จรูปที่ผู้ใช้กดเพื่อใช้เป็น input โดยไม่ต้องพิมพ์เอง
- **Alternate_Ending**: ตัวเลือกตอนจบทางเลือก 3 แบบ (Worst ending, Best ending, Delusional ending) ที่สร้างขั้นตอนสุดท้ายใหม่
- **LLM_Service**: บริการ AI ที่รับ structured prompt และส่งกลับ JSON ประกอบด้วย steps, sanity_score และ ending_type
- **Thought_Animation**: แอนิเมชันที่แสดงขั้นตอนความคิดทีละขั้นด้วย delay 0.5-1 วินาที พร้อมเอฟเฟกต์ "thought forming"

## Requirements

### Requirement 1: การรับ Input สถานการณ์จากผู้ใช้

**User Story:** ในฐานะผู้ใช้ ฉันต้องการพิมพ์สถานการณ์สั้นๆ เพื่อให้ระบบสร้างสายโซ่ความคิดมากเกินไปจากสถานการณ์นั้น

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดงช่อง input ข้อความสำหรับพิมพ์สถานการณ์บนหน้าหลัก
2. WHEN ผู้ใช้พิมพ์สถานการณ์และกดปุ่ม submit, THE Overthink_Simulator SHALL ส่งข้อความไปยัง LLM_Service เพื่อสร้าง Thought_Chain
3. IF ผู้ใช้ส่ง input ที่เป็นข้อความว่าง, THEN THE Overthink_Simulator SHALL แสดงข้อความแจ้งเตือนให้กรอกสถานการณ์
4. THE Overthink_Simulator SHALL จำกัดความยาว input ไม่เกิน 200 ตัวอักษร

### Requirement 2: ระบบระดับความคิดมาก (Overthink Level System)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเลือกระดับความคิดมาก เพื่อปรับน้ำเสียงและความเข้มข้นของสายโซ่ความคิดตามที่ต้องการ

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดงตัวเลือก Overthink_Level 5 ระดับ ได้แก่ ระดับ 1 "Reasonable human", ระดับ 2 "Slight worrier", ระดับ 3 "Full overthinker", ระดับ 4 "Anxiety master", ระดับ 5 "Meme/chaos"
2. WHEN ผู้ใช้เลือก Overthink_Level, THE Overthink_Simulator SHALL ปรับน้ำเสียงและความเข้มข้นของ Thought_Chain ตามระดับที่เลือก
3. WHEN Overthink_Level เป็นระดับ 1 หรือ 2, THE LLM_Service SHALL สร้างบทสรุปแบบมีเหตุผล (logical conclusion)
4. WHEN Overthink_Level เป็นระดับ 3 หรือ 4, THE LLM_Service SHALL สร้างบทสรุปแบบอารมณ์ (emotional conclusion)
5. WHEN Overthink_Level เป็นระดับ 5, THE LLM_Service SHALL สร้างบทสรุปแบบไร้สาระ (absurd conclusion)
6. WHEN Thought_Chain แสดงผลเสร็จแล้ว, THE Overthink_Simulator SHALL อนุญาตให้ผู้ใช้เลือก Overthink_Level ใหม่และสร้าง Thought_Chain ใหม่จาก input เดิม

### Requirement 3: การแสดงผลสายโซ่ความคิด (Thought Chain Visualization)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเห็นขั้นตอนความคิดแสดงเป็นลำดับที่อ่านง่าย เพื่อติดตามการไต่ระดับของความคิดมากเกินไป

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดง Thought_Chain เป็นลำดับขั้นตอน โดยแต่ละขั้นตอนเป็นประโยคสั้น 1 ประโยค
2. THE Overthink_Simulator SHALL เชื่อมต่อแต่ละขั้นตอนของ Thought_Chain ด้วยสัญลักษณ์ลูกศร (→ หรือ ↓) ในรูปแบบ thought flow UI
3. THE Overthink_Simulator SHALL แสดง Sanity_Score เป็นแถบมิเตอร์ (progress bar) หลังจาก Thought_Chain แสดงผลครบทุกขั้นตอน

### Requirement 4: โหมดมุมมอง (Perspective Mode)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเลือกบุคลิกของผู้พูด เพื่อให้สายโซ่ความคิดมีสไตล์ภาษาและมุมมองที่แตกต่างกัน

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดงตัวเลือก Perspective_Mode อย่างน้อย 6 บุคลิก ได้แก่ Psychologist, Doom thinker, Gen Z, Gen Alpha, Anime protagonist และ Thai mom
2. WHEN ผู้ใช้เลือก Perspective_Mode, THE LLM_Service SHALL ปรับสไตล์ภาษาและมุมมองของ Thought_Chain ตามบุคลิกที่เลือก
3. THE Overthink_Simulator SHALL แสดง Perspective_Mode ที่เลือกอยู่ในปัจจุบันให้ผู้ใช้เห็นชัดเจน

### Requirement 5: การแสดงผลแบบ Real-time (Real-time Overthinking)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเห็นขั้นตอนความคิดปรากฏทีละขั้น เพื่อสร้างความรู้สึกเหมือนกำลังคิดมากจริงๆ

#### Acceptance Criteria

1. WHEN LLM_Service ส่ง Thought_Chain กลับมา, THE Overthink_Simulator SHALL แสดงแต่ละขั้นตอนทีละขั้นด้วย delay ระหว่าง 0.5 ถึง 1 วินาที
2. WHILE ขั้นตอนถัดไปกำลังจะปรากฏ, THE Overthink_Simulator SHALL แสดง Thought_Animation แบบ "thought forming" (เช่น fade-in หรือ typing effect)
3. WHILE Thought_Chain กำลังแสดงผล, THE Overthink_Simulator SHALL แสดงสถานะ loading ที่บอกให้ผู้ใช้ทราบว่ากำลังประมวลผล

### Requirement 6: การสร้างการ์ดแชร์ (Share Card Generator)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการสร้างภาพจาก Thought_Chain เพื่อแชร์บนโซเชียลมีเดีย

#### Acceptance Criteria

1. WHEN Thought_Chain แสดงผลครบทุกขั้นตอน, THE Overthink_Simulator SHALL แสดงปุ่มสำหรับสร้าง Share_Card
2. WHEN ผู้ใช้กดปุ่มสร้าง Share_Card, THE Overthink_Simulator SHALL สร้างภาพที่มีรูปแบบ: [input สถานการณ์] ↓ Step 1: [text] ↓ Step 2: [text] ↓ ... ↓ Sanity: XX%
3. THE Overthink_Simulator SHALL แสดงปุ่ม "Download image" สำหรับดาวน์โหลด Share_Card เป็นไฟล์ภาพ
4. THE Overthink_Simulator SHALL แสดงปุ่ม "Copy for social" สำหรับคัดลอกข้อความ Thought_Chain ไปยัง clipboard

### Requirement 7: สถานการณ์สำเร็จรูป (Trigger Templates)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการกดปุ่มสถานการณ์สำเร็จรูป เพื่อเริ่มใช้งานได้เร็วโดยไม่ต้องคิดสถานการณ์เอง

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดง Trigger_Template เป็นปุ่มกดอย่างน้อย 3 สถานการณ์ ได้แก่ "เขาไม่ตอบแชท", "สอบใกล้แล้วแต่ยังไม่อ่าน" และ "หัวหน้าเรียกคุย"
2. WHEN ผู้ใช้กดปุ่ม Trigger_Template, THE Overthink_Simulator SHALL เติมข้อความสถานการณ์ลงในช่อง input โดยอัตโนมัติ
3. WHEN ผู้ใช้กดปุ่ม Trigger_Template, THE Overthink_Simulator SHALL ไม่ส่ง input ไปสร้าง Thought_Chain โดยอัตโนมัติ เพื่อให้ผู้ใช้ปรับแต่งข้อความก่อนกด submit

### Requirement 8: ตอนจบทางเลือก (Alternate Ending)

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเลือกตอนจบแบบต่างๆ เพื่อดูว่าสายโซ่ความคิดจะจบลงอย่างไรในแต่ละแบบ

#### Acceptance Criteria

1. WHEN Thought_Chain แสดงผลครบทุกขั้นตอน, THE Overthink_Simulator SHALL แสดงตัวเลือก Alternate_Ending 3 แบบ ได้แก่ "Worst ending", "Best ending" และ "Delusional ending"
2. WHEN ผู้ใช้เลือก Alternate_Ending, THE LLM_Service SHALL สร้างขั้นตอนสุดท้ายใหม่ตามประเภทตอนจบที่เลือก
3. WHEN Alternate_Ending ถูกสร้างใหม่, THE Overthink_Simulator SHALL แสดงขั้นตอนสุดท้ายใหม่แทนที่ขั้นตอนสุดท้ายเดิมพร้อม Thought_Animation

### Requirement 9: LLM Service Integration

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้ระบบเชื่อมต่อกับ LLM ผ่าน API route เพื่อสร้าง Thought_Chain จาก input ของผู้ใช้

#### Acceptance Criteria

1. THE LLM_Service SHALL รับ structured prompt ที่ประกอบด้วย input สถานการณ์, Overthink_Level และ Perspective_Mode
2. THE LLM_Service SHALL ส่งกลับ JSON ในรูปแบบ: `{ "steps": ["...", "..."], "sanity_score": 0-100, "ending_type": "normal" }`
3. THE Overthink_Simulator SHALL เริ่มต้นด้วย mock data ที่จำลองการตอบกลับของ LLM_Service เพื่อพัฒนา UI ก่อนเชื่อมต่อ LLM จริง
4. IF LLM_Service ส่งกลับ error, THEN THE Overthink_Simulator SHALL แสดงข้อความแจ้งเตือนผู้ใช้และอนุญาตให้ลองใหม่
5. THE LLM_Service SHALL สร้าง Thought_Chain ที่เริ่มจากสมเหตุสมผลและไต่ระดับความวิตกกังวลตามลำดับขั้นตอน

### Requirement 10: Responsive UI และ Design

**User Story:** ในฐานะผู้ใช้ ฉันต้องการใช้งานแอปได้ทั้งบน Desktop และ Mobile เพื่อความสะดวกในการใช้งานทุกอุปกรณ์

#### Acceptance Criteria

1. THE Overthink_Simulator SHALL แสดงผล UI ที่ปรับขนาดตามหน้าจอทั้ง Desktop (1024px ขึ้นไป) และ Mobile (375px ขึ้นไป) โดยใช้ mobile-first approach
2. THE Overthink_Simulator SHALL ใช้ TailwindCSS สำหรับจัดการ styling ทั้งหมด
3. THE Overthink_Simulator SHALL แสดง animation แบบ fade-in สำหรับการปรากฏของ UI elements
4. THE Overthink_Simulator SHALL มี clean modern UI ที่มีลำดับชั้นข้อมูลชัดเจนและอ่านง่าย
