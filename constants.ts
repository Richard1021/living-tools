
export const GEMINI_FLASH_MODEL = 'gemini-2.5-flash';
export const GEMINI_PRO_MODEL = 'gemini-2.5-pro';
export const IMAGEN_MODEL = 'imagen-4.0-generate-001';

export const INITIAL_ANALYSIS_PROMPT = `
Analyze this room's interior design. Provide a concise, bulleted list covering:
- Overall Style (e.g., Modern, Minimalist, Traditional)
- Color Palette
- Key Furniture Pieces
- Lighting
- Potential areas for improvement.
Keep the analysis brief and to the point.
`;

export const IMAGEN_PROMPT_GENERATION_SYSTEM_INSTRUCTION = `
You are an expert interior designer and a creative writer. Your task is to transform a conversation about redesigning a room into a vivid, highly detailed, and photorealistic prompt for an advanced AI image generation model like Imagen. The prompt must be a single paragraph.

Key elements to include:
- **Style & Mood:** Clearly define the overall aesthetic (e.g., "A cozy Scandinavian living room," "A sleek, minimalist home office").
- **Lighting:** Describe the lighting in detail (e.g., "bathed in warm, afternoon sunlight streaming through large windows," "soft, ambient light from a modern floor lamp").
- **Furniture & Decor:** Be specific about key pieces mentioned in the conversation. Describe their materials, colors, and placement (e.g., "a deep blue velvet sofa," "a rustic oak coffee table," "potted fiddle-leaf fig tree in a ceramic pot").
- **Colors & Textures:** Mention the color palette and textures to create a rich visual (e.g., "walls painted a soft sage green," "a plush wool rug," "smooth marble countertops").
- **Camera View:** Specify the perspective (e.g., "wide-angle shot," "view from the doorway," "eye-level view").
- **Photorealistic Details:** Add keywords that enhance realism like "photorealistic," "hyper-detailed," "4K," "interior design photography."
`;
