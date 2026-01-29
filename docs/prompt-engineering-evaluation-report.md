# Báo Cáo Đánh Giá Prompt Engineering - VideoImpact

**Ngày đánh giá:** 10/01/2026  
**Phiên bản:** 1.0  
**Đánh giá bởi:** AI Prompt Engineer

---

## 1. Tổng Quan Hệ Thống

### 1.1 Luồng Xử Lý Prompt

```
Bước 1: Upload Images (Product, Model, Style)
    ↓
Bước 2: Generate Concepts (concept.prompt-builder.ts)
    ↓
Bước 3: Configure Settings (suggest-configuration.prompt-builder.ts)
    ↓
Bước 4: Generate Script Drafts (script.prompt-builder.ts)
    ↓
Bước 5: Generate Storyboard (storyboard.prompt-builder.ts)
    ↓
Bước 6: Generate Videos (step-5-scene-generation.tsx)
```

### 1.2 Các Loại Video Được Hỗ Trợ

| Loại Video | Mục Đích | Đặc Điểm |
|------------|----------|----------|
| **Affiliate** | Conversion, bán hàng | Product demo, trust-building, CTA mạnh |
| **Marketing** | Brand awareness | Cinematic, emotional storytelling |
| **UGC Creator** | Review chân thật | Authentic, iPhone aesthetic, jump cuts |

---

## 2. Đánh Giá Chi Tiết Từng Prompt Builder

### 2.1 Concept Prompt Builder

**File:** `apps/backend/src/llm/prompts/concept.prompt-builder.ts`

#### Điểm Mạnh ✅
- **Identity rõ ràng:** Mỗi loại video có persona riêng (Creative Director, Senior Copywriter, UGC Creator)
- **Core Concepts Table:** Bảng 15 concept chuẩn cho affiliate/ugc rất chi tiết với công thức, mục tiêu tâm lý
- **Output Schema chặt chẽ:** Sử dụng Zod validation với structure rõ ràng
- **Scripting Formula:** Hook → Body → Punchline structure tốt

#### Điểm Yếu ⚠️
- **Thiếu mô tả hình ảnh nguyên mẫu:** Concept chỉ tập trung vào ý tưởng kịch bản, chưa tạo ra mô tả visual cụ thể cho model/product
Reviewer: Chúng ta cần thêm bước phân tích hình ảnh để tạo ra mô tả visual cụ thể cho model/product. Mặc dù đã có 1 prompt nhỏ tạo ảnh prototype tuy nhiên chưa thực sự tạo ra đúng với nhu cầu. Ảnh prototype nên được tạo ra ở màn hình của bước 5 để tạo prototype cho từng frame image.
- **Không có thumbnail preview:** Thiếu prompt tạo ảnh đại diện cho mỗi concept
Reviewer: Không cần thiết tạo ảnh đại diện cho concept.
- **Marketing type thiếu core concepts:** Chỉ có default task, không có bảng concept như affiliate/ugc
Reviewer: Marketing cần sự sáng tạo hơn, tuy nhiên bạn có thể tạo một vài concept nguyên mẫu và sử dụng chúng làm nguyên mẫu cho các concept khác và yêu cầu LLM tạo ra các concept dựa trên nguyên mẫu đó.

#### Đề Xuất Cải Thiện
```typescript
// Thêm vào ConceptResponseSchema
visual_reference: z.object({
  model_description: z.string().describe("Mô tả chi tiết người mẫu sẽ xuất hiện"),
  product_placement: z.string().describe("Cách sản phẩm xuất hiện trong concept"),
  scene_mood_board: z.string().describe("Mô tả visual mood của concept")
})
```

**Điểm đánh giá: 7/10**

---

### 2.2 Suggest Configuration Prompt Builder

**File:** `apps/backend/src/llm/prompts/suggest-configuration.prompt-builder.ts`

#### Điểm Mạnh ✅
- **Schema đầy đủ:** ScriptSettings + ProductSettings với CoreIdentity, AestheticVibe, SceneConstruction
- **Language requirement:** Nhấn mạnh ngôn ngữ đầu ra
- **Flexibility:** Giữ nguyên giá trị user đã chọn, chỉ suggest cái thiếu

