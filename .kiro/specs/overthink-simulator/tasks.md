# Implementation Plan: Overthink Simulator

## Overview

สร้าง Overthink Simulator Web App ด้วย Next.js App Router + TailwindCSS โดยเริ่มจาก core types, mock data, API routes แล้วค่อยสร้าง UI components ทีละตัว ใช้ mock-first approach เพื่อให้ UI ทำงานได้ครบก่อนเชื่อม LLM จริง

## Tasks

- [x] 1. ตั้งค่าโปรเจกต์และสร้าง Core Types + Validators
  - [x] 1.1 สร้าง `app/lib/types.ts` กำหนด TypeScript types ทั้งหมด
    - สร้าง `OverthinkLevel`, `PerspectiveMode`, `EndingType`, `ThoughtStep`, `ThoughtChainResult`, `TriggerTemplate` types
    - สร้าง `GenerateRequest`, `GenerateResponse`, `AlternateEndingRequest`, `AlternateEndingResponse` interfaces
    - สร้าง `LEVEL_DESCRIPTORS` และ `PERSPECTIVE_DESCRIPTORS` mappings
    - _Requirements: 2.1, 4.1, 9.1, 9.2_

  - [x] 1.2 สร้าง `app/lib/validators.ts` สำหรับ input validation
    - Implement `validateSituation(input: string)` ที่ reject empty/whitespace-only strings และ strings เกิน 200 ตัวอักษร
    - สร้าง Zod schemas สำหรับ API request/response validation (`generateRequestSchema`, `generateResponseSchema`, `alternateEndingRequestSchema`, `alternateEndingResponseSchema`)
    - _Requirements: 1.3, 1.4, 9.1, 9.2_

  - [ ]* 1.3 เขียน property test สำหรับ input validation
    - **Property 1: Input validation rejects invalid inputs**
    - ใช้ fast-check generate random strings, verify accept/reject ตาม rules (non-empty, non-whitespace-only, ≤200 chars)
    - **Validates: Requirements 1.3, 1.4**

  - [ ]* 1.4 เขียน property test สำหรับ level mapping
    - **Property 2: Overthink level maps to correct conclusion type**
    - ใช้ fast-check generate random OverthinkLevel, verify "logical" สำหรับ 1-2, "emotional" สำหรับ 3-4, "absurd" สำหรับ 5
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

  - [ ]* 1.5 เขียน property test สำหรับ perspective mapping
    - **Property 4: Perspective mode included in prompt**
    - ใช้ fast-check generate random PerspectiveMode, verify descriptor string ตรงกับ PERSPECTIVE_DESCRIPTORS
    - **Validates: Requirements 4.2**

- [x] 2. สร้าง Mock Data และ LLM Service Layer
  - [x] 2.1 สร้าง `app/lib/mock-data.ts` จำลอง LLM responses
    - สร้าง mock responses สำหรับ trigger template situations ทั้ง 3 สถานการณ์
    - สร้าง fallback mock response สำหรับ situation ที่ไม่ match
    - Mock sanity score ตาม level range (Level 1: 80-100, Level 2: 60-80, Level 3: 40-60, Level 4: 20-40, Level 5: 0-20)
    - _Requirements: 9.3_

  - [x] 2.2 สร้าง `app/lib/llm-service.ts` ด้วย strategy pattern
    - Implement `MockLLMService` ที่ใช้ mock data
    - Implement `getLLMService()` factory function ที่สลับระหว่าง mock/real ผ่าน `USE_MOCK_LLM` env variable
    - Implement `generateThoughtChain()` และ `generateAlternateEnding()` methods
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 2.3 เขียน property test สำหรับ LLM Service API contract
    - **Property 9: LLM Service API contract**
    - ใช้ fast-check generate random valid inputs (situation, level, perspective), verify response schema ถูกต้อง (steps non-empty, sanity_score 0-100, ending_type valid)
    - **Validates: Requirements 9.1, 9.2**

- [x] 3. สร้าง API Routes
  - [x] 3.1 สร้าง `app/api/generate/route.ts`
    - Implement POST handler ที่รับ `GenerateRequest` body
    - Validate request ด้วย Zod schema, return 400 สำหรับ invalid request
    - เรียก LLM service แล้ว return `GenerateResponse`
    - Handle errors: return 500 พร้อม generic error message
    - _Requirements: 1.2, 9.1, 9.2, 9.4_

  - [x] 3.2 สร้าง `app/api/alternate-ending/route.ts`
    - Implement POST handler ที่รับ `AlternateEndingRequest` body
    - Validate request ด้วย Zod schema, return 400 สำหรับ invalid request
    - เรียก LLM service แล้ว return `AlternateEndingResponse`
    - Handle errors: return 500 พร้อม generic error message
    - _Requirements: 8.2, 9.1, 9.2_

