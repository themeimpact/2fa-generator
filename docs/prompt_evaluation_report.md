# Báo Cáo Đánh Giá Prompt Engineering & Pipeline Video AI

## 1. Tổng Quan
Hệ thống hiện tại có một pipeline khá chặt chẽ, chia tách rõ ràng các giai đoạn từ Concept -> Script -> Storyboard -> Video. Việc sử dụng các Prompt Model riêng (Injectable Classes) là một kiến trúc tốt, dễ bảo trì và mở rộng.

Tuy nhiên, vẫn tồn tại những điểm yếu trong việc:
1.  **Format Prompt cuối cùng gửi cho Video Model**: Việc gửi JSON string trực tiếp có thể làm giảm chất lượng đầu ra của Video AI.
2.  **Sự nhất quán (Consistency)**: Dù có logic `Start Frame = Previous Last Frame`, nhưng phần text prompt chưa tận dụng hết sức mạnh của việc mô tả lại các đặc điểm bất biến (invariant features) của nhân vật/sản phẩm.
3.  **Voiceover**: Thiếu cơ chế cưỡng chế sự đồng nhất về giọng đọc ở mức global context.

---

## 2. Đánh Giá Chi Tiết Từng Loại Kịch Bản

### 2.1. Affiliate Marketing
*   **Điểm mạnh**: `concept.prompt-builder.ts` có bảng `AFFILIATE_CORE_CONCEPTS_TABLE` rất tốt, bám sát các framework marketing thực chiến (Hook, Problem-Solution, v.v.). Prompt tập trung vào conversion và trust-building.
*   **Điểm yếu**: Các prompt tạo cảnh (scene generation) đôi khi tập trung quá nhiều vào "Hành động" mà quên mất việc luôn phải nhắc lại "Sản phẩm này là gì" trong visual prompt, dẫn đến việc sản phẩm có thể bị biến đổi qua các frame.

### 2.2. UGC Creator
*   **Điểm mạnh**: Định nghĩa rõ role `ugc_creator` với phong cách quay handheld, POV, breaking the fourth wall. Logic sản xuất (`productionLogic`) rất phù hợp với TikTok/Reels.
*   **Điểm yếu**: Kịch bản UGC cần sự tự nhiên cao. Việc fix cứng thời lượng 8s/scene (do logic chia scene hiện tại) có thể làm video bị cụt hoặc gượng. UGC thường có nhịp độ rất nhanh (2-3s/cut) hoặc rất dài (talking head).
*   **Đề xuất**: Nên nới lỏng rule "8s/scene" cho UGC, cho phép nhiều shot ngắn hơn gộp lại, hoặc xử lý hậu kỳ cắt ghép tốt hơn.

### 2.3. Brand Marketing
*   **Điểm mạnh**: Tập trung vào Cinematic, emotional connection. Các prompt về ánh sáng và góc máy (`storyboard.prompt-builder.ts`) được xây dựng tốt.
*   **Điểm yếu**: Cần đảm bảo tính nhất quán của Brand Identity (màu sắc, logo) cao hơn so với 2 loại kia. Hiện tại prompt chưa có cơ chế mạnh để "khoá" brand color palette vào từng prompt con.

---

## 3. Trả Lời Các Câu Hỏi Cụ Thể & Đề Xuất

### 3.1. Các prompt đã đủ chặt chẽ chưa?
*   **Về cấu trúc**: Khá chặt chẽ với Zod Schema.
*   **Về nội dung**:
    *   **Prompt Storyboard**: Rất tốt, chia tách rõ Visual, Action, Cinematography.
    *   **Prompt Video Generaton (Step 5)**: **CHƯA TỐT.**
        *   Hiện tại: `const prompt = JSON.stringify(rest_shot);`
        *   Vấn đề: Hầu hết các Video Generative Model (Runway, Kling, Luma) được training trên caption tự nhiên (natural language), không phải JSON. Việc ném nguyên cục JSON vào có thể khiến model bị "bối rối", hoặc hiểu nhầm các key (ví dụ key `bgm` là audio, không liên quan visual nhưng vẫn bị đưa vào prompt).
        *   **Giải pháp**: Cần một hàm `constructVideoGenerationPrompt` ở Step 5 (hoặc Backend) để ghép các field quan trọng thành một câu văn mô tả.
        *   *Ví dụ*: `"[Cinematography.shot_size] shot of [Visual.model_visual_style] [Acting.action_step_by_step] in a [Visual.background_theme]. Lighting is [Cinematography.lighting_setup]. Shot in style of [Cinematography.camera_movement]. High quality, 4k."`

