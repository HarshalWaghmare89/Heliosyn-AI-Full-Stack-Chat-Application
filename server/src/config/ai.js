export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

export const SUPPORTED_GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

//--->>> CHECK SUPPORTED MODEL

export const isSupportedGeminiModel = (model) => {
  return SUPPORTED_GEMINI_MODELS.includes(model);
};