#### Điểm Yếu ⚠️
- **voiceActor không được validate:** Chỉ suggest từ danh sách cố định (sarah, mike, emma, alex) nhưng không link với ngôn ngữ
Reviewer: Mở rộng danh sách cố định, mỗi voice cần một voice direction cụ thể và link với ngôn ngữ cũng như accent cụ thể của voice đó.
- **mainColor detection:** Có thể không chính xác khi detect từ hình ảnh.
Reviewer: Xóa phần mainColor cũng được. Chúng ta không sử dụng setting này.
- **Thiếu model_description:** Không có field mô tả chi tiết người mẫu để maintain consistency
Reviewer: Thêm field này để maintain consistency về người mẫu. Đề xuất phân tích hình ảnh ngay khi được upload lên ở Bước 1. Cần cập nhật giao diện upload để người dùng có thể xem và chỉnh sửa mô tả này. Áp dụng cho cả hình ảnh sản phẩm, người mẫu và bối cảnh (style)
#### Đề Xuất Cải Thiện
```typescript
// Thêm vào ProductSettingsSchema
modelDescription: z.object({
  appearance: z.string().describe("Mô tả ngoại hình: tóc, da, khuôn mặt"),
  clothing_style: z.string().describe("Phong cách trang phục"),
  age_range: z.string().describe("Độ tuổi ước tính"),
  gender: z.string().describe("Giới tính")
})
```

**Điểm đánh giá: 7.5/10**

---

### 2.3 Script Prompt Builder

**File:** `apps/backend/src/llm/prompts/script.prompt-builder.ts`

#### Điểm Mạnh ✅
- **Scene-to-Scene Continuity Rules:** Quy tắc rõ ràng về start_frame và end_frame
- **Production Logic:** Hướng dẫn phân tích sản phẩm và model
- **Visual Prompts Structure:** start_frame_image và end_frame_image cho mỗi scene
- **@refName syntax:** Hướng dẫn sử dụng reference images

#### Điểm Yếu ⚠️

##### 🔴 VẤN ĐỀ NGHIÊM TRỌNG: Thiếu Prototype Images cho Từng Scene

```
Hiện tại:
Scene 1: start_frame_image (text prompt) → end_frame_image (text prompt)
Scene 2: start_frame_image ("") → end_frame_image (text prompt)

Vấn đề: 
- Text prompt không đảm bảo consistency về model/product appearance
- Không có ảnh nguyên mẫu được tạo trước khi generate video
- Video scene 1 và scene 2 có thể có model khác nhau
```

##### Quy trình đề xuất:
```
Bước 4 (Cải tiến):
1. Generate storyboard với text prompts
2. Tạo START_FRAME_IMAGE cho scene 1 từ text prompt + reference images
3. Tạo END_FRAME_IMAGE cho scene 1
4. [Optional] User review và approve images trước khi generate video

Bước 5:
1. Generate video scene 1: start_frame → end_frame
2. Extract last_frame từ video scene 1
3. Generate video scene 2: last_frame (scene 1) → end_frame (scene 2)
```

##### Các vấn đề khác:
- **dialogue limit:** "dưới 15 từ hoặc jump cut dưới 25 từ" - cần validate ở output
- **voiceActor không được pass qua:** scriptSettings.voiceActor không xuất hiện trong output
- **Thiếu model visual description:** visual_prompts không bắt buộc mô tả model

#### Đề Xuất Cải Thiện

```typescript
// Thêm vào ScriptResponseSchema
model_consistency: z.object({
  primary_model_description: z.string().describe("Mô tả chi tiết người mẫu chính: tóc, da, trang phục"),
  product_appearance: z.string().describe("Mô tả chi tiết sản phẩm trong video"),
  scene_setting: z.string().describe("Bối cảnh chung xuyên suốt video")
}),

// Trong visual_prompts, thêm:
visual_prompts: z.object({
  model_reference: z.string().describe("@refName của model prototype hoặc mô tả chi tiết"),
  product_reference: z.string().describe("@refName của product prototype"),
  style_reference: z.string().describe("@refName của style prototype"),
  start_frame_image: z.string(),
  end_frame_image: z.string()
})
```

**Điểm đánh giá: 6.5/10**

---

### 2.4 Storyboard Prompt Builder

**File:** `apps/backend/src/llm/prompts/storyboard.prompt-builder.ts`

#### Điểm Mạnh ✅
- **Chi tiết cao:** visual, acting_and_props, cinematography, audio_foley, ai_visual_director
- **Production Overview:** project_name, visual_strategy, background_theme, model_visual_style
- **@refName enforcement:** Yêu cầu sử dụng syntax để reference images
- **Scene continuity rules:** Giống script builder, đảm bảo start/end frame logic

#### Điểm Yếu ⚠️
- **model_visual_style chỉ ở overview:** Không được nhúng vào từng shot
- **background_theme có thể inconsistent:** Mỗi shot có riêng nhưng không enforce giống overview
- **audio_foley.dialogue thiếu voice direction:** Không link với voiceActor đã chọn
- **Thiếu product_description trong shot:** Không có field mô tả sản phẩm trong từng scene

#### Đề Xuất Cải Thiện

