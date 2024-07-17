const asyncHandler = require("express-async-handler");
const selectFunction = require("../utils/selectFunction");
const bcrypt = require("bcrypt");
const salt = 10;
const request = require("request");
const jwt = require("jsonwebtoken");

const selectQulaification = asyncHandler(async (req, res) => {
  try {
    const result = await selectFunction.functionSelect(
      `SELECT FMSMAA_COURSE_ID AS COURSE_ID, FMSMAA_COURSE_SNAME AS COURSE_SNAME FROM FMSMAA_COURSE`,
      [],
      "TRS"
    );
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server Error");
  }
});

const selectSpecialisation = asyncHandler(async (req, res) => {
  try {
    const result = await selectFunction.functionSelect(
      `SELECT FMSMAB_SPEC_NO AS SPEC_NO, FMSMAB_SPEC_NAME AS SPEC_NAME FROM FMSMAB_SPECIALISATION`,
      [],
      "TRS"
    );
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server Error");
  }
});
const selectpostapplied = asyncHandler(async (req, res) => {
  try {
    const result = await selectFunction.functionSelect(
      `SELECT EPDMBB_DESG_LNAME AS DESG_LNAME, EPDMBB_DESG_NO AS DESG_NO FROM TRS.EPDMBB_DESIGNATION`,
      [],
      "TRS"
    );
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server Error");
  }
});

