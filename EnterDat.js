      function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var data = JSON.parse(e.postData.contents);

    // دالة مساعدة لإرجاع القيمة أو فارغ إذا غير موجود
    function getValue(field) {
      return data[field] !== undefined ? data[field] : "";
    }

    // Append row مع جميع الحقول + الصورة Base64 في العمود الأخير
    sheet.appendRow([
      getValue("staffNumber"),                  
      getValue("staffName"),                    
      getValue("dob"),                          
      "",                                       
      getValue("gender"),                       
      getValue("maritalStatus"),                
      getValue("nationality"),                  
      getValue("country"),                      
      getValue("cvillNumber"),                  
      getValue("phoneNumber"),                  
      getValue("contactNumberOfNextKin"),       
      getValue("email"),                        
      getValue("currentAddress"),               
      getValue("permanentAddress"),             
      getValue("drivingStatus"),                
      getValue("wayOfComingToWork"),            
      getValue("timeFromHomeToHospital"),       
      getValue("typeOfEmployment"),             
      getValue("dateOfJoiningRH"),              
      "",                                       
      getValue("dateOfAppointmentMOH"),         
      "",                                       
      getValue("designation"),                  
      getValue("actualPosition"),               
      getValue("department"),                   
      getValue("section"),                      
      getValue("unit"),                         
      getValue("financeGrade"),                 
      getValue("lastPromotionDate"),            
      getValue("typeOfContract"),               
      getValue("dateOfContractStart"),          
      getValue("dateOfContractEnd"),            
      getValue("qualification"),                
      getValue("yearObtainedNursingCert"),      
      getValue("haveSpecialty"),                
      getValue("whatSpecialty"),                
      getValue("mohRegistrationNumber"),        
      getValue("chronicIllness"),               
      getValue("chronicIllnessList"),           
      getValue("inpRH"),                        
      getValue("lastBLSDate"),                  
      getValue("lastPALSDate"),                 
      getValue("ivTherapy"),                    
      getValue("painManagement"),               
      getValue("patientSafety"),                
      getValue("aggressionCourse"),             
      getValue("onlineLeanManagement"),         
      getValue("leanManagementPhysical"),       
      getValue("bfhi"),                         
      getValue("infectionControlHakeemTheory"), 
      getValue("infectionControlHakeemPractice"),
      getValue("ecgCompleted"),                 
      getValue("manualHandling"),               
      getValue("chemotherapyTheory"),           
      getValue("chemotherapyPractice"),         
      getValue("centralLineCourse"),            
      getValue("practiceCentralLine"),          
      getValue("leadershipManagement"),         
      getValue("preceptorshipCourse"),          
      getValue("ethicalCourse"),                
      getValue("communicationCourse"),          
      getValue("nivCourse"),                    
      getValue("transportCriticalPtCourse"),    
      getValue("careOfArterialLine"),           
      getValue("peritonealDialysis"),           
      getValue("otherCourses"),                 
      getValue("photoBase64") // 👈 الصورة Base64 في آخر عمود
    ]);

    return ContentService
           .createTextOutput(JSON.stringify({"result":"success"}))
           .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
           .createTextOutput(JSON.stringify({"result":"error","message": error.message}))
           .setMimeType(ContentService.MimeType.JSON);
  }
}
let currentTab = 0;
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let photoBase64 = ""; // لتخزين الصورة

function showTab(n) {
  contents.forEach((c, i) => {
    c.classList.remove("active");
    tabs[i].classList.remove("active");
  });
  contents[n].classList.add("active");
  tabs[n].classList.add("active");
  currentTab = n;

  prevBtn.disabled = (n === 0);
  nextBtn.innerText = (n === contents.length - 1) ? "Submit" : "Next";
}

function nextPrev(n) {
  if (n === 1 && !validateForm()) return;

  let newTab = currentTab + n;
  if (newTab < 0 || newTab > contents.length) return;

  if (newTab === contents.length) {
    // Submit البيانات إلى Google Sheet
    submitForm();
    return;
  }
  showTab(newTab);
}

function validateForm() {
  const inputs = contents[currentTab].querySelectorAll("input, select, textarea");
  let valid = true;

  inputs.forEach(input => {
    if (input.value.trim() === "" || (input.tagName === "SELECT" && input.value === "")) {
      input.style.border = "2px solid red";
      valid = false;
    } else {
      input.style.border = "1px solid #ddd";
    }
  });

  if (!valid) alert("Please fill all the fields before proceeding!");
  return valid;
}