```typescript
// Thêm vào StoryboardShotSchema
consistency_anchors: z.object({
  model_visual: z.string().describe("COPY CHÍNH XÁC từ production_overview.model_visual_style"),
  background: z.string().describe("COPY CHÍNH XÁC từ production_overview.background_theme"),
  product_in_scene: z.string().describe("Mô tả sản phẩm xuất hiện trong scene này"),
  voice_actor: z.string().describe("Tên voice actor từ settings: ${voiceActor}")
})
```

**Điểm đánh giá: 7/10**

---

### 2.5 Video Generation Prompt (Step 5)

**File:** `apps/frontend/components/features/projects/wizard/step-5-scene-generation.tsx`

#### Phân Tích JSON Structure

```typescript
// Hiện tại (line 132-134):
const { ai_visual_director, ...rest_shot } = shot;
const prompt = JSON.stringify(rest_shot);
```

**JSON được gửi đến video generator:**
```json
{
  "scene_id": 1,
  "visual": {
    "background_theme": "...",
    "model_visual_style": "..."
  },
  "acting_and_props": {
    "action_step_by_step": "...",
    "manner_and_emotion": "...",
    "props_interaction": "..."
  },
  "cinematography": {
    "shot_size": "...",
    "camera_angle": "...",
    "camera_movement": "...",
    "lens_and_fps": "...",
    "lighting_setup": "..."
  },
  "audio_foley": {
    "sfx": "...",
    "vo_direction": "...",
    "dialogue": "..."
  }
}
```

#### Điểm Mạnh ✅
- **Structured data:** JSON format dễ parse
- **Start/End frame handling:** video_start_frame_image được lấy từ previous scene
- **Sequential generation:** Đảm bảo scene trước hoàn thành trước khi generate scene sau

#### Điểm Yếu ⚠️

##### 🔴 THIẾU CÁC KEY QUAN TRỌNG:

| Key Thiếu | Tác Động | Đề Xuất |
|-----------|----------|---------|
| `product_description` | AI không biết sản phẩm trông như thế nào | Thêm từ productSettings |
| `model_description` | AI có thể tạo model khác nhau giữa các scene | Thêm từ production_overview |
| `voice_actor` | Không có thông tin giọng đọc | Thêm từ scriptSettings |
| `brand_identity` | Thiếu context brand | Thêm brand_name, brand_voice |
| `reference_images` | AI không biết dùng ảnh nào | Thêm @refName list |

#### Đề Xuất JSON Structure Cải Tiến

```json
{
  "scene_id": 1,
  "global_context": {
    "product_name": "...",
    "product_description": "Chai nước hoa 50ml, màu vàng gold, nắp kim loại bạc...",
    "model_description": "Người mẫu nữ, tóc dài đen, da trắng, mặc đầm đỏ...",
    "brand_name": "...",
    "brand_voice": "sophisticated-elegant",
    "voice_actor": "emma",
    "reference_images": ["@product_01", "@model_01", "@style_01"]
  },
  "visual": {
    "background_theme": "...",
    "model_visual_style": "..."
  },
  "acting_and_props": {
    "action_step_by_step": "...",
    "manner_and_emotion": "...",
    "props_interaction": "..."
  },
  "cinematography": {
    "shot_size": "...",
    "camera_angle": "...",
    "camera_movement": "...",
    "lens_and_fps": "...",
    "lighting_setup": "..."
  },
  "audio_foley": {
    "sfx": "...",
    "vo_direction": "Giọng nữ, nhẹ nhàng, quyến rũ - voice: emma",
    "dialogue": "..."
  }
}
```

**Điểm đánh giá: 5.5/10**

---

## 3. Phân Tích Tính Đồng Nhất

### 3.1 Đồng Nhất Nhân Vật (Model Consistency)

| Bước | Có Mô Tả Model? | Được Truyền Qua? | Vấn Đề |
|------|-----------------|------------------|--------|
| Bước 1 | Ảnh upload | ✅ Images | Chỉ là ảnh, không có text description |
| Bước 2 | Không | ❌ | Concept không tạo model description |
| Bước 3 | Không | ❌ | productSettings thiếu model field |
| Bước 4 | model_visual_style | ⚠️ Partial | Chỉ style, không phải appearance |
| Bước 5 | model_visual_style | ⚠️ Partial | Không có chi tiết đầy đủ |
| Bước 6 | visual.model_visual_style | ⚠️ Partial | Video generator có thể ignore |

**Kết luận:** Model description KHÔNG được maintain consistent từ đầu đến cuối.

### 3.2 Đồng Nhất Sản Phẩm (Product Consistency)

| Bước | Có Mô Tả Product? | Được Truyền Qua? | Vấn Đề |
|------|-------------------|------------------|--------|
| Bước 1 | Ảnh upload | ✅ Images | Chỉ là ảnh |
| Bước 2 | Không | ❌ | - |
| Bước 3 | productName, productDescription | ✅ | Tốt |
| Bước 4 | Product Identity | ⚠️ Partial | Chỉ trong context, không trong output |
| Bước 5 | Không | ❌ | Storyboard không có product field |
| Bước 6 | Không | ❌ | Video prompt thiếu product info |

