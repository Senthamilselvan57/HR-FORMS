import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import SignatureCanvas from "react-signature-canvas";
import "./HOME.css";
import axios from "axios";
import MyVerticallyCenteredModal from "../CELEBRATION/MyVerticallyCenteredModal";
import { ALL_CONTEXT } from "../../context/ALL_CONTEXT";
import Spinner from "react-bootstrap/Spinner";
import { Select } from "antd";
import { Successpage } from "./Suceespage";

function HOME() {
  const [modalShow, setModalShow] = React.useState(false);
  const [rows, setRows] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  console.log(rows);
  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleAddRowexperience = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setForms((prevState) => ({
      ...prevState,
      experienceData: [
        ...prevState.experienceData,
        {
          orgName: "",
          noYear: "",
          fromDt: "",
          toDt: "",
          postHeld: "",
          natureDuty: "",
        },
      ],
    }));
  };

  const handleAddRoweducation = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setForms((prevState) => ({
      ...prevState,
      educationData: [
        ...prevState.educationData,
        {
          qualif: "",
          spec: "",
          classObtain: "",
          complYear: "",
          institution: "",
          studyMode: "",
          regNumber: "",
        },
      ],
    }));
  };
  // Assuming you have a state update function named setForms

  const handleRemoveexperience = (indexToRemove) => {
    if (indexToRemove !== 0) {
      // Check if it's not the first card
      setForms((prevForms) => ({
        ...prevForms,
        experienceData: prevForms.experienceData.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
  };
  const handleRemoveeducation = (indexToRemove) => {
    setForms((prevForms) => ({
      ...prevForms,
      educationData: prevForms.educationData.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const plus = (
    <svg
      width="30"
      height="30"
      fill="none"
      stroke="#0275d8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 12c0-4.969-4.031-9-9-9s-9 4.031-9 9 4.031 9 9 9 9-4.031 9-9Z"></path>
      <path d="M12 8.25v7.5"></path>
      <path d="M15.75 12h-7.5"></path>
    </svg>
  );
  const wrong = (
    <svg
      width="30"
      height="30"
      fill="none"
      stroke="#a7011a"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
  const [forms, setForms] = useState({
    name: "",
    dob: "",
    // age: "",
    postApp: "",
    postApp2: "",
    sex: "",
    reference: "",
    //regNo: "",
    salaryExpect: "",
    //applStatus: "",
    desgCatg: "",
    // recommend: "",
    //marital: "",
    community: "",
    passportNo: "",
    totYrExp: "",
    addressType: "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    email: "",
    // researchDone: "",
    // researchProgress: "",
    // publishedWork: "",
    experienceData: [
      {
        orgName: "",
        fromDt: "",
        toDt: "",
        postHeld: "",
        natureDuty: "",
        noYear: "",
      },
    ],
    educationData: [
      {
        qualif: "",
        spec: "",
        classObtain: "",
        complYear: "",
        institution: "",
        studyMode: "",
        regNumber: "",
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setlist] = useState("");
  const [speclist, setSpecList] = useState("");
  const [postlist, setpostlist] = useState("");

  const setField = (field, value, index = -1) => {
    // Check if value is a string before calling toUpperCase()
    if (typeof value === "string") {
      value = value.toUpperCase();
    } else {
      console.error("Value is not a string:", value);
      // Handle this case accordingly based on your requirements
    }

    const maxLengths = {
      qualif: 100,
      spec: 100,
      classObtain: 15,
      complYear: 10,
      institution: 100,
      studyMode: 10,
      regNumber: 15,
      noYear: 2,
      mobile: 10,
      pincode: 6,
    };

    if (field in maxLengths && value.length > maxLengths[field]) {
      setErrors({
        ...errors,
        [field]: `Maximum ${maxLengths[field]} characters allowed for ${field}`,
      });
      return;
    }
    if (field === "mobile") {
      if (!value || value === "") {
        setErrors({
          ...errors,
          [field]: "Please enter a mobile number",
        });
      } else if (value.length !== 10) {
        setErrors({
          ...errors,
          [field]: "Mobile number must be 10 digits long",
        });
      } else {
        // If the length is valid, clear any previous error for the mobile number field
        setErrors({
          ...errors,
          [field]: null,
        });
      }
    }
    if (field === "pincode") {
      if (!value || value === "") {
        setErrors({
          ...errors,
          [field]: "Please enter a pincode",
        });
      } else if (value.length !== 6) {
        setErrors({
          ...errors,
          [field]: "Please enter a valid pincode",
        });
      } else {
        setErrors({
          ...errors,
          [field]: null,
        });
      }
    }

    if (field === "dob") {
      const today = new Date();
      const dob = new Date(value);
      if (dob > today) {
        setForms({ ...forms, [field]: "" });
      } else {
        const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
        if (age === 0) {
          setForms({ ...forms, [field]: value, age: "0" });
        } else {
          setForms({ ...forms, [field]: value, age });
        }
      }
    } else if (field === "age") {
      if (value.length <= 3) {
        setForms({ ...forms, [field]: value });
      }
    } else if (field === "email") {
      setForms({ ...forms, [field]: value });
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (value.match(validRegex)) {
        document.querySelector(".email_val").style.color = "green";
        return true;
      } else {
        document.querySelector(".email_val").style.color = "red";
        return false;
      }
    } else if (field === "Role" || field === "martial") {
      if (value.length <= 6) {
        setForms({ ...forms, [field]: value });
      }
    } else {
      setForms({ ...forms, [field]: value });
    }

    // Update the experienceData if applicable
    if (
      forms &&
      forms.experienceData &&
      index >= 0 &&
      index < forms.experienceData.length
    ) {
      setForms((prevForms) => {
        const updatedExperienceData = [...prevForms.experienceData];
        const updatedItem = { ...updatedExperienceData[index], [field]: value };
        updatedExperienceData[index] = updatedItem;
        return { ...prevForms, experienceData: updatedExperienceData };
      });
    } else {
      console.error(
        `Invalid index or forms state: index=${index}, forms=${forms}`
      );
    }
    if (
      forms &&
      forms.educationData &&
      index >= 0 &&
      index < forms.educationData.length
    ) {
      setForms((prevForms) => {
        const updatedEducationData = [...prevForms.educationData];
        const updatedItem = { ...updatedEducationData[index], [field]: value };
        updatedEducationData[index] = updatedItem;
        return { ...prevForms, educationData: updatedEducationData };
      });
    } else {
      console.error(
        `Invalid index or forms state: index=${index}, forms=${forms}`
      );
    }

    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const {
      name,
      dob,
      age,
      sex,
      Role,
      email,
      marital,
      postApp,
      doorno,
      area,
      city,
      state,
      pincode,
      // researchDone,
      // researchProgress,
      // publishedWork,
      experienceData,
      educationData,
      mobile,
      address,
      addressType,
    } = forms;

    const newErrors = {};

    if (!name || name === "") {
      newErrors.name = "Please Enter Name";
    }
    if (!dob || dob === "") newErrors.dob = "Please Enter DOB";
    if (!age || age === "") newErrors.age = "Please Enter Age";
    if (!postApp || postApp === "")
      newErrors.postApp = "Please Enter Post Applied";
    if (!address || address === "") newErrors.address = "Please Enter Address";
    if (!addressType || addressType === "")
      newErrors.addressType = "please enter address";

    if (!doorno || doorno === "")
      newErrors.doorno = "please enter DoorNo/Street Name";
    if (!email || email === "") newErrors.email = "Please Enter Email";
    if (!city || city === "") newErrors.city = "Please Enter City";
    if (!state || state === "") newErrors.state = "Please Enter  State";

    if (!sex || sex === "") newErrors.sex = "please enter  Gender";
    if (!mobile || mobile === "") {
      newErrors.mobile = "Please Enter Mobile Number";
    } else if (mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits long";
    }

    if (!marital || marital === "")
      newErrors.marital = "please enter Mobile pin";

    if (!area || area === "") newErrors.area = "Please Enter Area";

    if (!Role || Role === "") newErrors.Role = "please enter Role";
    // if (!reference || reference === "") {
    //   newErrors.reference = "Please enter a reference";
    //   if (!recommend || recommend === "") {
    //     newErrors.recommend = "Please enter a recommend";

    // if (!researchDone || researchDone === "")
    //   newErrors.researchDone = "please enter research done ";
    // if (!researchProgress || researchProgress === "")
    //   newErrors.researchProgress = "please enter research process ";
    // if (!publishedWork || publishedWork === "")
    //   newErrors.publishedWork = "please enter publish work  ";

    if (!pincode || pincode === "") {
      newErrors.pincode = "Please Enter Pincode";
    } else if (pincode.length !== 6) {
      newErrors.pincode = "Please enter a valid pincode";
    }

    if (!experienceData || experienceData.length === 0) {
      newErrors.experienceData = "Please provide experience data";
    } else {
      experienceData.forEach((experience, index) => {
        const { orgName, fromDt, toDt, postHeld, natureDuty, noYear } =
          experience;

        if (!orgName || orgName === "")
          newErrors[`experienceData[${index}].orgName`] =
            "Please enter organization name";
        if (!fromDt || fromDt === "")
          newErrors[`experienceData[${index}].fromDt`] =
            "Please enter start date";
        if (!toDt || toDt === "")
          newErrors[`experienceData[${index}].toDt`] = "Please enter end date";
        if (!postHeld || postHeld === "")
          newErrors[`experienceData[${index}].postHeld`] =
            "Please enter post held";
        if (!natureDuty || natureDuty === "")
          newErrors[`experienceData[${index}].natureDuty`] =
            "Please enter nature of duty";
        if (!noYear || noYear === "")
          newErrors[`experienceData[${index}].noYear`] =
            "Please enter number of years";
      });
    }

    if (!educationData || educationData.length === 0) {
      newErrors.educationData = "Please provide education data";
    } else {
      educationData.forEach((education, index) => {
        const {
          qualif,
          spec,
          classObtain,
          complYear,
          institution,
          studyMode,
          regNumber,
        } = education;

        if (!qualif || qualif === "")
          newErrors[`educationData[${index}].qualif`] =
            "Please enter qualification";
        if (!spec || spec === "")
          newErrors[`educationData[${index}].spec`] =
            "Please enter specialization";
        if (!classObtain || classObtain === "")
          newErrors[`educationData[${index}].classObtain`] =
            "Please enter class obtained";
        if (!complYear || complYear === "")
          newErrors[`educationData[${index}].complYear`] =
            "Please enter completion year";
        if (!institution || institution === "")
          newErrors[`educationData[${index}].institution`] =
            "Please enter institution";
        if (!studyMode || studyMode === "")
          newErrors[`educationData[${index}].studyMode`] =
            "Please enter study mode";
        if (!regNumber || regNumber === "")
          newErrors[`educationData[${index}].regNumber`] =
            "Please enter registration number";

        if (classObtain && classObtain.length !== 15)
          newErrors[`educationData[${index}].classObtain`] =
            "Please enter a valid class obtained";
      });
    }

    return newErrors;
  };
  const pick = (obj, keys) =>
    keys.reduce((acc, key) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(forms);
      const formErrors = validateForm(); // Assuming you have this function

      // Check for errors related to important fields
      const importantFieldErrors = pick(formErrors, [
        "name",
        "dob",
        "age",
        "sex",
        "email",
        "mobile",
        "pincode",
        "Role",
        "marital",
        "area",
        "address",
        "addressType",
        "city",
        "state",
        "postApp",
      ]);
      const hasImportantFieldErrors = Object.values(importantFieldErrors).some(
        (error) => !!error
      );

      if (hasImportantFieldErrors) {
        setErrors(importantFieldErrors);
        setLoading(false);
        console.log("Please fill in all the required fields.");
        return;
      }

      if (forms.passportNo) {
        const passportRegex = /^[A-Za-z]{1,2}\d{6,9}$/; // Adjust as needed
        if (!passportRegex.test(forms.passportNo)) {
          setErrors({
            ...errors,
            passportNo: "Please enter a valid passport number",
          });
          setLoading(false);

          document.getElementById("passportNoInput").focus();
          return;
        }
      }

      console.log("dfdagdasg");
      const response = await axios.post(
        "http://192.168.90.128:5001/api/application/insert",
        {
          ...forms,
          experienceData: forms.experienceData,
          educationData: forms.educationData,
        }
      );

      console.log(response);
      setData(response.data.message);
      setErrors({});

      setSuccessOpen(true);
      setLoading(false);

      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Error status:", error.response.status);
          setData(error.response.data);
        } else if (error.request) {
          console.log("Error request:", error.request);
        } else {
          console.log("Error message:", error.message);
        }
      } else {
        console.log("Error:", error);
      }
      setLoading(false); // Move this line here
    }
  };

  console.log(errors);
  useEffect(() => {
    if (data !== "") {
      setForms((prevState) => ({
        ...prevState,
        name: "",
        dob: "",
        // age: "",
        postApp: "",
        postApp2: "",
        sex: "",
        reference: "",
        //regNo: "",
        salaryExpect: "",
        //applStatus: "",
        desgCatg: "",
        // recommend: "",
        marital: "",
        community: "",
        passportNo: "",
        totYrExp: "",
        addressType: "",
        address: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        mobile: "",
        email: "",
        // researchDone: "",
        // researchProgress: "",
        // publishedWork: "",
        experience: [
          {
            orgName: "",
            fromDt: "",
            toDt: "",
            postHeld: "",
            natureDuty: "",
            noYear: "",
          },
        ],
        education: [
          {
            qualif: "",
            spec: "",
            classObtain: "",
            complYear: "",
            institution: "",
            studyMode: "",
            regNumber: "",
          },
        ],
      }));

      setErrors({});
      console.log(data);
      document.querySelector(".email_val").style.color = "black";
    }
  }, [data]);

  const handleReset = (e) => {
    e.preventDefault();
    window.location.reload(false);
  };
  useEffect(() => {
    QualList();
  }, []);
  const QualList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.90.128:5001/api/application/qualiList/select"
      );
      if (response.data) {
        const transformedRows = response.data.map((row) => {
          return {
            value: row.COURSE_ID,
            label: row.COURSE_SNAME,
          };
        });
        // console.log(transformedRows);
        setlist(transformedRows);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.message);
      } else {
        console.log("Error:", error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    SpecList();
  }, []);
  const SpecList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.90.128:5001/api/application/specList/select"
      );
      if (response.data) {
        const transformedRows = response.data.map((row) => {
          return {
            value: row.SPEC_NO,
            label: row.SPEC_NAME,
          };
        });
        // console.log(transformedRows);
        setSpecList(transformedRows);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.message);
      } else {
        console.log("Error:", error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    PostList();
  }, []);
  const PostList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.90.128:5001/api/application/postappliedList/select"
      );
      if (response) {
        const transformedRows = response.data.map((row) => {
          return {
            value: row.DESG_NO,
            label: row.DESG_LNAME,
          };
        });
        console.log(transformedRows);
        setpostlist(transformedRows);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.message);
      } else {
        console.log("Error:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Container fluid="md">
        <br />
        {loading ? (
          <div className="mrd_loading">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <div>
            <ALL_CONTEXT.Provider value={{ data, setData }}>
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </ALL_CONTEXT.Provider>
            <Form onSubmit={handleSubmit} onReset={handleReset}>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="4"
                  md="12"
                  xs="12"
                  className="F_group_common"
                >
                  <Form.Label>
                    Name <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    maxLength="50"
                    value={forms.name}
                    onChange={(e) => {
                      const upperCaseName = e.target.value.toUpperCase(); // Convert input to uppercase
                      setForms({ ...forms, name: upperCaseName });
                      console.log("Name typed:", upperCaseName);
                      // Clear error when the user types something
                      if (errors.name) {
                        setErrors({ ...errors, name: null });
                      }
                    }}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  lg="3"
                  md="6"
                  xs="12"
                  className="F_group_common"
                >
                  <Form.Label>
                    Date of Birth <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Date"
                    pattern="\d{2}-\d{2}-\d{4}"
                    placeholder="DD-MM-YYYY"
                    value={forms.dob}
                    onChange={(e) => setField("dob", e.target.value)}
                    maxLength="10"
                    isInvalid={!!errors.dob}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.dob}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                {/* Gender Form Group */}
                <Form.Group
                  as={Col}
                  xs={10}
                  sm={4}
                  className="F_group_common px-2"
                >
                  <Form.Label>
                    Gender <span className="mrd_star">*</span>
                  </Form.Label>
                  {["radio"].map((type) => (
                    <div key={`Gender-${type}`} className="mb-3">
                      <Form.Check
                        inline
                        label="Male"
                        name="Gender"
                        type={type}
                        id={`Gender-${type}-1`}
                        value={forms.sex}
                        onChange={(e) => setField("sex", "M")}
                        checked={forms.sex === "M"}
                        isInvalid={!!errors.sex}
                      />
                      <Form.Check
                        inline
                        label="Female"
                        name="Gender"
                        type={type}
                        id={`Gender-${type}-2`}
                        value={forms.sex}
                        onChange={(e) => setField("sex", "F")}
                        checked={forms.sex === "F"}
                        isInvalid={!!errors.sex}
                      />
                      <Form.Check
                        inline
                        label="Others"
                        name="Gender"
                        type={type}
                        id={`Gender-${type}-3`}
                        value={forms.sex}
                        onChange={(e) => setField("sex", "O")}
                        checked={forms.sex === "O"}
                        isInvalid={!!errors.sex}
                      />
                    </div>
                  ))}
                </Form.Group>

                {/* Role Form Group */}
                <Form.Group
                  as={Col}
                  xs={12}
                  sm={4}
                  className="F_group_common px-2"
                >
                  <Form.Label>
                    Role <span className="mrd_star">*</span>
                  </Form.Label>
                  {["radio"].map((type) => (
                    <div key={`Role-${type}`} className="mb-3">
                      <Form.Check
                        inline
                        label="Teaching"
                        name="Role"
                        type={type}
                        id={`Role-${type}-1`}
                        value={forms.Role}
                        onChange={(e) => setField("Role", "T")}
                        checked={forms.Role === "T"}
                        isInvalid={!!errors.Role}
                      />
                      <Form.Check
                        inline
                        label="Non-Teaching"
                        name="Role"
                        type={type}
                        id={`Role-${type}-2`}
                        value={forms.Role}
                        onChange={(e) => setField("Role", "NT")}
                        checked={forms.Role === "NT"}
                        isInvalid={!!errors.Role}
                      />
                    </div>
                  ))}
                </Form.Group>
              </Row>
              <Row className="mb-3">
                {/* Married Status Form Group */}
                <Form.Group
                  as={Col}
                  xs={12}
                  sm={4}
                  className="F_group_common px-2"
                >
                  <Form.Label>
                    Married Status <span className="mrd_star">*</span>
                  </Form.Label>
                  {["radio"].map((type) => (
                    <div key={`marital-${type}`} className="mb-3">
                      <Form.Check
                        inline
                        label="Married"
                        name="marital"
                        type={type}
                        id={`martial-${type}-1`}
                        value={forms.marital}
                        onChange={(e) => setField("marital", "M")}
                        isInvalid={!!errors.marital}
                        checked={forms.marital === "M"}
                        className="form-check-label"
                      />
                      <Form.Check
                        inline
                        label="Unmarried"
                        name="marital"
                        type={type}
                        id={`martial-${type}-2`}
                        value={forms.marital}
                        onChange={(e) => setField("marital", "U")}
                        isInvalid={!!errors.marital}
                        checked={forms.marital === "U"}
                        className="form-check-label"
                      />
                    </div>
                  ))}
                </Form.Group>

                {/* Passport Number Form Group */}
                <Form.Group as={Col} lg={4} xs={12} md={6}>
                  <Form.Label>Passport Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Passport Number"
                    value={forms.passportNo}
                    onChange={(e) => setField("passportNo", e.target.value)}
                    isInvalid={forms.passportNo && !!errors.passportNo}
                  />
                  {forms.passportNo && (
                    <Form.Control.Feedback type="invalid">
                      {errors.passportNo
                        ? "Please enter a valid passport number"
                        : null}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="4"
                  xs="12"
                  md="5"
                  className="F_group_common"
                >
                  <Form.Label>Community</Form.Label>
                  <Form.Control
                    as="select"
                    value={forms.community}
                    onChange={(e) => setField("community", e.target.value)}
                    isInvalid={!!errors.community}
                  >
                    <option value="">Select Community</option>
                    <option value="BC">BC</option>
                    <option value="MBC">MBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="O">Others</option>
                  </Form.Control>
                  {/* Render input field for typing "Other" if selected */}
                  {forms.community === "Other" && (
                    <Form.Control
                      type="text"
                      placeholder="Enter Community"
                      value={forms.community}
                      onChange={(e) => setField("community", e.target.value)}
                      isInvalid={!!errors.community}
                    />
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.community || errors.otherCommunity}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Salary Expected Form Group */}
                <Col
                  lg={4}
                  xs={12}
                  md={6}
                  className="d-flex align-items-stretch"
                >
                  <Form.Group className="w-100">
                    <Form.Label>Salary Expected</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Salary Expected"
                      value={forms.salaryExpect}
                      onChange={(e) => {
                        let input = e.target.value;
                        const numbersOnly = input.replace(/\D/g, "");
                        const truncatedInput = numbersOnly.slice(0, 14);
                        setField("salaryExpect", truncatedInput);
                      }}
                      isInvalid={!!errors.salaryExpect}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                {/* Total Years of Experience Form Group */}
                <Col
                  lg={4}
                  xs={12}
                  md={6}
                  className="d-flex align-items-stretch"
                >
                  <Form.Group className="w-100">
                    <Form.Label>Total Years of Experience</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Total Years of Experience"
                      value={forms.totYrExp}
                      onChange={(e) => {
                        let input = e.target.value;
                        // Remove non-numeric characters
                        input = input.replace(/\D/g, "");
                        // Limit input to 5 characters
                        input = input.slice(0, 5);
                        setField("totYrExp", input);
                      }}
                      isInvalid={!!errors.totYrExp}
                    />
                  </Form.Group>
                </Col>

                {/* Reference / Recommendation Form Group */}
                <Col
                  lg={4}
                  xs={12}
                  md={6}
                  className="d-flex align-items-stretch"
                >
                  <Form.Group className="w-100">
                    <Form.Label>Reference / Recommendation</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Reference/Recommendation"
                      value={forms.reference}
                      onChange={(e) => setField("reference", e.target.value)}
                      isInvalid={!!errors.reference}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.reference}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <br></br>
              <Row className="mb-3">
                {/* First Form Group */}
                <Col md={{ span: 4, offset: 0 }}>
                  <Form.Group className="w-100">
                    <Form.Label>
                      Post Applied <span className="mrd_star">*</span>
                    </Form.Label>
                    <Select
                      showSearch
                      className="w-100"
                      style={{ height: "38px" }}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Post Applied",
                        },
                      ]}
                      label="Postapplied"
                      onChange={(value) => {
                        const selectedData = postlist.find(
                          (place) => place.value === value
                        );
                        if (selectedData) {
                          setForms((prevState) => ({
                            ...prevState,
                            postApp: selectedData.value,
                          }));
                          setErrors((prevState) => ({
                            ...prevState,
                            postApp: null,
                          }));
                        }
                      }}
                      tokenSeparators={[","]}
                      options={postlist}
                      placeholder={
                        <span style={{ color: "#808080" }}>
                          Select Post Applied
                        </span>
                      }
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={forms.postApp || undefined}
                      isInvalid={!!errors.postApp}
                    />
                    {errors.postApp && (
                      <div className="error-message">{errors.postApp}</div>
                    )}
                  </Form.Group>
                </Col>

                {/* Second Form Group */}
                <Col md={{ span: 4, offset: 0 }}>
                  <Form.Group className="w-100">
                    <Form.Label>Post Applied 1</Form.Label>
                    <Select
                      showSearch
                      className="w-100"
                      style={{ height: "38px" }}
                      rules={[
                        { required: true, message: "Please select From Place" },
                        // Add other validation rules as needed
                      ]}
                      label="postapplied"
                      onChange={(value) => {
                        const selectedData = postlist.find(
                          (place) => place.value === value
                        );
                        if (selectedData) {
                          setForms((prevState) => ({
                            ...prevState,
                            postApp2: selectedData.value,
                          }));
                        }
                      }}
                      tokenSeparators={[","]}
                      options={postlist}
                      placeholder={
                        <span style={{ color: "#808080" }}>
                          Select Post Applied 2
                        </span>
                      }
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={forms.postApp2 || undefined}
                    />
                    {errors.postApp2 && (
                      <div className="error-message">{errors.postApp2}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <br></br>
              <Row className="mb-3">
                <h2>ADDRESS</h2>
                <hr />
                <Form.Group
                  className="mb-3 F_group_common"
                  as={Col}
                  xs="12"
                  md="9"
                  lg="4"
                  maxLength="50"
                >
                  <Form.Label>
                    Door No / Street Name <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Door No / Street Name"
                    maxLength="50"
                    value={forms.address}
                    onChange={(e) => setField("address", e.target.value)}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3 F_group_common"
                  xs="12"
                  md="12"
                  lg="4"
                  as={Col}
                >
                  <Form.Label>
                    Area Name <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Area Name"
                    value={forms.area}
                    maxLength="99"
                    onChange={(e) => setField("area", e.target.value)}
                    isInvalid={!!errors.area}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.area}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="4"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>
                    City <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City"
                    maxLength="50"
                    value={forms.city}
                    onChange={(e) => setField("city", e.target.value)}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (charCode >= 48 && charCode <= 57) {
                        // Prevent input if charCode is a number
                        e.preventDefault();
                      }
                    }}
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  lg="4"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>
                    State <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter State"
                    maxLength="50"
                    value={forms.state}
                    onChange={(e) => setField("state", e.target.value)}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (charCode >= 48 && charCode <= 57) {
                        // Prevent input if charCode is a number
                        e.preventDefault();
                      }
                    }}
                    isInvalid={!!errors.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="4"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>
                    PIN CODE<span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter PIN CODE"
                    value={forms.pincode}
                    onChange={(e) => {
                      const pincode = e.target.value;
                      if (/^\d{0,6}$/.test(pincode)) {
                        // Regex to allow only up to 6 digits
                        setField("pincode", pincode);
                      }
                    }}
                    isInvalid={!!errors.pincode}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.pincode}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  lg="4"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>
                    Address Type<span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Select
                    name={`addressType`}
                    value={forms.addressType}
                    onChange={(e) => setField("addressType", e.target.value)}
                  >
                    <option value="">Select Address Type</option>
                    <option value="P">Permanent</option>
                    <option value="C">Communication</option>
                    <option value="O">Others</option>
                  </Form.Select>
                </Form.Group>
                <br></br>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="4" // Adjusted to lg="4" for smaller width on larger screens
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>
                    Mobile No <span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Mobile No"
                    value={forms.mobile}
                    onChange={(e) => {
                      const mobileNo = e.target.value;
                      if (/^\d{0,10}$/.test(mobileNo)) {
                        setField("mobile", mobileNo);
                      }
                    }}
                    isInvalid={!!errors.mobile}
                    style={{ width: "100%" }} // Adjusted width to 100% for smaller field
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  lg="4" // Adjusted to lg="4" for smaller width on larger screens
                  className="F_group_common"
                >
                  <Form.Label className="email_val">
                    Email<span className="mrd_star">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    maxLength="99"
                    value={forms.email}
                    onChange={(e) => setField("email", e.target.value)}
                    style={{ width: "100%" }} // Adjusted width to 100% for smaller field
                    className="lowercase-input"
                    isInvalid={!!errors.email && forms.email.trim() === ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email ? "Please Enter your Email address" : null}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row>
                <br />
                <Col md="9">
                  <h2>EDUCATION</h2>
                  <hr />

                  {forms.educationData &&
                    forms.educationData.map((education, index) => (
                      <Card className="education-card" key={index}>
                        <Card.Body>
                          <React.Fragment>
                            {index === 0 && (
                              <div style={{ marginBottom: "8px" }}>
                                <p
                                  style={{
                                    fontSize: "medium",
                                  }}
                                >
                                  Enter Your Higher Qualification.
                                </p>
                                <hr />
                              </div>
                            )}

                            <Row>
                              {/* Specialisation Field */}
                              <Col md={{ span: 4, offset: 0 }} xs={12}>
                                <Form.Group
                                  controlId={`qualification-${index}`}
                                >
                                  <Form.Label>Qualification</Form.Label>
                                  <Select
                                    showSearch
                                    style={{
                                      width: "250px", // Adjusted width to match the registration number field
                                      borderRadius: "4px",
                                    }}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please Select Qualification",
                                      },
                                    ]}
                                    label="qualification"
                                    onChange={(value) =>
                                      setField("qualif", value, index)
                                    }
                                    tokenSeparators={[","]}
                                    options={list}
                                    placeholder={
                                      <span style={{ color: "#808080" }}>
                                        Select Qualification
                                      </span>
                                    }
                                    filterOption={(input, option) =>
                                      (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    value={education.qualif || undefined}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {typeof errors.qualif === "object"
                                      ? errors.qualif.message
                                      : errors.qualif}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              {/* Qualification Field */}

                              <Col md={4} xs={12}>
                                <Form.Group
                                  controlId={`specialisation-${index}`}
                                >
                                  <Form.Label>Specialisation</Form.Label>
                                  <Select
                                    showSearch
                                    style={{
                                      width: "350px", // Adjusted width to make it a little longer
                                      borderRadius: "5px",
                                    }}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please Select Specialisation",
                                      },
                                    ]}
                                    label="specialisation"
                                    onChange={(value) =>
                                      setField("spec", value, index)
                                    }
                                    tokenSeparators={[","]}
                                    options={speclist}
                                    placeholder={
                                      <span style={{ color: "#808080" }}>
                                        Select Qualification
                                      </span>
                                    }
                                    filterOption={(input, option) =>
                                      (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    value={education.spec || undefined}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {typeof errors.spec === "object"
                                      ? errors.spec.message
                                      : errors.spec}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>

                              <Col
                                md={{ span: 2, offset: 1 }}
                                xs={12}
                                className="text-right"
                              >
                                {" "}
                                {/* Adjusted size and alignment */}
                                <Form.Group
                                  key={`completedYear-${index}`}
                                  className="text-right"
                                >
                                  {" "}
                                  {/* Added text-right class */}
                                  <Form.Label style={{ fontSize: "17px" }}>
                                    Completed Year
                                  </Form.Label>{" "}
                                  {/* Adjusted font size */}
                                  <Form.Control
                                    type="date"
                                    placeholder="Enter Completed Year"
                                    name={`completedYear-${index}`}
                                    value={education.complYear}
                                    onChange={(e) => {
                                      const input = e.target.value;
                                      if (
                                        /^[0-9\-#$@%]*$/.test(input) ||
                                        input === ""
                                      ) {
                                        setField("complYear", input, index);
                                      }
                                    }}
                                    style={{ width: "200px" }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              {/* Reg Number Field */}
                              <Col md={6} xs={12}>
                                <Form.Group key={`registration-${index}`}>
                                  <Form.Label>Reg Number:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Reg No"
                                    name={`registration-${index}`}
                                    value={education.regNumber}
                                    onChange={(e) =>
                                      setField(
                                        "regNumber",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              {/* Class Obtained Field */}
                              <Col md={6} xs={12}>
                                <Form.Group key={`classObtained-${index}`}>
                                  <Form.Label>Class Obtained:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Class Obtained"
                                    name={`classObtained-${index}`}
                                    value={education.classObtain}
                                    onChange={(e) =>
                                      setField(
                                        "classObtain",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <br></br>
                            <Row>
                              <Col md={{ span: 6, offset: 0 }}>
                                {" "}
                                {/* Adjusted the span size */}
                                <Form.Group key={`institution-${index}`}>
                                  <Form.Label>Institution:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Institution"
                                    name={`institution-${index}`}
                                    value={education.institution}
                                    onChange={(e) =>
                                      setField(
                                        "institution",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={{ span: 6, offset: 0 }}>
                                <Form.Group
                                  key={`studyMode-${index}`}
                                  className="mb-3"
                                >
                                  <Form.Label>Study Mode:</Form.Label>
                                  <Form.Select
                                    name={`studyMode-${index}`}
                                    value={education.studyMode}
                                    onChange={(e) =>
                                      setField(
                                        "studyMode",
                                        e.target.value,
                                        index
                                      )
                                    }
                                    isInvalid={
                                      errors.studyMode &&
                                      errors.studyMode[index]
                                    }
                                    style={{ color: "#808080" }}
                                  >
                                    <option
                                      value=""
                                      style={{ color: "#808080" }}
                                    >
                                      Select Study Mode
                                    </option>{" "}
                                    {/* Set color to black */}
                                    <option value="R">Regular</option>
                                    <option value="D">Distance</option>
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {errors.studyMode &&
                                      errors.studyMode[index]}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </React.Fragment>
                          <br></br>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "right",
                              marginLeft: "10px",
                            }}
                          >
                            {index === 0 ? (
                              <button
                                className="add_btn"
                                style={{
                                  border: "none",
                                  background: "none",
                                  padding: 0,
                                  marginRight: "20px",
                                  marginBottom: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={handleAddRoweducation}
                              >
                                {plus}
                              </button>
                            ) : (
                              <button
                                className="remove_btn"
                                style={{
                                  border: "none",
                                  background: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleRemoveeducation(index)}
                              >
                                {wrong}
                              </button>
                            )}
                            {index === 0 && (
                              <p
                                style={{
                                  marginLeft: "5px",
                                  fontSize: "medium",
                                  marginTop: "5px",
                                }}
                              >
                                Add More Education
                              </p>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                </Col>
                {/* <Col className="addbutton" md="1">
                  <button
                    className="plus_btn rotate"
                    title="Click to add new"
                    onClick={handleAddRoweducation}
                  >
                    {plus}
                  </button>
                </Col> */}
              </Row>

              {/* Dynamic rows */}
              {rows.map((row, index) => (
                <Row key={index}>
                  <Col md="8">
                    <Card className="education-card">
                      <Card.Body>
                        <Form.Group
                          as={Col}
                          md={{ span: 4, offset: 0 }}
                          controlId="validationCustom01"
                        >
                          <Form.Label>Qualification</Form.Label>
                          <Select
                            showSearch
                            style={{
                              width: "150%",
                              border: "2px solid #878A99 !important",
                              borderRadius: "4px !important",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please select From Place",
                              },
                              // Add other validation rules as needed
                            ]}
                            label="qualification"
                            onChange={(value) => {
                              const selectedData = list.find(
                                (place) => place.value === value
                              );
                              if (selectedData) {
                                setForms((prevState) => ({
                                  ...prevState,
                                  qualif: selectedData.value,
                                }));
                              }
                            }}
                            tokenSeparators={[","]}
                            options={list}
                            // onSearch={placeMaster}
                            placeholder="Select to place"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            value={forms.qualif || undefined}
                            // isInvalid={!!errors.FROM_PLACE}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.qualif}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md={{ span: 4, offset: 0 }}
                          controlId="validationCustom01"
                        >
                          <Form.Label>Specialisation</Form.Label>
                          <Select
                            showSearch
                            style={{
                              width: "200%",
                              border: "2px solid #878A99 !important",
                              borderRadius: "4px !important",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please select From Place",
                              },
                              // Add other validation rules as needed
                            ]}
                            label="specialisation"
                            onChange={(value) => {
                              const selectedData = speclist.find(
                                (place) => place.value === value
                              );
                              if (selectedData) {
                                setForms((prevState) => ({
                                  ...prevState,
                                  spec: selectedData.value,
                                }));
                              }
                            }}
                            tokenSeparators={[","]}
                            options={speclist}
                            // onSearch={placeMaster}
                            placeholder="Select to place"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            value={forms.spec || undefined}
                            // isInvalid={!!errors.FROM_PLACE}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.spec}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Registration Number:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter registration number"
                            name={`registration-${index}`}
                            value={forms.regNumber}
                            onChange={(e) =>
                              setField("regNumber", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Completed Year:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter completed year"
                            name={`completedYear-${index}`}
                            value={forms.complYear}
                            onChange={(e) =>
                              setField("complYear", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Class Obtained:</Form.Label>
                          <Form.Select
                            name={`classObtained-${index}`}
                            value={forms.classObtain}
                            onChange={(e) => {
                              const selectedValue =
                                e.target.value === "Distinction"
                                  ? "First Class"
                                  : e.target.value;
                              setField("classObtain", selectedValue);
                            }}
                          >
                            <option value="">Select Class Obtained</option>
                            <option value="First Class">First Class</option>
                            <option value="Distinction">Distinction</option>
                            <option value="Second Class">Second Class</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Institution:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter institution"
                            name={`institution-${index}`}
                            value={forms.institution}
                            onChange={(e) =>
                              setField("institution", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Study Mode:</Form.Label>
                          <Form.Select
                            name={`studymode-4`}
                            value={forms.studyMode}
                            onChange={(e) =>
                              setField("studyMode", e.target.value)
                            }
                          >
                            <option value="Regular">Regular</option>
                            <option value="Distance">Distance</option>
                          </Form.Select>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col className="addbutton" md="1">
                    {rows.length > 1 ? (
                      <button
                        className="plus_btn rotate_z"
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                        title="Click to remove"
                        onClick={() => handleRemoveRow(index)}
                      >
                        {wrong}
                      </button>
                    ) : (
                      <button
                        className="plus_btn rotate_z"
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                        title="Click to remove"
                        onClick={() => handleRemoveRow(index)}
                      >
                        {wrong}
                      </button>
                    )}
                  </Col>
                </Row>
              ))}

              <br></br>
              <Row>
                <Col md="9">
                  <h2>EXPERIENCE</h2>
                  <hr />
                  {forms.experienceData &&
                    forms.experienceData.map((experience, index) => (
                      <Card className="education-card" key={index}>
                        <Card.Body>
                          <React.Fragment>
                            {index === 0 && (
                              <div style={{ marginBottom: "8px" }}>
                                <p
                                  style={{
                                    fontSize: "medium",
                                  }}
                                >
                                  Enter Your Lastest or Current Organization
                                </p>
                                <hr />
                              </div>
                            )}

                            <Row>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>Organisation:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Organisation"
                                    name={`orgName-${index}`}
                                    value={experience.orgName}
                                    onChange={(e) =>
                                      setField("orgName", e.target.value, index)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>Years Experience:</Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="Enter years Experience"
                                    name={`noYear-${index}`}
                                    value={experience.noYear}
                                    onChange={(e) =>
                                      setField("noYear", e.target.value, index)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <br></br>
                            <Row>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>From Date:</Form.Label>
                                  <Col sm="12">
                                    {" "}
                                    {/* Full width column for the control */}
                                    <Form.Control
                                      type="date"
                                      pattern="\d{2}-\d{2}-\d{4}"
                                      placeholder="DD-MM-YYYY"
                                      value={experience.fromDt}
                                      onChange={(e) =>
                                        setField(
                                          "fromDt",
                                          e.target.value,
                                          index
                                        )
                                      }
                                      maxLength="10"
                                      isInvalid={!!errors.fromDt}
                                    />
                                  </Col>
                                </Form.Group>
                              </Col>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>To Date:</Form.Label>
                                  <Col sm="12">
                                    {" "}
                                    {/* Full width column for the control */}
                                    <Form.Control
                                      type="date"
                                      name={`classObtained-${index}`}
                                      value={experience.toDt}
                                      onChange={(e) =>
                                        setField("toDt", e.target.value, index)
                                      }
                                    />
                                  </Col>
                                </Form.Group>
                              </Col>
                            </Row>
                            <br></br>
                            <Row>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>Designation:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Designation"
                                    name={`institution-${index}`}
                                    value={experience.postHeld}
                                    onChange={(e) =>
                                      setField(
                                        "postHeld",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm="6">
                                <Form.Group>
                                  <Form.Label>Nature of Duty:</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Nature of Duty"
                                    name={`studyMode-${index}`}
                                    value={experience.natureDuty}
                                    onChange={(e) =>
                                      setField(
                                        "natureDuty",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </React.Fragment>

                          <br></br>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "right",
                              marginLeft: "10px",
                            }}
                          >
                            {index === 0 ? (
                              <button
                                className="add_btn"
                                style={{
                                  border: "none",
                                  background: "none",
                                  padding: 0,
                                  marginRight: "20px",
                                  marginBottom: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={handleAddRowexperience}
                              >
                                {plus}
                              </button>
                            ) : (
                              <button
                                className="remove_btn"
                                style={{
                                  border: "none",
                                  background: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleRemoveexperience(index)}
                              >
                                {wrong}
                              </button>
                            )}
                            {index === 0 && (
                              <p
                                style={{
                                  marginLeft: "5px",
                                  fontSize: "medium",
                                  marginTop: "5px",
                                }}
                              >
                                Add More Experience
                              </p>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                </Col>
                {/* <Col className="addbutton" md="1">
                  <button
                    className="plus_btn rotate"
                    title="Click to add new"
                    onClick={handleAddRowexperience}
                  >
                    {plus}
                  </button>
                </Col> */}
              </Row>

              {/* Dynamic rows */}
              {rows.map((row, index) => (
                <Row key={index}>
                  <Col md="8">
                    <Card className="education-card">
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Organisation:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Organisation"
                            name={`specialization-0`}
                            value={forms.orgName}
                            onChange={(e) =>
                              setField("orgName", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Years Experience:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter years Experience "
                            name={`registration-${0}`}
                            value={forms.noYear}
                            onChange={(e) => setField("noYear", e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>From Date:</Form.Label>
                          <Form.Control
                            type="date"
                            name={`completedYear-${0}`}
                            value={forms.fromDt}
                            onChange={(e) => setField("fromDt", e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>To Date:</Form.Label>
                          <Form.Control
                            type="date"
                            name={`classObtained-${0}`}
                            value={forms.toDt}
                            onChange={(e) => setField("toDt", e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Designation:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Designation"
                            name={`institution-${0}`}
                            value={forms.postHeld}
                            onChange={(e) =>
                              setField("postHeld", e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Nature of Duty:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Nature of Duty"
                            name={`studyMode-${0}`}
                            value={forms.natureDuty}
                            onChange={(e) =>
                              setField("natureDuty", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col className="addbutton" md="1">
                    {rows.length > 1 ? (
                      <button
                        className="plus_btn rotate_z"
                        title="Click to remove"
                        onClick={() => handleRemoveRow(index)}
                      >
                        {wrong}
                      </button>
                    ) : (
                      <button
                        className="plus_btn rotate_z"
                        title="Click to remove"
                        onClick={() => handleRemoveRow(index)}
                      >
                        {wrong}
                      </button>
                    )}
                  </Col>
                </Row>
              ))}

              {/* <br></br>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  lg="6"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>Research Done</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Research Done"
                    as="textarea"
                    value={forms.researchDone}
                    onChange={(e) => setField("researchDone", e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  lg="6"
                  xs="12"
                  md="6"
                  className="F_group_common"
                >
                  <Form.Label>Research In Progress</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Research In Progress"
                    as="textarea"
                    value={forms.researchProgress}
                    onChange={(e) =>
                      setField("researchProgress", e.target.value)
                    }
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} lg="6" xs="12" md="6">
                  <Form.Label>Published Work </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Published Work"
                    as="textarea"
                    value={forms.publishedWork}
                    onChange={(e) => setField("publishedWork", e.target.value)}
                  />
                </Form.Group>
              </Row> */}
              <br></br>
              <div className="mrd_Button_Group">
                <Button variant="primary" type="reset" className="Mrd_Button">
                  Reset
                </Button>
                <Button variant="danger" type="submit" className="Mrd_Button">
                  Submit
                </Button>
              </div>
            </Form>
            {successOpen && (
              <Successpage
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default HOME;
