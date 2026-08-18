import { GoogleGenAI } from "@google/genai";

import {
  DEFAULT_GEMINI_MODEL,
  SUPPORTED_GEMINI_MODELS,
  isSupportedGeminiModel,
} from "../config/ai.js";

//--->> GEMINI AI CLIENT

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//--->> NORMALIZE MODEL NAME

// Google may return:
// models/gemini-3.5-flash
//
// Our application stores:
//
// gemini-3.5-flash
//
// Helps keeps model IDs consistent
// throughout the application.

const normalizeModelName = (modelName) => {
  if (!modelName || typeof modelName !== "string") {
    return null;
  }

  return modelName.startsWith("models/")
    ? modelName.slice("models/".length)
    : modelName;
};

//---->>> GET ERROR STATUS CODE
// This helper keeps the error handling
// consistent.

const getGeminiStatusCode = (error) => {
  const statusCode =
    error?.status ||
    error?.statusCode ||
    error?.code ||
    error?.response?.status ||
    error?.error?.status;

  const numericStatusCode = Number(statusCode);

  return Number.isInteger(numericStatusCode) ? numericStatusCode : null;
};

//--->> CLASSIFY GEMINI ERROR
//
// Converts raw Gemini/API errors into
// safe application-level errors.
//
// The real Gemini error is kept in the
// server console, while the user receives
// a simple and understandable message.

const classifyGeminiError = (error) => {
  const statusCode = getGeminiStatusCode(error);

  const errorMessage =
    error?.message ||
    error?.error?.message ||
    error?.response?.data?.message ||
    "";

  const normalizedMessage = String(errorMessage).toLowerCase();

  //--->>> RATE LIMIT / QUOTA

  if (
    statusCode === 429 ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("resource exhausted") ||
    normalizedMessage.includes("too many requests")
  ) {
    const classifiedError = new Error(
      "The AI service is temporarily rate-limited. Please try again in a moment.",
    );

    classifiedError.statusCode = 429;
    classifiedError.code = "GEMINI_RATE_LIMIT";

    return classifiedError;
  }

  //--->>>> INVALID API KEY / AUTHENTICATION

  if (
    statusCode === 401 ||
    normalizedMessage.includes("api key") ||
    normalizedMessage.includes("unauthenticated") ||
    normalizedMessage.includes("authentication")
  ) {
    const classifiedError = new Error(
      "The AI service could not authenticate the request. Please try again later.",
    );

    classifiedError.statusCode = 502;
    classifiedError.code = "GEMINI_AUTHENTICATION_ERROR";

    return classifiedError;
  }

  //--->>> FORBIDDEN

  if (statusCode === 403) {
    const classifiedError = new Error(
      "The AI service is not available for this request.",
    );

    classifiedError.statusCode = 502;
    classifiedError.code = "GEMINI_FORBIDDEN";

    return classifiedError;
  }

  //--->>>> INVALID REQUEST

  if (
    statusCode === 400 ||
    normalizedMessage.includes("invalid argument") ||
    normalizedMessage.includes("invalid request")
  ) {
    const classifiedError = new Error(
      "The AI request could not be processed. Please check your message and try again.",
    );

    classifiedError.statusCode = 400;
    classifiedError.code = "GEMINI_INVALID_REQUEST";

    return classifiedError;
  }

  //--->>>> MODEL NOT FOUND

  if (
    statusCode === 404 ||
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("model not found")
  ) {
    const classifiedError = new Error(
      "The selected AI model is currently unavailable.",
    );

    classifiedError.statusCode = 503;
    classifiedError.code = "GEMINI_MODEL_UNAVAILABLE";

    return classifiedError;
  }

  //--->>> SERVER / TEMPORARY GEMINI ERROR

  if (
    statusCode === 500 ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504 ||
    normalizedMessage.includes("internal server error") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("temporarily unavailable") ||
    normalizedMessage.includes("timeout")
  ) {
    const classifiedError = new Error(
      "The AI service is temporarily unavailable. Please try again shortly.",
    );

    classifiedError.statusCode = 503;
    classifiedError.code = "GEMINI_SERVICE_UNAVAILABLE";

    return classifiedError;
  }

  //--->>> NETWORK ERROR

  if (
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("fetch failed") ||
    normalizedMessage.includes("connection") ||
    normalizedMessage.includes("econnreset") ||
    normalizedMessage.includes("etimedout") ||
    normalizedMessage.includes("socket")
  ) {
    const classifiedError = new Error(
      "Unable to connect to the AI service. Please try again.",
    );

    classifiedError.statusCode = 503;
    classifiedError.code = "GEMINI_NETWORK_ERROR";

    return classifiedError;
  }

  //---->>> UNKNOWN GEMINI ERROR

  const classifiedError = new Error(
    "The AI service could not process your request. Please try again.",
  );

  classifiedError.statusCode = 502;
  classifiedError.code = "GEMINI_UNKNOWN_ERROR";

  return classifiedError;
};