- [x] 4. Checkpoint - ตรวจสอบ core layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. สร้าง UI Components - Input และ Selection
  - [x] 5.1 สร้าง `app/components/TriggerTemplates.tsx`
    - แสดงปุ่มสถานการณ์สำเร็จรูป 3 ปุ่ม: "เขาไม่ตอบแชท", "สอบใกล้แล้วแต่ยังไม่อ่าน", "หัวหน้าเรียกคุย"
    - กดแล้วเรียก `onSelect(template)` เพื่อเติมข้อความลง input แต่ไม่ submit อัตโนมัติ
    - ใช้ TailwindCSS, mobile-first responsive
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 5.2 สร้าง `app/components/SituationInput.tsx`
    - แสดง textarea พร้อม character counter (max 200)
    - Validate input ด้วย `validateSituation()`, แสดง inline error "กรุณาพิมพ์สถานการณ์ก่อนนะ"
    - ป้องกันการพิมพ์เกิน 200 ตัวอักษร, แสดง counter สีแดงเมื่อใกล้เต็ม
    - Disable submit ขณะ loading
    - รับ `defaultValue` prop สำหรับ trigger template
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 5.3 สร้าง `app/components/OverthinkLevelSelector.tsx`
    - แสดง 5 ระดับเป็น selectable button group
    - แสดง label แต่ละระดับ: "Reasonable human", "Slight worrier", "Full overthinker", "Anxiety master", "Meme/chaos"
    - Highlight ระดับที่เลือกอยู่
    - _Requirements: 2.1, 2.6_

  - [x] 5.4 สร้าง `app/components/PerspectiveSelector.tsx`
    - แสดง 6 personas เป็น selectable cards
    - แสดง persona ที่เลือกอยู่ให้เห็นชัดเจน
    - _Requirements: 4.1, 4.3_

  - [ ]* 5.5 เขียน property test สำหรับ trigger template behavior
    - **Property 7: Trigger template populates input without submitting**
    - ใช้ fast-check generate random template strings, verify ว่า input ถูก populate แต่ไม่มี API call
    - **Validates: Requirements 7.2, 7.3**

- [x] 6. สร้าง UI Components - Thought Chain Visualization
  - [x] 6.1 สร้าง `app/hooks/useThoughtAnimation.ts`
    - Implement hook ที่ increment `visibleStepCount` จาก 0 ถึง N ด้วย delay 700ms (ค่า default)
    - Return `{ visibleStepCount, isAnimating, isComplete, reset }`
    - `isComplete = true` เมื่อแสดงครบทุก step, `isAnimating = false` เมื่อจบ
    - _Requirements: 5.1, 5.2_

  - [x] 6.2 สร้าง `app/components/ThoughtChain.tsx`
    - แสดง steps ทีละขั้นตาม `visibleStepCount` จาก `useThoughtAnimation`
    - เชื่อมต่อแต่ละ step ด้วยลูกศร ↓ ในรูปแบบ thought flow UI
    - แสดง "thought forming" animation (fade-in) สำหรับ step ที่กำลังปรากฏ
    - Auto-scroll ไปยัง step ล่าสุด
    - แสดง loading indicator ขณะ animation ยังไม่จบ
    - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3_

  - [x] 6.3 สร้าง `app/components/SanityMeter.tsx`
    - แสดง progress bar + ตัวเลข % สำหรับ Sanity Score
    - สีเปลี่ยนตาม score: เขียว (80-100), เหลือง (40-79), แดง (0-39)
    - แสดงหลังจาก Thought Chain animation จบ (controlled by `visible` prop)
    - _Requirements: 3.3_

  - [ ]* 6.4 เขียน property test สำหรับ thought chain rendering structure
    - **Property 3: Thought chain rendering structure**
    - ใช้ fast-check generate random step arrays (N ≥ 1), verify ว่ามี N step elements และ N-1 arrow connectors
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 6.5 เขียน property test สำหรับ animation timing
    - **Property 5: Animation step timing**
    - ใช้ fast-check generate random step counts, verify ว่า `visibleStepCount` increment จาก 0 ถึง N และ `isComplete` เป็น true เมื่อจบ
    - **Validates: Requirements 5.1**

