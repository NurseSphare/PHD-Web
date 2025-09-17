const featureContents = [
  {
    heading: "Education",
    paragraphs: [
      "This section is designed to enhance the knowledge and skills of nursing staff by providing diverse and up-to-date educational content.",
      {
        type: "bullets",
        content: [
          "Enhance your knowledge, learn new skills, and stay updated with the latest developments in nursing practice.",
          "Valuable resources to improve your clinical skills, explore real case studies, and keep up with current research in nursing.",
          "Opportunities to expand your expertise, gain practical insights, and access up-to-date educational materials to support your professional growth."
        ]
      }
    ],
    image: "Media/IMG-20230314-WA0012.jpg",
    buttonUrl: "#Education"
  },
  {
    heading: "Clinical Resources",
    paragraphs: [
      "This section provides quick access to essential tools, guidelines, and evidence-based references that support safe and effective nursing practice. ",
      "🔹 What You'll Find:",
      {
        type: "bullets",
        content: [
          "Up-to-date clinical guidelines and protocols.",
          "Policies and procedures to ensure standardized care.",
          "Quick references for medications, calculations, and assessments.",
          "Practical tools to support day-to-day nursing practice.",
        ]
      }
    ],
    image: "Media/4.jpg",
    buttonUrl: "#ClinicalResources"
  },
  {
    heading: "Hospital Operations",
    paragraphs: [
      "This section is designed to streamline daily hospital functions by providing nurses and staff with the ability to manage essential tasks and data efficiently. It ensures smooth coordination, improves workflow, and supports high-quality patient care.",
      "🔹 What Nurses Can Do Here:",
      {
        type: "bullets",
        content: [
          "Easily record and update patient admission, transfer, and discharge details.",
          "View staff schedules, shifts, and duty assignments.",
          "Keep track of medical supplies, equipment, and resources.",
          "Record and monitor borrowed equipment, supplies, or patient-support materials."
        ]
      }
    ],
    image: "Media/5.png",
    buttonUrl: "#HospitalOperations"
  },
  {
    heading: "Quality and Safety",
    paragraphs: [
      "This section focuses on maintaining high standards of patient care and ensuring a safe hospital environment. It provides tools and information for monitoring performance, preventing risks, and improving overall healthcare quality.",
    {
        type: "bullets",
        content: [
          "Regular audits help evaluate adherence to hospital policies, clinical guidelines, and safety protocols.",
          "Collecting and analyzing clinical and operational data helps track performance trends, patient outcomes, and safety measures.",
          "Guidelines and protocols for emergencies, including natural disasters, mass casualty events, or hospital crises.",
          "Report and review incidents, near misses, or unsafe conditions."
        ]
    }
    ],
    image: "Media/6.jpg",
    buttonUrl: "#QualityandSafety"
  },
  {
    heading: "Nursing HR",
    paragraphs: [
      "This section is designed to manage and support nursing staff efficiently. It provides tools for tracking staff information, monitoring training and certifications, assessing performance, and generating reports to ensure a well-organized and competent workforce.",
    {
        type: "bullets",
        content: [
        "PHDU Staff Directory : A comprehensive directory of all nursing staff in the Pediatric High Dependency Unit (PHDU). This helps locate team members quickly, view contact details, and understand roles and responsibilities.",
        "Staff Training and Certification : Track mandatory training, professional development, and certifications. Nurses can see upcoming courses, renewal dates, and complete requirements to maintain compliance and enhance skills.",
        "Performance and Competency : Monitor staff performance evaluations and competency assessments. This supports professional growth, identifies areas for improvement, and ensures high-quality patient care."
        ]
    }
        ],
    image: "Media/7.jpg",
    buttonUrl: "#NursingHR"
  }
];

// دالة لتحديد الجهاز وتشغيل الكود المناسب
function setActiveBox(index) {
  if (window.innerWidth > 768) {
    // ✅ كود الكمبيوتر
    computerFeature(index);
  } else {
    // ✅ كود الهاتف
    mobileFeature(index);
  }
}

