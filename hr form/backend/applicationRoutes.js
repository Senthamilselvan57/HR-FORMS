const express = require("express");
const router = express.Router();

const {
  selectQulaification,
  insertData,
  selectSpecialisation,
  selectpostapplied,
  signUp,
  login,
  verifyOtp,
  resendOtp,
  sendOtp,
  checkMobileRegistered,
} = require("../controllers/appicationController");

router.route("/application/qualiList/select").get(selectQulaification);
router.route("/application/specList/select").get(selectSpecialisation);
router.route("/application/insert").post(insertData);

router.route("/application/postappliedList/select").get(selectpostapplied);
router.route("/signup").post(signUp);
router.route("/login").post(login);

router.route("/verify-otp").post(verifyOtp);

router.route("/resend-otp").post(resendOtp);
router.route("/send-otp").post(sendOtp);
router.route("/check-mobile").get(checkMobileRegistered);
module.exports = router;