//--->>> GET VALID GEMINI MODEL

// Validates the model selected by the user.
//
// If no model is provided:
// → Use the default model.
//
// If an unsupported model is provided:
// → Return 400 error.

export const getValidGeminiModel = (model) => {
  const selectedModel = normalizeModelName(model);

  //--->> USE DEFAULT MODEL

  if (!selectedModel) {
    return DEFAULT_GEMINI_MODEL;
  }

  //--->>> CHECK SUPPORTED MODEL

  if (!isSupportedGeminiModel(selectedModel)) {
    const error = new Error(`Unsupported Gemini model: ${selectedModel}`);

    error.statusCode = 400;
    error.code = "UNSUPPORTED_GEMINI_MODEL";

    throw error;
  }

  return selectedModel;
};

//--->>> LIST AVAILABLE GEMINI MODELS

export const listGeminiModels = async () => {
  try {
    const models = await ai.models.list();

    const availableModels = [];

    for await (const model of models) {
      const normalizedName = normalizeModelName(model.name);

      availableModels.push({
        name: normalizedName,
        displayName: model.displayName || normalizedName,
        supportedActions: model.supportedActions || [],
        isSupportedByApp:
          normalizedName !== null &&
          SUPPORTED_GEMINI_MODELS.includes(normalizedName),
      });
    }

    return availableModels;
  } catch (error) {
    console.error("Gemini List Models Error:", error);

    throw classifyGeminiError(error);
  }
};

//---->>>> BUILD GEMINI CONVERSATION HISTORY

const buildConversationContents = (history = [], message) => {
  const contents = [];

  //--->>> PREVIOUS CHAT HISTORY

  for (const item of history) {
    // Ignore invalid messages
    if (!item || !item.content || !item.role) {
      continue;
    }

    // Gemini expects "model" instead of "assistant"
    if (item.role === "assistant") {
      contents.push({
        role: "model",
        parts: [
          {
            text: item.content,
          },
        ],
      });

      continue;
    }

    // User messages
    if (item.role === "user") {
      contents.push({
        role: "user",
        parts: [
          {
            text: item.content,
          },
        ],
      });
    }
  }

  //---->>> CURRENT USER MESSAGE

  contents.push({
    role: "user",
    parts: [
      {
        text: message,
      },
    ],
  });

  return contents;
};

//--->>> GENERATE AI RESPONSE

// Main function used by the chat controller.
//
// Input:
//
// {
//   message,
//   history,
//   model
// }
//
// Output:
//
// {
//   text,
//   model
// }

export const generateGeminiResponse = async ({
  message,
  history = [],
  model = DEFAULT_GEMINI_MODEL,
}) => {
  //--->>>> VALIDATE MESSAGE

  if (!message || typeof message !== "string" || !message.trim()) {
    const error = new Error("Message is required.");

    error.statusCode = 400;
    error.code = "MESSAGE_REQUIRED";

    throw error;
  }

  //--->> VALIDATE MODEL

  const selectedModel = getValidGeminiModel(model);

  //--->>> BUILD CONVERSATION

  const contents = buildConversationContents(history, message.trim());

  //--->>> CALL GEMINI API

  let response;

  try {
    response = await ai.models.generateContent({
      model: selectedModel,
      contents,
    });
  } catch (error) {
    //--->>> LOG REAL TECHNICAL ERROR

    console.error("Gemini API Error:", {
      statusCode: getGeminiStatusCode(error),
      message: error?.message,
      model: selectedModel,
    });

    //--->> RETURN SAFE APPLICATION ERROR

    throw classifyGeminiError(error);
  }

  //--->>> EXTRACT RESPONSE TEXT

  const text = response?.text?.trim();

  //---->>> EMPTY RESPONSE

  if (!text) {
    const error = new Error("Gemini returned an empty response.");

    error.statusCode = 502;
    error.code = "GEMINI_EMPTY_RESPONSE";

    throw error;
  }

  //--->>> RETURN RESPONSE

  return {
    text,
    model: selectedModel,
  };
};

export default ai;