/* ---------------- كود الكمبيوتر ---------------- */
function computerFeature(index) {
  document.querySelectorAll('.feature-box').forEach((box, i) => {
    box.classList.toggle('active', i === index);
  });

  const content = featureContents[index];
  const extraHeading = document.getElementById("extraHeading");
  const extraParagraphs = document.getElementById("extraParagraphs");
  const extraImage = document.getElementById("extraImage");

  extraHeading.textContent = content.heading;
  extraHeading.style.marginBottom = "20px";
  extraHeading.style.fontFamily = "'Fredoka', sans-serif";
  extraHeading.style.color = "#2a6ef2";
  extraHeading.style.webkitTextStroke = "0.6px rgb(26, 23, 36)";

  extraParagraphs.innerHTML = "";

  content.paragraphs.forEach(paragraph => {
    if (typeof paragraph === "string") {
      const p = document.createElement("p");
      if (paragraph.includes("What You'll Find:") || paragraph.includes("Types of Learning Content Available:")) {
        p.style.fontWeight = "bold";
        p.style.color = "#1a4d80";
        p.style.marginTop = "20px";
        p.style.fontSize = "18px";
        p.style.fontFamily = "Arial, sans-serif";
      }
      p.textContent = paragraph;
      extraParagraphs.appendChild(p);
    } else if (paragraph.type === "bullets") {
      const listContainer = document.createElement("div");
      listContainer.style.textAlign = "left";
      listContainer.style.backgroundColor = "#ccdff9ff";
      listContainer.style.borderRadius = "10px";
      listContainer.style.padding = "15px";
      listContainer.style.marginTop = "15px";

      paragraph.content.forEach(line => {
        const bulletDiv = document.createElement("div");
        bulletDiv.style.display = "flex";
        bulletDiv.style.alignItems = "flex-start";
        bulletDiv.style.gap = "8px";
        bulletDiv.style.marginBottom = "8px";

        const bulletImg = document.createElement("img");
        bulletImg.src = "Media/Blue and White Gradient Modern Generative AI Tools Presentation (3).png";
        bulletImg.alt = "•";
        bulletImg.style.width = "22px";
        bulletImg.style.height = "22px";
        bulletImg.style.marginTop = "4px";

        const textDiv = document.createElement("div");
        textDiv.textContent = line;

        bulletDiv.appendChild(bulletImg);
        bulletDiv.appendChild(textDiv);
        listContainer.appendChild(bulletDiv);
      });

      extraParagraphs.appendChild(listContainer);
    }
  });

  if (content.image) {
    extraImage.src = content.image;
    extraImage.style.display = "block";
    extraImage.style.width = "100%";
    extraImage.style.maxWidth = "400px";
    extraImage.style.height = "auto";
  } else {
    extraImage.style.display = "none";
  }

  const existingBtn = document.getElementById("featureBtn");
  if (existingBtn) existingBtn.remove();

  if (content.buttonUrl) {
    const btn = document.createElement("button");
    btn.id = "featureBtn";
    btn.textContent = "Visit " + content.heading;
    btn.style.marginTop = "20px";
    btn.style.padding = "10px 25px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "#2a6ef2";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.transition = "background-color 0.3s ease";

    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "#15527c";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "#2a6ef2";
    });

    btn.addEventListener("click", () => {
      window.location.href = content.buttonUrl;
    });

    extraParagraphs.appendChild(btn);
  }
}

/* ---------------- كود الهاتف ---------------- */
function mobileFeature(index) {
  const titles = featureContents.map(c => c.heading);
  const paragraphs = featureContents.map(c => c.paragraphs[0]);
  const images = featureContents.map(c => c.image);

  const contents = [
    `<ul>
       <li>Enhance knowledge, skills, and stay updated in nursing.</li>
       <li>Access resources, case studies, and current research.</li>
       <li>Expand expertise with practical insights and educational materials.</li>
    </ul>`,
    `<ul>
       <li>Up-to-date clinical protocols</li>
       <li>Policies and procedures</li>
       <li>Quick references for medications, calculations, and assessments.</li>
     </ul>`,
    `<ul>
       <li>Manage patient admissions, transfers, and discharges</li>
       <li>Check staff schedules and assignments</li>
       <li>Track medical supplies and equipment</li>
     </ul>`,
    `<ul>
       <li>Regular audits of hospital policies</li>
       <li>Collect & analyze clinical data</li>
       <li>Emergency guidelines and protocols</li>
     </ul>`,
    `<ul>
       <li>PHDU Staff Directory</li>
       <li>Staff Training & Certification</li>
       <li>Performance & Competency tracking</li>
     </ul>`
  ];
  

  document.getElementById("feature-modal-Phone-Title").textContent = titles[index];
  document.getElementById("feature-modal-Phone-Paragraphs").innerHTML = `<p>${paragraphs[index]}</p>${contents[index]}`;
  document.getElementById("feature-modal-Phone-Image").src = images[index];
  document.getElementById("featureModal-Phone").style.display = "flex";
}

function closeModalPhone() {
  document.getElementById("featureModal-Phone").style.display = "none";
}

/* ---------------- إعادة التعيين للكمبيوتر ---------------- */
function resetDetailBoxToDefault() {
  if (window.innerWidth <= 768) return;

  const extraHeading = document.getElementById("extraHeading");
  const extraParagraphs = document.getElementById("extraParagraphs");
  const extraImage = document.getElementById("extraImage");

  extraHeading.textContent = "";
  extraHeading.style.marginBottom = "0";
  extraHeading.style.fontFamily = "'Fredoka', sans-serif";
  extraHeading.style.color = "#2a6ef2";
  extraHeading.style.webkitTextStroke = "0.6px rgb(26, 23, 36)";

  extraParagraphs.innerHTML = "Explore each feature to discover more 🔍";
  extraParagraphs.style.fontSize = "large";

  extraImage.src = "";
  extraImage.style.display = "none";
}

window.addEventListener('scroll', () => {
  if (window.scrollY < 50) {
    resetDetailBoxToDefault();
  }
});

resetDetailBoxToDefault();