**Kết luận:** Product description bị MẤT từ bước 4 trở đi.

### 3.3 Đồng Nhất Bối Cảnh (Style Consistency)

| Bước | Có Mô Tả Style? | Được Truyền Qua? | Vấn Đề |
|------|-----------------|------------------|--------|
| Bước 1 | Ảnh upload | ✅ Images | - |
| Bước 3 | environmentDescription, lightingSetup, backgroundTheme | ✅ | Tốt |
| Bước 4 | Scene Construction | ⚠️ Partial | - |
| Bước 5 | production_overview.background_theme | ✅ | Tốt |
| Bước 6 | visual.background_theme | ✅ | Tốt nhưng mỗi shot có thể khác |

**Kết luận:** Style được maintain khá tốt nhưng cần enforce giống nhau giữa các shot.

### 3.4 Đồng Nhất Giọng Đọc (Voice Consistency)

| Bước | Có Voice Info? | Được Truyền Qua? | Vấn Đề |
|------|----------------|------------------|--------|
| Bước 3 | voiceActor | ✅ Saved | - |
| Bước 4 | Không | ❌ | Script không có voice field |
| Bước 5 | vo_direction | ⚠️ Partial | Chỉ mô tả tone, không có voice actor |
| Bước 6 | audio_foley.vo_direction | ⚠️ Partial | Không link với voiceActor |

**Kết luận:** voiceActor được chọn nhưng KHÔNG được sử dụng trong prompts.

---

## 4. Câu Hỏi Từ Người Dùng

### 4.1 Có nên đính kèm mô tả model và product vào video prompt cuối cùng?

**Trả lời: CÓ, BẮT BUỘC PHẢI CÓ.**

**Lý do:**
- AI video generators (như Kling, Runway, Pika) cần text description để maintain consistency
- Reference image (@refName) chỉ là gợi ý, không đảm bảo AI hiểu đúng
- Mô tả text + reference image = kết quả consistent nhất

**Đề xuất implementation:**

```typescript
// Trong step-5-scene-generation.tsx
const buildVideoPrompt = (shot: Shot, projectSettings: any) => {
  return {
    ...shot,
    global_context: {
      product_description: projectSettings.productSettings?.coreIdentity?.productDescription,
      model_description: storyboardData.production_overview.model_visual_style,
      voice_actor: projectSettings.scriptSettings?.voiceActor,
      brand_name: projectSettings.productSettings?.coreIdentity?.brandName,
    }
  };
};
```

### 4.2 Việc tạo cấu hình nên để AI suggest hay user tự chọn?

**Trả lời: KẾT HỢP CẢ HAI (Hybrid Approach)**

| Approach | Ưu Điểm | Nhược Điểm |
|----------|---------|------------|
| AI Suggest | Nhanh, dựa trên ảnh | Có thể không đúng ý user |
| User Manual | Chính xác | Mất thời gian, user không biết chọn gì |
| **Hybrid** | Tốt nhất cả hai | Cần UI tốt |

**Đề xuất workflow:**
1. AI suggest → User review → User edit nếu cần → Confirm
2. Các field quan trọng (product name, brand name) nên bắt buộc user nhập
3. Các field kỹ thuật (lighting, camera) nên AI suggest

### 4.3 Giọng đọc chưa có sự thống nhất giữa các cảnh?

**Trả lời: ĐÚNG, ĐÂY LÀ LỖ HỔNG NGHIÊM TRỌNG.**

**Vấn đề hiện tại:**
- `voiceActor` được chọn ở bước 3 (scriptSettings)
- KHÔNG được pass vào script.prompt-builder
- KHÔNG xuất hiện trong storyboard
- KHÔNG có trong video generation prompt

**Giải pháp:**

```typescript
// 1. Thêm vào ScriptResponseSchema
voice_configuration: z.object({
  voice_actor: z.string().describe("Voice actor từ settings"),
  voice_tone: z.string().describe("Tone giọng xuyên suốt video"),
  voice_pacing: z.string().describe("Tốc độ nói")
})

// 2. Thêm vào StoryboardShotSchema.audio_foley
audio_foley: z.object({
  voice_actor: z.string().describe("Voice actor cho scene này - MUST match settings"),
  vo_direction: z.string(),
  dialogue: z.string()
})

// 3. Thêm vào video prompt JSON
audio_foley: {
  voice_actor: "emma", // Từ scriptSettings
  voice_language: "Vietnamese",
  ...
}
```

### 4.4 Video prompt JSON đã đủ tốt chưa? Cần bổ sung key nào?

