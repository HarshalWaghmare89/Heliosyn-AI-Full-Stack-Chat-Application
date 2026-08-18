import Chat from "../models/Chat.js";

//---->>> GET SHARED CHAT

// GET /api/shared/:shareId

export const getSharedChat = async (req, res) => {
  try {
    const { shareId } = req.params;

    //--->>>> VALIDATE SHARE ID

    if (!shareId || typeof shareId !== "string" || !shareId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Share ID is required.",
      });
    }

    //--->>>> FIND SHARED CHAT

    const chat = await Chat.findOne({
      shareId: shareId.trim(),
      isShared: true,
      isDeleted: false,
    }).select("title messages createdAt updatedAt");

    //--->>>> CHAT NOT FOUND

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Shared chat not found or sharing is disabled.",
      });
    }

    //--->>> RESPONSE

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get Shared Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shared chat.",
    });
  }
};