### 3.2. Sự đồng nhất (Consistency) giữa các bước
*   **Hình ảnh**:
    *   Cơ chế `Start Frame Scene N = Last Frame Video N-1` là rất thông minh và cần thiết cho sự liên tục.
    *   **Tuy nhiên**: Nếu Scene 1 bị sai (nhân vật không giống mẫu), toàn bộ video sẽ sai.
    *   **Đề xuất**:
        *   **Luôn đính kèm mô tả** (Textual Inversion/Description) của Model và Product vào **MỖI** video prompt cuối cùng. Đừng chỉ dựa vào Image Input.
        *   Trong `storyboard.prompt-builder.ts`, phần `model_visual_style` nên được copy y nguyên từ scene này sang scene khác nếu cùng một nhân vật, thay vì để AI viết lại mỗi lần có thể gây tam sao thất bản.

### 3.3. Có nên đính kèm mô tả hình ảnh người mẫu và sản phẩm vào từng video prompt cuối cùng không?
*   **CÓ, BẮT BUỘC.**
*   Mặc dù Image-to-Video dùng ảnh tham chiếu, nhưng Text Prompt đóng vai trò hướng dẫn model giữ lại các đặc điểm đó.
*   Nếu không có text mô tả kỹ ("Woman with long curly red hair..."), Video Model có thể tự ý thay đổi kiểu tóc khi nhân vật quay đầu.

### 3.4. Việc tạo cấu hình có nên hay để người dùng tự chọn?
*   **Nên kết hợp (Hybrid)**:
    *   Giữ quy trình hiện tại: AI Suggest -> User Review/Edit.
    *   Đây là cách tốt nhất vì người dùng marketing thường có ý đồ riêng (Target Audience, Campaign specific) mà AI không đoán hết được.
    *   Cần highlight rõ những field mà AI "tự bịa" để người dùng chú ý check kỹ (hiện tại code đã có logic này nhưng cần UI rõ ràng hơn).

### 3.5. Giọng đọc (Voiceover) chưa có sự thống nhất giữa các cảnh
*   **Nguyên nhân**: Prompt cho Voiceover (`vo_direction`) đang nằm lẻ tẻ trong từng scene object. Lúc thì "Hào hứng", lúc thì "Trầm ấm".
*   **Giải pháp**:
    *   Cần một trường `global_voice_profile` trong `ScriptSettings`.
    *   Khi generate Storyboard, Prompt Builder phải inject `global_voice_profile` vào system prompt và yêu cầu AI tuân thủ tone giọng đó xuyên suốt, chỉ thay đổi sắc thái (vui/buồn) tùy tình huống nhưng không đổi "Character" (nhân vật).

### 3.6. Video prompt cuối cùng ở @step-5-scene-generation.tsx dùng JSON đã đủ tốt chưa?
*   **KHÔNG.** Như đã phân tích ở mục 3.1.
*   JSON chứa nhiều thông tin nhiễu (`sfx`, `dialogue`) mà Video Generation Model không cần (hoặc tệ hơn là model sẽ cố gắng render ra text/subtitle nếu thấy field `dialogue`).
*   **Key cần bổ sung/thay đổi**:
    *   Cần **Negative Prompt** (nếu Model support) để loại bỏ text, watermark, bad hands.
    *   Cần flattener JSON thành Natural Language Description.

---

## 4. Danh sách công việc đề xuất (Action Plan)

1.  **Refactor `Step 5 (frontend)` hoặc `Backend API`**:
    *   Viết hàm `buildVideoPromptFromShot(shot)`: Convert `visual` + `acting` + `cinematography` -> Natural Language Prompt.
    *   Loại bỏ `audio`, `dialogue` ra khỏi visual prompt.
    *   Luôn append `Core Model Description` + `Product Description` vào cuối prompt.

2.  **Cải thiện `script.prompt-builder.ts` & `storyboard.prompt-builder.ts`**:
    *   Thêm quy tắc Global Voice Consistency.
    *   Trong `visual_prompts`, yêu cầu AI *không* mô tả lại các đặc điểm ngoại hình động (ví dụ: quần áo thay đổi) trừ khi đó là ý đồ kịch bản.

3.  **UI/UX**:
    *   Tại Step 4 (Storyboard Editor), cho phép user sửa lại "Global descriptions" (Mô tả chung về Model/Product) và apply nó vào tất cả các scene prompts một cách tự động.

4.  **Tối ưu UGC**:
    *   Cân nhắc cho phép gộp scene ngắn hoặc chỉnh duration linh hoạt hơn hard-code 8s.