**Trả lời: CHƯA ĐỦ. Cần bổ sung các key sau:**

#### Keys cần thêm:

| Key | Mục đích | Giá trị mẫu |
|-----|----------|-------------|
| `global_context.product_description` | Maintain product appearance | "Chai nước hoa 50ml màu vàng..." |
| `global_context.model_description` | Maintain model appearance | "Người mẫu nữ, tóc dài đen..." |
| `global_context.voice_actor` | Consistent voice | "emma" |
| `global_context.brand_identity` | Brand context | "Luxury, elegant" |
| `reference_images` | AI biết dùng ảnh nào | ["@product_01", "@model_01"] |
| `scene_duration` | Control timing | 8 |
| `transition_from_previous` | Smooth transition | "Tiếp nối từ scene trước" |

#### Đề xuất cấu trúc JSON hoàn chỉnh:

```json
{
  "scene_id": 1,
  "scene_duration": 8,
  
  "global_context": {
    "product_name": "Perfume XYZ",
    "product_description": "Chai nước hoa thủy tinh trong suốt 50ml, nắp kim loại vàng, có logo chữ X nổi",
    "model_description": "Người mẫu nữ châu Á, tóc dài đen xõa vai, da trắng, khoảng 25 tuổi, mặc đầm đỏ lụa",
    "brand_name": "Brand ABC",
    "brand_voice": "sophisticated-elegant",
    "visual_style": "cinematic-luxury",
    "voice_actor": "emma",
    "voice_language": "Vietnamese"
  },
  
  "reference_images": {
    "product": "@product_prototype_01",
    "model": "@model_prototype_01", 
    "style": "@style_prototype_01"
  },
  
  "visual": {
    "background_theme": "Phòng khách luxury với sofa nhung xanh, ánh sáng vàng ấm",
    "model_visual_style": "Elegant, sophisticated, minimal makeup"
  },
  
  "acting_and_props": {
    "action_step_by_step": "Model cầm chai nước hoa lên, xịt nhẹ vào cổ tay, đưa lên ngửi và mỉm cười",
    "manner_and_emotion": "Chậm rãi, nhẹ nhàng, biểu cảm satisfied và confident",
    "props_interaction": "Tay phải cầm chai nước hoa, tay trái đỡ cổ tay, đưa lên gần mũi"
  },
  
  "cinematography": {
    "shot_size": "Medium Close-up",
    "camera_angle": "Eye-level, slightly tilted right",
    "camera_movement": "Slow dolly in",
    "lens_and_fps": "85mm f1.4, 60fps",
    "lighting_setup": "Key light 45 độ bên trái, fill light nhẹ bên phải, rim light phía sau"
  },
  
  "audio_foley": {
    "voice_actor": "emma",
    "sfx": "Tiếng xịt nhẹ của chai nước hoa",
    "vo_direction": "Giọng nữ nhẹ nhàng, quyến rũ, tempo chậm",
    "dialogue": "Hương thơm này... khiến tôi tự tin hơn mỗi ngày"
  },
  
  "transition": {
    "from_previous": null,
    "to_next": "Cross-fade to scene 2"
  }
}
```

---

## 5. Ma Trận Đánh Giá Theo Loại Video

### 5.1 Affiliate Marketing Video

| Tiêu Chí | Điểm | Ghi Chú |
|----------|------|---------|
| Product Showcase | 6/10 | Cần thêm product_description vào video prompt |
| Trust Building | 7/10 | Có authentic tone nhưng thiếu testimonial structure |
| CTA Integration | 8/10 | Có hướng dẫn CTA rõ ràng |
| Conversion Focus | 7/10 | Core concepts tốt nhưng execution cần improve |
| Model Consistency | 5/10 | Thiếu enforce model description |

**Tổng điểm: 6.6/10**

### 5.2 Marketing Video

| Tiêu Chí | Điểm | Ghi Chú |
|----------|------|---------|
| Brand Storytelling | 7/10 | Có emotional connection framework |
| Visual Quality | 7/10 | Cinematic instructions tốt |
| Emotional Impact | 6/10 | Thiếu mood consistency enforcement |
| Brand Identity | 5/10 | brand_voice không được pass qua |
| Production Value | 7/10 | Good cinematography instructions |

**Tổng điểm: 6.4/10**

### 5.3 UGC Creator Video

| Tiêu Chí | Điểm | Ghi Chú |
|----------|------|---------|
| Authenticity | 8/10 | iPhone aesthetic, handheld instructions tốt |
| Jump Cut Usage | 8/10 | Có hướng dẫn rõ ràng |
| Review Structure | 7/10 | Hook → Problem → Solution → CTA |
| Relatable Feel | 7/10 | POV, selfie angle instructions |
| Model Consistency | 5/10 | Same issue as others |