const insertData = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    const maxQuery = `
      SELECT MAX(FMSMAC_APPL_NO) AS MAX 
      FROM FMSMAC_APPLIC_DET 
      WHERE FMSMAC_APPL_NO LIKE '${currentYear}${currentMonth}%'
    `;
    const maxResult = await selectFunction.functionSelect(maxQuery, [], "TRS");

    let autoIncremented;
    if (maxResult && maxResult.length > 0 && maxResult[0].MAX !== null) {
      const lastNumber = String(maxResult[0].MAX).substring(6);
      autoIncremented = parseInt(lastNumber) + 1;
    } else {
      autoIncremented = 1;
    }

    const formattedAutoIncremented = autoIncremented
      .toString()
      .padStart(5, "0");

    const applNo = `${currentYear}${currentMonth}${formattedAutoIncremented}`;

    const insertApplicSql = `
  INSERT INTO FMSMAC_APPLIC_DET (
    FMSMAC_APPL_NO,
    FMSMAC_NAME,
    FMSMAC_DOB,
    FMSMAC_SEX,
    FMSMAC_REFERENCE,
    FMSMAC_SALARY_EXPECT,
    FMSMAC_DESG_CATG,
    FMSMAC_RECOMMEND,
    FMSMAC_MARITAL,
    FMSMAC_COMMUNITY,
    FMSMAC_PASSPORT_NO,
    FMSMAC_TOT_YR_EXP,
    FMSMAC_POST_APP,
    FMSMAC_POST_APP_2
  ) VALUES (
    :applNo,
    :name,
    TO_DATE(:dob, 'YYYY-MM-DD'),
    :sex,
    :reference,
    :salaryExpect,
    :desgCatg,
    :recommend,
    :marital,
    :community,
    :passportNo,
    :totYrExp,
    :postApp,
    :postApp2
  )`;

    const applicBind = [
      applNo,
      req.body.name,
      req.body.dob,
      req.body.sex,
      req.body.reference,
      req.body.salaryExpect,
      req.body.desgCatg,
      req.body.recommend,
      req.body.marital,
      req.body.community,
      req.body.passportNo,
      req.body.totYrExp,
      req.body.postApp,
      req.body.postApp2,
    ];

    await selectFunction.functionInsert_Update(
      insertApplicSql,
      applicBind,
      "TRS"
    );

    const insertAddressSql = `
      INSERT INTO FMSMAD_ADDRESS (
        FMSMAD_APPL_NO,
        FMSMAD_ADDRESS_TYPE,
        FMSMAD_ADDRESS,
        FMSMAD_AREA,
        FMSMAD_CITY,
        FMSMAD_STATE,
        FMSMAD_PINCODE,
        FMSMAD_MOBILE,
        FMSMAD_EMAIL
      ) VALUES (
        :applNo,
        :addressType,
        :address,
        :area,
        :city,
        :state,
        :pincode,
        :mobile,
        :email
      )`;

    const addressBind = [
      applNo,
      req.body.addressType,
      req.body.address,
      req.body.area,
      req.body.city,
      req.body.state,
      req.body.pincode,
      req.body.mobile,
      req.body.email,
    ];

    await selectFunction.functionInsert_Update(
      insertAddressSql,
      addressBind,
      "TRS"
    );

    const insertExperienceSql = `
      INSERT INTO FMSMAE_EXPERIENCE (
        FMSMAE_APPL_NO,
        FMSMAE_ORGN_NAME,
        FMSMAE_FROM_DT,
        FMSMAE_TO_DT,
        FMSMAE_POST_HELD,
        FMSMAE_NATURE_DUTY,
        FMSMAE_NO_YEAR
      ) VALUES (
        :applNo,
        :orgName,
        TO_DATE(:fromDt, 'YYYY-MM-DD'),
        TO_DATE(:toDt, 'YYYY-MM-DD'),
        :postHeld,
        :natureDuty,
        :noYear
      )`;

    const experienceData = req.body.experienceData;
    console.log(experienceData);

    if (
      experienceData &&
      Array.isArray(experienceData) &&
      experienceData.length > 0
    ) {
      const experienceBinds = experienceData.map((experience) => ({
        applNo: applNo,
        orgName: experience.orgName,
        fromDt: experience.fromDt,
        toDt: experience.toDt,
        postHeld: experience.postHeld,
        natureDuty: experience.natureDuty,
        noYear: experience.noYear,
      }));

      await selectFunction.functionInsert_Update_Multiple(
        insertExperienceSql,
        experienceBinds,
        "TRS"
      );
      console.log("Experience data inserted successfully.");
    } else {
      console.log("No experience data provided or invalid format.");
    }

    // const insertResearchSql = `
    //   INSERT INTO FMSMAG_RESEARCH_DET (
    //     FMSMAG_APPL_NO,
    //     FMSMAG_RESEARCH_DONE,
    //     FMSMAG_RESEARCH_PROGRESS,
    //     FMSMAG_PUBLISHED_WORK
    //   ) VALUES (
    //     :applNo,
    //     :researchDone,
    //     :researchProgress,
    //     :publishedWork
    //   )`;

    // const researchBind = [
    //   applNo,
    //   req.body.researchDone,
    //   req.body.researchProgress,
    //   req.body.publishedWork,
    // ];

    // await selectFunction.functionInsert_Update(
    //   insertResearchSql,
    //   researchBind,
    //   "TRS"
    // );
    const insertEducationSql = `
    INSERT INTO FMSTAE_EDUCT_DET (
      FMSTAE_APPL_NO,
      FMSTAE_QUALIF,
      FMSTAE_SPEC,
      FMSTAE_CLASS_OBTAIN,
      FMSTAE_COMPL_YEAR,
      FASTAE_INSTITUTION,
      FASTAE_STUDY_MODE,
      FMSTAE_REG_NO
    ) VALUES (
      :applNo,
      :qualif,
      :spec,
      :classObtain,
      TO_DATE(:complYear, 'YYYY-MM-DD'),
      :institution,
      :studyMode,
      :regNumber
    )`;

    const educationData = req.body.educationData;

    if (
      educationData &&
      Array.isArray(educationData) &&
      educationData.length > 0
    ) {
      const educationBinds = educationData.map((education) => ({
        applNo: applNo,
        qualif: education.qualif,
        spec: education.spec,
        classObtain: education.classObtain,
        complYear: education.complYear,
        institution: education.institution,
        studyMode: education.studyMode,
        regNumber: education.regNumber,
      }));

      await selectFunction.functionInsert_Update_Multiple(
        insertEducationSql,
        educationBinds,
        "TRS"
      );
      console.log("Education data inserted successfully.");
    } else {
      console.log("No education data provided or invalid format.");
    }

    res.status(200).json({ message: "Data inserted successfully." });
  } catch (error) {
    console.error("Error executing the query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = asyncHandler(async (req, res) => {
  try {
    const { mobile } = req.body;

    const trimmedMobile = mobile.trim();

    if (!trimmedMobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    // Check if mobile number already exists in database
    const checkMobileSql = `
      SELECT COUNT(*) AS mobileCount 
      FROM FMSMAC_APPLIC_LOGIN_DET 
      WHERE mobile = :mobile`;

    const mobileResult = await selectFunction.functionSelect(
      checkMobileSql,
      { mobile: trimmedMobile },
      "TRS"
    );

    if (mobileResult[0].mobileCount > 0) {
      return res
        .status(400)
        .json({ error: "Mobile number already registered" });
    }

    // Query your database to check if the mobile number is already verified
    const isMobileVerified = await selectFunction.functionSelect(
      `SELECT * FROM FMSMAC_MOBILE_OTP WHERE mobile = :mobile`,
      { mobile: { val: trimmedMobile } },
      "TRS"
    );

    if (
      isMobileVerified &&
      isMobileVerified.length > 0 &&
      isMobileVerified[0].verified
    ) {
      // If mobile number is already verified, return success
      return res
        .status(200)
        .json({ message: "Mobile number already verified" });
    }

    // Generate OTP
    const otp = generateOtp();

    // Insert OTP into database
    const insertOtpSql = `
      INSERT INTO FMSMAC_MOBILE_OTP (mobile, otp, created_at)
      VALUES (:mobile, :otp, CURRENT_TIMESTAMP)`;
    const otpBind = {
      mobile: { val: trimmedMobile },
      otp: { val: otp },
    };

    await selectFunction.functionInsert_Update(insertOtpSql, otpBind, "TRS");

    // Send OTP via SMS
    const smsUrl = `http://cloudsms.inwayhosting.com/ApiSmsHttp?UserId=sms@psgimsr.ac.in&pwd=Psg@123&Message=Your+One+Time+Password+for+PSG+Hospitals+is+${otp}.+Do+not+share+OTP+with+anyone.&Contacts=${trimmedMobile}&SenderId=PSGAPP&ServiceName=SMSTRANS&MessageType=1`;

    request(smsUrl, (error, response, body) => {
      if (error) {
        console.error("Error sending SMS:", error);
        return res.status(500).json({ error: "Error sending OTP via SMS" });
      }
      console.log("SMS sent successfully:", body);
    });

    return res.status(200).json({ otp });
  } catch (error) {
    console.error("Error during OTP send:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const signUp = asyncHandler(async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const checkEmailSql = `
      SELECT COUNT(*) AS emailCount 
      FROM FMSMAC_APPLIC_LOGIN_DET 
      WHERE email = :email`;

    const emailResult = await selectFunction.functionSelect(
      checkEmailSql,
      { email },
      "TRS"
    );

    if (emailResult[0].emailCount > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Check if mobile already exists
    const checkMobileSql = `
      SELECT COUNT(*) AS mobileCount 
      FROM FMSMAC_APPLIC_LOGIN_DET 
      WHERE mobile = :mobile`;

    const mobileResult = await selectFunction.functionSelect(
      checkMobileSql,
      { mobile },
      "TRS"
    );

    if (mobileResult[0].mobileCount > 0) {
      return res.status(400).json({ error: "Mobile number already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertLoginSql = `
      INSERT INTO FMSMAC_APPLIC_LOGIN_DET (
        name,
        email,
        mobile,
        password
      ) VALUES (
        :name,
        :email,
        :mobile,
        :password
      )`;

    const loginBind = { name, email, mobile, password: hashedPassword };

    await selectFunction.functionInsert_Update(
      insertLoginSql,
      loginBind,
      "TRS"
    );

    return res.status(200).json({
      message: "User signed up successfully.",
    });
  } catch (error) {
    console.error("Error executing the signup query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    console.log("Received mobile:", mobile);
    console.log("Received OTP:", otp);

    if (!mobile || !otp) {
      return res
        .status(400)
        .json({ error: "Mobile number and OTP are required" });
    }

    // Check if the mobile number is already registered
    const mobileRegisteredSql = `
      SELECT COUNT(*) AS mobileCount 
      FROM FMSMAC_APPLIC_LOGIN_DET 
      WHERE mobile = :mobile`;

    const mobileResult = await selectFunction.functionSelect(
      mobileRegisteredSql,
      { mobile },
      "TRS"
    );

    if (mobileResult[0].mobileCount > 0) {
      return res
        .status(400)
        .json({ error: "Mobile number is already registered" });
    }

    const selectOtpSql = `SELECT OTP, JWT_TOKEN FROM FMSMAC_MOBILE_OTP WHERE mobile = :mobile`;
    console.log(
      "Executing SQL query to fetch OTP and JWT token for mobile:",
      mobile
    );

    const otpResult = await selectFunction.functionSelect(
      selectOtpSql,
      { mobile },
      "TRS"
    );
    console.log("OTP result from database:", otpResult);

    if (otpResult.length > 0 && otpResult[0].OTP) {
      const storedOtp = otpResult[0].OTP.toString();
      const receivedOtp = otp.toString();

      console.log(`Stored OTP: ${storedOtp}, Received OTP: ${receivedOtp}`);
      if (storedOtp === receivedOtp) {
        // Check if a JWT token already exists
        const existingToken = otpResult[0].JWT_TOKEN;

        if (existingToken) {
          // If a JWT token already exists, return it
          console.log("JWT token already exists for mobile:", mobile);
          return res.json({
            status: "OTP verified successfully",
            token: existingToken,
          });
        } else {
          // Generate a new JWT token
          const token = jwt.sign({ mobile }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          // Update OTP row with the new JWT token
          const updateTokenSql = `
            UPDATE FMSMAC_MOBILE_OTP
            SET JWT_TOKEN = :token
            WHERE MOBILE = :mobile`;

          await selectFunction.functionInsert_Update(
            updateTokenSql,
            { token, mobile },
            "TRS"
          );

          return res.json({ status: "OTP verified successfully", token });
        }
      } else {
        console.log("Invalid OTP: OTPs do not match");
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } else {
      console.log("Invalid OTP: No matching record found in the database");
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const checkMobileRegistered = asyncHandler(async (req, res) => {
  const mobile = req.query.mobile;

  // Check if mobile number is provided
  if (!mobile) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  try {
    // SQL query to check if the mobile number is registered
    const query = `SELECT COUNT(*) AS count FROM FMSMAC_MOBILE_OTP WHERE mobile = :mobile`;
    const result = await selectFunction.functionSelect(
      query,
      { mobile },
      "TRS"
    );

    // Check if the count of mobile numbers is greater than 0
    if (result[0].count > 0) {
      // Mobile number is already registered
      res.json({ isRegistered: true });
    } else {
      // Mobile number is not registered
      res.json({ isRegistered: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  try {
    const { mobile } = req.body;

    const trimmedMobile = mobile.trim();

    if (!trimmedMobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const newOtp = generateOtp();

    const updateOtpSql = `
      UPDATE FMSMAC_MOBILE_OTP
      SET otp = :otp, created_at = CURRENT_TIMESTAMP
      WHERE mobile = :mobile`;

    const updateBind = { otp: newOtp, mobile: trimmedMobile };

    await selectFunction.functionInsert_Update(updateOtpSql, updateBind, "TRS");

    const smsUrl = `http://cloudsms.inwayhosting.com/ApiSmsHttp?UserId=sms@psgimsr.ac.in&pwd=Psg@123&Message=Your+One+Time+Password+for+PSG+Hospitals+is+${newOtp}.+Do+not+share+OTP+with+anyone.&Contacts=${trimmedMobile}&SenderId=PSGAPP&ServiceName=SMSTRANS&MessageType=1`;

    request(smsUrl, (error, response, body) => {
      if (error) {
        console.error("Error sending SMS:", error);
        return res.status(500).json({ error: "Error sending OTP via SMS" });
      }
      console.log("SMS sent successfully:", body);
    });

    return res.status(200).json({ message: "New OTP sent to mobile number." });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const selectLoginSql = `
      SELECT email, password FROM FMSMAC_APPLIC_LOGIN_DET 
      WHERE email = :email`;

    const userData = await selectFunction.functionSelect(
      selectLoginSql,
      { email },
      "TRS"
    );

    if (userData.length > 0) {
      const hashedPasswordFromDB = userData[0].PASSWORD;

      bcrypt.compare(
        password.toString(),
        hashedPasswordFromDB,
        (err, response) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).json({ error: "Error comparing passwords" });
          }

          if (response) {
            console.log("Passwords match");
            return res.json({ status: "Success" });
          } else {
            console.log("Passwords do not match");
            return res.json({ error: "Password incorrect" });
          }
        }
      );
    } else {
      return res.status(404).json({ error: "No such email exists" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  selectQulaification,
  selectSpecialisation,
  selectpostapplied,
  insertData,
  signUp,
  login,
  verifyOtp,
  resendOtp,
  sendOtp,
  checkMobileRegistered,
};