- [x] 7. Checkpoint - ตรวจสอบ UI components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. สร้าง UI Components - Post-Chain Features
  - [x] 8.1 สร้าง `app/components/AlternateEndings.tsx`
    - แสดง 3 ปุ่ม: "Worst ending", "Best ending", "Delusional ending"
    - แสดงหลังจาก Thought Chain แสดงผลครบ (controlled by `visible` prop)
    - เรียก `onSelect(endingType)` เมื่อกด
    - แสดง loading state ขณะรอ response
    - _Requirements: 8.1, 8.2_

  - [x] 8.2 สร้าง `app/components/ShareCard.tsx`
    - Render card preview ในรูปแบบ: [situation] ↓ Step 1: [text] ↓ ... ↓ Sanity: XX%
    - ปุ่ม "Download image": ใช้ `html-to-image` สร้าง PNG แล้วดาวน์โหลด
    - ปุ่ม "Copy for social": คัดลอกข้อความ Thought Chain ไป clipboard
    - Handle errors: toast สำหรับ image generation fail, fallback modal สำหรับ clipboard fail
    - แสดงหลังจาก Thought Chain แสดงผลครบ
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 8.3 เขียน property test สำหรับ share card content
    - **Property 6: Share card contains all required content**
    - ใช้ fast-check generate random ThoughtChainResult, verify ว่า share text มี situation, ทุก step มี "Step {index}:" prefix, และมี "Sanity: XX%"
    - **Validates: Requirements 6.2**

  - [ ]* 8.4 เขียน property test สำหรับ alternate ending replacement
    - **Property 8: Alternate ending replaces only the last step**
    - ใช้ fast-check generate random chains + new ending, verify ว่า steps ทั้งหมดเหมือนเดิมยกเว้น step สุดท้าย
    - **Validates: Requirements 8.2, 8.3**

- [x] 9. ประกอบหน้าหลักและ Wiring ทุก Components
  - [x] 9.1 สร้าง `app/globals.css` สำหรับ Tailwind directives และ custom animations
    - เพิ่ม Tailwind directives (@tailwind base, components, utilities)
    - สร้าง custom fade-in animation class
    - _Requirements: 10.2, 10.3_

  - [x] 9.2 สร้าง `app/layout.tsx` Root Layout
    - ตั้งค่า metadata, fonts, TailwindCSS
    - _Requirements: 10.2, 10.4_

  - [x] 9.3 สร้าง `app/page.tsx` หน้าหลัก
    - ประกอบทุก components เข้าด้วยกัน: TriggerTemplates → SituationInput → OverthinkLevelSelector → PerspectiveSelector → ThoughtChain → SanityMeter → AlternateEndings → ShareCard
    - จัดการ state: situation, level, perspective, thoughtChainResult, isLoading, error
    - เรียก `/api/generate` เมื่อ submit, เรียก `/api/alternate-ending` เมื่อเลือก ending
    - Handle alternate ending: แทนที่ step สุดท้ายด้วย animation
    - แสดง error message + retry button เมื่อ API error
    - อนุญาตให้เลือก level ใหม่และ regenerate จาก input เดิม
    - Mobile-first responsive layout (375px - 1024px+)
    - _Requirements: 1.1, 1.2, 2.6, 8.2, 8.3, 9.4, 10.1, 10.4_

  - [ ]* 9.4 เขียน property test สำหรับ error handling
    - **Property 10: Error responses show retry option**
    - ใช้ fast-check generate random error types, verify ว่า UI แสดง error message และ submit/retry button ยังใช้งานได้
    - **Validates: Requirements 9.4**

- [x] 10. Final Checkpoint - ตรวจสอบทั้งระบบ
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks ที่มี `*` เป็น optional สามารถข้ามได้เพื่อ MVP ที่เร็วขึ้น
- ทุก task อ้างอิง requirements เพื่อ traceability
- Checkpoints ช่วยตรวจสอบความถูกต้องเป็นระยะ
- Property tests ใช้ fast-check ร่วมกับ Vitest ตรวจสอบ universal correctness properties
- Unit tests ตรวจสอบ specific examples และ edge cases
- เริ่มจาก mock data ก่อน เมื่อ UI ครบแล้วค่อยเชื่อม LLM จริงภายหลัง