**Tổng điểm: 7/10**

---

## 6. Roadmap Cải Thiện

### Phase 1: Critical Fixes (Ưu tiên cao)

1. **Thêm model_description vào flow**
   - Tạo field mới trong suggest-configuration
   - Pass qua script → storyboard → video prompt
   
2. **Thêm product_description vào video prompt**
   - Lấy từ productSettings.coreIdentity
   - Include trong mỗi scene

3. **Fix voice_actor consistency**
   - Pass voiceActor từ scriptSettings vào storyboard
   - Include trong audio_foley của mỗi shot

### Phase 2: Enhancement (Ưu tiên trung bình)

4. **Tạo prototype images trước video generation**
   - Generate start_frame_image cho scene 1 ở bước 4
   - User review/approve trước khi generate video

5. **Cải thiện JSON structure cho video generation**
   - Thêm global_context
   - Thêm reference_images
   - Thêm transition info

### Phase 3: Advanced (Ưu tiên thấp)

6. **Marketing core concepts table**
   - Tạo bảng concept tương tự affiliate cho marketing type

7. **Voice-to-language mapping**
   - Validate voiceActor phù hợp với language đã chọn

8. **Automatic consistency check**
   - AI review để đảm bảo model/product/style consistent giữa scenes

---

## 7. Kết Luận

### Điểm Mạnh Tổng Thể
- Structure prompt rõ ràng với Zod schema
- Scene-to-scene continuity logic tốt
- Core concepts table cho affiliate/ugc rất hữu ích
- @refName syntax là ý tưởng hay

### Điểm Yếu Cần Khắc Phục Ngay
1. **Model consistency:** Không có mechanism đảm bảo model giống nhau
2. **Product description lost:** Bị mất từ bước 4 trở đi
3. **Voice actor unused:** Chọn nhưng không dùng
4. **Video prompt incomplete:** Thiếu nhiều context quan trọng

### Điểm Đánh Giá Tổng Thể

| Prompt Builder | Điểm |
|----------------|------|
| Concept | 7/10 |
| Suggest Configuration | 7.5/10 |
| Script | 6.5/10 |
| Storyboard | 7/10 |
| Video Generation | 5.5/10 |
| **Trung bình** | **6.7/10** |

### Khuyến Nghị Cuối Cùng

1. **BẮT BUỘC** thêm product_description và model_description vào video prompt
2. **BẮT BUỘC** fix voice_actor flow từ settings → final video
3. **NÊN** tạo prototype images trước khi generate video
4. **NÊN** để user confirm model/product description trước khi generate
5. **CÂN NHẮC** hybrid approach cho configuration (AI suggest + user confirm)

---

---

## 8. Đánh Giá UI/UX Frontend (Step 3 & Step 4)

### 8.1 Step 3: Script Candidates

**File:** `apps/frontend/components/features/projects/wizard/step-3-script-candidates.tsx`

#### Chức Năng Chính
- Hiển thị danh sách script candidates được AI generate
- Cho phép user chọn script version
- Edit scenes: visualDirection, voiceover, textOverlay, startFrameImageDescribe, endFrameImageDescribe
- Drag & drop để reorder scenes
- Generate storyboard từ selected script

#### Điểm Mạnh ✅
- **Multi-draft generation:** Cho phép generate nhiều script variants (1-10)
- **Scene editing:** User có thể edit từng scene chi tiết
- **Regenerate option:** Có thể xóa và regenerate scripts mới
- **Visual preview:** Hiển thị duration, tone cho mỗi script candidate

#### Điểm Yếu ⚠️

| Vấn Đề | Mô Tả | Tác Động |
|--------|-------|----------|
| **voiceActor không hiển thị** | `scriptSettings.voiceActor` được pass vào API nhưng không hiển thị trong UI | User không biết voice nào được chọn |
| **Thiếu product preview** | Không có preview sản phẩm trong context | User mất reference |
| **Scene metadata phức tạp** | `startFrameImageDescribe`, `endFrameImageDescribe` là text nhưng không được sử dụng trong step 4 | Data redundancy |

#### Luồng Dữ Liệu

```
scriptSettings (step 2) 
    → scriptsApi.generateScripts() 
    → Script + Scenes (database)
    → scenesApi.updateScene() (edit)
    → projectsApi.generateStoryboard() 
    → step 4
```

**Vấn đề:** `voiceActor` từ scriptSettings được gửi đến backend nhưng:
1. Không được lưu vào script metadata
2. Không xuất hiện trong scenes
3. Không được pass sang storyboard

---

### 8.2 Step 4: Storyboard Editor

**File:** `apps/frontend/components/features/projects/wizard/step-4-storyboard-editor.tsx`

