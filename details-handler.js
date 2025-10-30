/* ==========================================================
   📋 DETAILS HANDLER — Patient Comprehensive Modal System
========================================================== */

// 🎯 عناصر المودال
const modal = document.getElementById("modal-Details");
const closeBtn = document.getElementById("closeModalDetails");
const bodyContainer = document.getElementById("detailsBody");

// 🔹 توليد قسم داخل نافذة التفاصيل
function section(title, items) {
  const rows = items.map(i => `
    <div class="item">
      <strong>${i.label}</strong>
      <span>${i.value || "—"}</span>
    </div>`).join("");
  return `
    <div class="section">
      <h3>${title}</h3>
      <div class="grid">${rows}</div>
    </div>`;
}

// 🔹 دالة فتح المودال وتعبئة التفاصيل
function openModalDetails(data) {
  const val = x => (x && x.toString().trim() ? x : "—");

  bodyContainer.innerHTML = `
    ${section("🩺 Demographic Data", [
      { label: "Patient Name", value: val(data.name) },
      { label: "IPN", value: val(data.ipn) },
      { label: "DOB", value: val(data.dob) },
      { label: "Age", value: val(data.age) },
      { label: "Gender", value: val(data.gender) },
    ])}

    ${section("🏥 Admission Data", [
      { label: "Diagnosis", value: val(data.diagnosis) },
      { label: "Source of Admission", value: val(data.source) },
      { label: "Parent Team (Admission)", value: val(data.parentAdmission) },
      { label: "Date of Admission", value: val(data.doa) },
      { label: "DNR Status", value: val(data.dnr) },
      { label: "Discharge", value: val(data.discharge) },
    ])}

    ${section("💨 Respiratory Support", [
      { label: "NIV", value: val(data.niv) },
      { label: "NIV Start", value: val(data["NIV Start"]) },
      { label: "NIV End", value: val(data["NIV End"]) },
      { label: "LOS with NIV", value: val(data["LOS with NIV"]) },
      { label: "HFNC", value: val(data.hfnc) },
      { label: "HFNC Start", value: val(data["HFNC Start"]) },
      { label: "HFNC End", value: val(data["HFNC End"]) },
      { label: "LOS with HFNC", value: val(data["LOS with HFNC"]) },
    ])}

    ${section("🫁 Tracheostomy", [
      { label: "Patient Tracheostomized", value: val(data["Tracheostomized"]) },
      { label: "New Tracheostomy", value: val(data["New Tracheostomy"]) },
      { label: "Ventilated", value: val(data["Ventilated"]) },
    ])}

    ${section("🚪 Exit Data", [
      { label: "DOT/DOD", value: val(data.dot) },
      { label: "Parent Team (Exit)", value: val(data.parentExit) },
      { label: "Discharge To", value: val(data["Discharge To"]) },
      { label: "LOS", value: val(data["LOS"]) },
      { label: "LOS in number", value: val(data["LOS in number"]) },
    ])}

    ${section("📈 KPI / Assessment", [
      { label: "Long Line", value: val(data["Long Line"]) },
      { label: "Type of Long Line", value: val(data["Long Line Type"]) },
      { label: "Inserted Place", value: val(data["Inserted Place"]) },
      { label: "MDRO", value: val(data["MDRO"]) },
      { label: "Droplet Isolation", value: val(data["Droplit isolation"]) },
      { label: "Positive Blood Culture", value: val(data["Positive Blood Culture"]) },
      { label: "Pressure Sore", value: val(data["Pressure Sore"]) },
      { label: "Fall", value: val(data["Fall"]) },
      { label: "CLABSI", value: val(data["CLABSI"]) },
      { label: "Readmission 24 HRS", value: val(data["Readmission 24 HRS"]) },
      { label: "Readmission 48 HRS", value: val(data["Readmission 48 HRS"]) },
      { label: "Readmission 72 HRS", value: val(data["Readmission 72 HRS"]) },
      { label: "Blood Reaction", value: val(data["Blood Reaction"]) },
      { label: "Device-related Pressure Sore", value: val(data["Device-related Pressure Sore"]) },
      { label: "Sepsis", value: val(data["Sepsis"]) },
      { label: "Nutrition Feed Started within 4 Hrs", value: val(data["Nutrition Feed Started within 4 Hrs"]) },
      { label: "Cardiac Arrest", value: val(data["Cardiac Arrest"]) },
      { label: "Tracheostomy Dislodgement", value: val(data["Tracheostomy Dislodgement"]) },
    ])}

    ${section("⚕️ Clinical / Acuity Details", [
      { label: "Vital Signs", value: val(data["Vital Signs"]) },
      { label: "Medication", value: val(data["Medication"]) },
      { label: "Infusion", value: val(data["Infusion"]) },
      { label: "Specimen", value: val(data["Specimen"]) },
      { label: "Suction / Chest Physiotherapy", value: val(data["Suction/Chest physiotherapy"]) },
      { label: "Vascular Access", value: val(data["Vascular access"]) },
      { label: "Procedures", value: val(data["Procedures"]) },
      { label: "Technology Support", value: val(data["Technology support"]) },
      { label: "Acuity Level", value: val(data["Acuity Level"]) },
    ])}
  `;

  // ✅ أظهر المودال
  modal.classList.add("active");
}

// 🔹 إغلاق المودال
if (closeBtn) {
  closeBtn.onclick = () => modal.classList.remove("active");
}

// 🔹 إغلاق بالنقر خارج المودال
if (modal) {
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove("active");
  };
}
