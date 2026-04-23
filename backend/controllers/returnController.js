import returnService from "../services/returnService.js";

class ReturnController {
  
  // User: Request return
  async requestReturn(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.id; 
      const { reason, description, items } = req.body;
      
      console.log("Request return - orderId:", orderId);
      console.log("Request return - userId:", userId);

      const order = await returnService.requestReturn(orderId, userId, {
        reason,
        description,
        items
      });
      
      res.status(200).json({
        success: true,
        message: "Return request submitted successfully",
        order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Admin: Approve return
  async approveReturn(req, res) {
  try {
    const { orderId } = req.params;
    const adminId = req.admin?.id || req.user?.id;

    const { order, refundAmount } =
      await returnService.approveReturn(orderId, adminId);

    res.status(200).json({
      success: true,
      message: `Return approved. Refund amount: ₹${refundAmount}`,
      order,
      refundAmount
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
  // Admin: Reject return
  async rejectReturn(req, res) {
    try {
      const { orderId } = req.params;
      const { rejectionReason } = req.body;
      const adminId = req.admin?.id || req.user?.id;
      
       console.log("=== REJECT RETURN DEBUG ===");
    console.log("Order ID:", orderId);
    console.log("Rejection reason received:", rejectionReason);
    console.log("Request body:", req.body);
    console.log("===========================");
        if (!rejectionReason || rejectionReason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }
const order = await returnService.rejectReturn(orderId, adminId, rejectionReason);      
      res.status(200).json({
        success: true,
        message: "Return request rejected",
        order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Admin: Get all return requests
  async getReturnRequests(req, res) {
    try {
      const { status } = req.query;
            console.log("Fetching return requests with status:", status);

      const returns = await returnService.getReturnRequests(status);
            console.log(`Found ${returns.length} return requests`);

      res.status(200).json({
        success: true,
        data: returns
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // User: Get my returns
  async getUserReturns(req, res) {
    try {
      const userId = req.user.id;
      const returns = await returnService.getUserReturns(userId);
      
      res.status(200).json({
        success: true,
        data: returns
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new ReturnController();