#### Chức Năng Chính
- Edit Production Overview: project_name, visual_strategy, background_theme, model_visual_style
- Edit từng Shot: visual, acting_and_props, cinematography, audio_foley, ai_visual_director
- Generate frame images từ prompts với @refName reference
- AI-powered scene modification

#### Điểm Mạnh ✅

##### 🟢 @refName Reference System Hoạt Động Tốt

```typescript
// Line 194-222: Extract refNames từ prompt
const refNameRegex = /@(\w+)/g;
const matches = prompt.match(refNameRegex);
const refNames = matches ? matches.map(m => m.substring(1)) : [];

// Find matching images từ all sources
const allImages = [
  ...productImages,
  ...modelImages,
  ...(styleImage ? [styleImage] : []),
  ...(productPrototypes || []),
  ...(modelPrototypes || []),
  ...(stylePrototypes || [])
];

const matchedImages = allImages.filter(img =>
  img.refName && refNames.includes(img.refName)
);
```

**Đánh giá:** Cơ chế @refName reference tốt, cho phép AI sử dụng đúng ảnh khi generate frames.

##### 🟢 Scene Continuity Logic Đúng

```typescript
// Line 322-337: Scene 1 gets both start + end, Scene N+1 only end
if (index === 0 && shot.ai_visual_director.start_frame_image_prompt) {
  // Start frame - ONLY for Scene 1
  handleGeneratePreview(index, 'start');
}
// End frame - For ALL scenes
if (shot.ai_visual_director.end_frame_image_prompt) {
  handleGeneratePreview(index, 'end');
}
```

**Đánh giá:** Logic đúng - scene 1 cần start frame, các scene sau lấy từ video trước.

##### 🟢 Editable Fields Đầy Đủ

| Tab | Fields |
|-----|--------|
| Visuals & Prompt | action_step_by_step, background_theme, model_visual_style, start/end_frame_image_prompt |
| Acting & Props | action_step_by_step, manner_and_emotion, props_interaction |
| Cinematography | shot_size, camera_angle, camera_movement, lens_and_fps, lighting_setup |
| Audio & Foley | sfx, vo_direction, dialogue |
| Data | JSON view (read-only) |

#### Điểm Yếu ⚠️

##### 🔴 audio_foley Thiếu voice_actor Field

```typescript
// Hiện tại trong audio_foley:
{
  sfx: string,
  vo_direction: string,  // Chỉ có hướng dẫn giọng
  dialogue: string
}

// Thiếu:
{
  voice_actor: string,   // "emma", "sarah", etc.
  voice_language: string // "Vietnamese", "English"
}
```

**Tác động:** Không biết scene này dùng giọng gì, vo_direction chỉ mô tả tone chứ không specify voice.

##### 🔴 model_visual_style Có Thể Inconsistent

```typescript
// Production Overview có model_visual_style
storyboardData.production_overview.model_visual_style

// Mỗi shot cũng có model_visual_style riêng
shot.visual.model_visual_style
```

**Vấn đề:** 
- User có thể edit model_visual_style khác nhau cho mỗi shot
- Không có validation/sync với production_overview
- Có thể dẫn đến model khác nhau giữa các scene

##### 🔴 Không Có product_description Anywhere

Tìm kiếm trong step-4:
- Không có field product_description
- Không có field product_name trong shot
- productSettings từ step 2 không được hiển thị

**Tác động:** User không thể review/edit product description trước khi generate video.

##### 🟡 AI Scene Modification Hữu Ích Nhưng Thiếu Context

```typescript
// Line 390-431: Modify scene via AI
const modifiedScene = await projectsApi.modifyScene(projectId, sceneId, prompt);
```

**Vấn đề:** API modifyScene nhận user prompt nhưng không biết có pass productSettings, voiceActor không.

---

### 8.3 Data Flow Analysis: voiceActor

```
Step 2: voiceActor selected → saved to scriptSettings ✅
         ↓
Step 3: scriptSettings.voiceActor → passed to generateScripts() ✅
         ↓
Backend: script.prompt-builder → KHÔNG có voiceActor trong output schema ❌
         ↓
Step 3: Script.scenes → KHÔNG có voice info ❌
         ↓
Step 4: Storyboard → audio_foley.vo_direction (chỉ mô tả tone) ⚠️
         ↓
Step 5: Video prompt JSON → KHÔNG có voice_actor ❌
```

**Kết luận:** voiceActor bị DROP từ backend script generation.

---

### 8.4 Data Flow Analysis: productDescription

```
Step 2: productDescription entered → saved to productSettings ✅
         ↓
Step 3: productSettings available in metadata ✅
         ↓
Step 3: generateScripts() → passed as context ✅
         ↓
Backend: script.prompt-builder.constructUserPrompt() → Product Identity section ✅
         ↓
Step 3: Script output → KHÔNG có product field trong scene ❌
         ↓
Step 4: Storyboard → KHÔNG có product field ❌
         ↓
Step 5: Video prompt → KHÔNG có product_description ❌
```