// رفع الصورة
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoBase64 = e.target.result; // تخزين Base64
      photoPreview.style.backgroundImage = `url('${photoBase64}')`;
      photoPreview.innerHTML = `<img src="${photoBase64}" alt="Profile Photo" style="width:100%;height:100%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  }
});

// جمع كل البيانات من الفورم
function collectFormData() {
  const allInputs = document.querySelectorAll(".formstaff input, .formstaff select, .formstaff textarea");
  const data = {};
  allInputs.forEach(input => {
    let key = input.id || input.name || input.previousElementSibling?.innerText.replace(/\s+/g, "");
    data[key] = input.value;
  });
  data["photoBase64"] = photoBase64;
  return data;
}

// إرسال البيانات إلى Google Sheet
function submitForm() {
  const data = collectFormData();

  fetch("https://script.google.com/macros/s/AKfycbzCSw807FLibpG3e0l401Dt-XWyIFW8cf-2GNNkXX9TJmkkRdCMjhD4VPk62cV13mhL/exec", { // ضع هنا رابط Google Apps Script Web App
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if(res.result === "success"){
      alert("Form submitted successfully!");
      // إعادة تعيين الفورم بعد الإرسال
      document.getElementById("addStaffForm").reset();
      photoPreview.style.backgroundImage = "";
      photoPreview.innerHTML = "";
      showTab(0);
    } else {
      alert("Error submitting form: " + res.message);
    }
  })
  .catch(err => alert("Error submitting form: " + err));
}
    let currentTab = 0;
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function showTab(n) {
      contents.forEach((c, i) => {
        c.classList.remove("active");
        tabs[i].classList.remove("active");
      });
      contents[n].classList.add("active");
      tabs[n].classList.add("active");
      currentTab = n;

      prevBtn.disabled = (n === 0);
      nextBtn.innerText = (n === contents.length - 1) ? "Submit" : "Next";
    }

    function nextPrev(n) {
      let newTab = currentTab + n;
      if (newTab < 0 || newTab >= contents.length) {
        if (newTab === contents.length) {
          alert("Form Submitted Successfully!");
        }
        return;
      }
      showTab(newTab);
    }

    const photoInput = document.getElementById("photoInput");
    const photoPreview = document.getElementById("photoPreview");

    photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.style.backgroundImage = `url('${e.target.result}')`;
          photoPreview.classList.add("has-image");
          photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
        };
        reader.readAsDataURL(file);
      }
    });
    function nextPrev(n) {
  // تحقق من الحقول في التاب الحالي قبل الانتقال للتاب التالي
  if (n === 1 && !validateForm()) {
    return; // إذا الحقول غير مكتملة، لا ينتقل
  }

  let newTab = currentTab + n;
  if (newTab < 0 || newTab >= contents.length) {
    if (newTab === contents.length) {
      if (!validateForm()) {
        return; // لا يسمح بالـ Submit إذا الحقول غير مكتملة
      }
      alert("Form Submitted Successfully!");
    }
    return;
  }
  showTab(newTab);
}

function validateForm() {
  const inputs = contents[currentTab].querySelectorAll("input, select, textarea");
  let valid = true;

  inputs.forEach(input => {
    // إذا الحقل فارغ
    if (input.value.trim() === "" || (input.tagName === "SELECT" && input.value === "")) {
      input.style.border = "2px solid red"; // تحديد الحقل الأحمر
      valid = false;
    } else {
      input.style.border = "1px solid #ddd"; // إعادة الحدود العادية
    }
  });

  if (!valid) {
    alert("Please fill all the fields before proceeding!");
  }
  return valid;

      let currentTab = 0;
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function showTab(n) {
      contents.forEach((c, i) => {
        c.classList.remove("active");
        tabs[i].classList.remove("active");
      });
      contents[n].classList.add("active");
      tabs[n].classList.add("active");
      currentTab = n;

      prevBtn.disabled = (n === 0);
      nextBtn.innerText = (n === contents.length - 1) ? "Submit" : "Next";
    }

    function nextPrev(n) {
      let newTab = currentTab + n;
      if (newTab < 0 || newTab >= contents.length) {
        if (newTab === contents.length) {
          alert("Form Submitted Successfully!");
        }
        return;
      }
      showTab(newTab);
    }

    const photoInput = document.getElementById("photoInput");
    const photoPreview = document.getElementById("photoPreview");

    photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.style.backgroundImage = `url('${e.target.result}')`;
          photoPreview.classList.add("has-image");
          photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
        };
        reader.readAsDataURL(file);
      }
    });
    function nextPrev(n) {
  // تحقق من الحقول في التاب الحالي قبل الانتقال للتاب التالي
  if (n === 1 && !validateForm()) {
    return; // إذا الحقول غير مكتملة، لا ينتقل
  }

  let newTab = currentTab + n;
  if (newTab < 0 || newTab >= contents.length) {
    if (newTab === contents.length) {
      if (!validateForm()) {
        return; // لا يسمح بالـ Submit إذا الحقول غير مكتملة
      }
      alert("Form Submitted Successfully!");
    }
    return;
  }
  showTab(newTab);
}

function validateForm() {
  const inputs = contents[currentTab].querySelectorAll("input, select, textarea");
  let valid = true;

  inputs.forEach(input => {
    // إذا الحقل فارغ
    if (input.value.trim() === "" || (input.tagName === "SELECT" && input.value === "")) {
      input.style.border = "2px solid red"; // تحديد الحقل الأحمر
      valid = false;
    } else {
      input.style.border = "1px solid #ddd"; // إعادة الحدود العادية
    }
  });

  if (!valid) {
    alert("Please fill all the fields before proceeding!");
  }
  return valid;
}