**Kết luận:** productDescription được dùng làm context nhưng KHÔNG được output.

---

### 8.5 Frame Generation Flow (Điểm Sáng)

```
Step 4: User clicks "Generate Preview"
         ↓
Extract @refName từ prompt (regex)
         ↓
Match với productImages, modelImages, styleImage, *Prototypes
         ↓
mediaGenerationApi.generateImage({
  prompt: frame_prompt,
  ingredientImages: matched_image_ids,  // ← Reference images
  type: SCENE_START_FRAME | SCENE_END_FRAME,
  size: aspect_ratio
})
         ↓
Poll for completion → Update ai_visual_director.start/end_frame_image
```

**Đánh giá:** Flow này tốt! Reference images được extract và pass correctly.

---

### 8.6 Đề Xuất Cải Thiện UI/UX

#### Step 3 Improvements

| Cải Tiến | Priority | Effort |
|----------|----------|--------|
| Hiển thị voiceActor đã chọn trong summary | High | Low |
| Thêm product preview panel | Medium | Medium |
| Remove redundant startFrameImageDescribe/endFrameImageDescribe | Low | Low |

#### Step 4 Improvements

| Cải Tiến | Priority | Effort |
|----------|----------|--------|
| Thêm voice_actor field vào audio_foley section | High | Low |
| Thêm product_description display (read-only) | High | Low |
| Sync validation cho model_visual_style giữa overview và shots | Medium | Medium |
| Hiển thị voiceActor trong Audio & Foley tab | High | Low |

#### Proposed UI Changes

**Audio & Foley Tab (Step 4):**
```tsx
// Hiện tại
<label>
  <p>Voiceover Direction</p>
  <textarea value={shot.audio_foley.vo_direction} />
</label>

// Đề xuất thêm
<label>
  <p>Voice Actor</p>
  <select value={shot.audio_foley.voice_actor} disabled>
    <option value="emma">Emma (Female)</option>
    <option value="sarah">Sarah (Female)</option>
    <option value="mike">Mike (Male)</option>
    <option value="alex">Alex (Male)</option>
  </select>
  <small>Set in Step 2 - Script Settings</small>
</label>
```

**Production Overview (Step 4):**
```tsx
// Đề xuất thêm section
<label>
  <p>Product Description</p>
  <textarea 
    value={productSettings?.coreIdentity?.productDescription} 
    readOnly 
    className="bg-gray-100"
  />
  <small>Edit in Step 2 - Product Settings</small>
</label>
```

---

## 9. Cập Nhật Điểm Đánh Giá

### 9.1 Điểm Mới Sau Khi Review Frontend

| Component | Điểm Cũ | Điểm Mới | Lý Do |
|-----------|---------|----------|-------|
| Script Prompt Builder | 6.5/10 | 6.5/10 | Không đổi |
| Storyboard Prompt Builder | 7/10 | 7/10 | Không đổi |
| Video Generation (Step 5) | 5.5/10 | 5.5/10 | Không đổi |
| **Step 3 UI/UX** | N/A | **7/10** | Tốt nhưng thiếu voice display |
| **Step 4 UI/UX** | N/A | **7.5/10** | @refName tốt, thiếu voice/product |
| **Overall Data Flow** | N/A | **6/10** | voiceActor, productDescription bị drop |

### 9.2 Điểm Trung Bình Tổng Thể Mới

| Category | Score |
|----------|-------|
| Prompt Builders | 6.9/10 |
| Frontend UI/UX | 7.25/10 |
| Data Flow Consistency | 6/10 |
| **Overall** | **6.7/10** |

---

## 10. Action Items Ưu Tiên

### Immediate (Sprint 1)

1. **[Backend]** Thêm `voice_actor` vào `StoryboardShotSchema.audio_foley`
2. **[Backend]** Pass `voiceActor` từ scriptSettings vào storyboard generation
3. **[Frontend]** Hiển thị voiceActor trong Step 4 Audio tab
4. **[Frontend]** Thêm productDescription vào Step 5 video prompt JSON

### Short-term (Sprint 2)

5. **[Backend]** Thêm `product_description` vào storyboard shot schema
6. **[Frontend]** Hiển thị product info trong Step 4
7. **[Backend]** Validate model_visual_style consistency

### Medium-term (Sprint 3)

8. **[Backend]** Thêm `global_context` section vào video prompt JSON
9. **[Frontend]** Preview final video prompt trước khi generate
10. **[Backend]** Auto-fill model/product description từ image analysis

---

*Báo cáo này được tạo dựa trên phân tích code và không tham khảo các file đánh giá có sẵn trong thư mục docs.*
