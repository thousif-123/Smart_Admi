export interface PlacementYearRecord {
  year: number;
  totalStudentsEligible: number;
  studentsPlaced: number;
  placementPercentage: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  topRecruiters: string[];
}

export interface APCollegeDetails {
  id: string;
  code: string;
  name: string;
  shortName: string;
  location: string;
  district: string;
  type: 'University' | 'Autonomous' | 'Government' | 'Private';
  establishedYear: number;
  naacRating: string;
  nirfRank?: string;
  eamcetCode: string;
  officialWebsite: string;
  annualFeeRange: string;
  coursesOffered: string[];
  placements: PlacementYearRecord[];
  description: string;
}

export const AP_TOP_COLLEGES_DATABASE: APCollegeDetails[] = [
  {
    id: "auce-visakhapatnam",
    code: "AUCE",
    name: "Andhra University College of Engineering",
    shortName: "AU Engineering College",
    location: "Visakhapatnam",
    district: "Visakhapatnam",
    type: "University",
    establishedYear: 1955,
    naacRating: "A++",
    nirfRank: "Rank 43",
    eamcetCode: "AUCE",
    officialWebsite: "https://www.andhrauniversity.edu.in",
    annualFeeRange: "₹35,000 - ₹50,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Premier state university engineering institution known for top research, alumni network, and government funding in Andhra Pradesh.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 680,
        studentsPlaced: 620,
        placementPercentage: 91.2,
        highestPackageLPA: 44.5,
        averagePackageLPA: 8.2,
        topRecruiters: ["TCS Digital", "Amazon", "Infosys", "Wipro", "L&T", "Deloitte", "Oracle"]
      },
      {
        year: 2024,
        totalStudentsEligible: 650,
        studentsPlaced: 598,
        placementPercentage: 92.0,
        highestPackageLPA: 42.0,
        averagePackageLPA: 7.8,
        topRecruiters: ["Cognizant", "Microsoft", "TCS", "Accenture", "Schlumberger"]
      },
      {
        year: 2023,
        totalStudentsEligible: 620,
        studentsPlaced: 570,
        placementPercentage: 91.9,
        highestPackageLPA: 38.0,
        averagePackageLPA: 7.4,
        topRecruiters: ["Infosys", "Wipro", "Capgemini", "Hyundai", "HAL"]
      }
    ]
  },
  {
    id: "jntuk-kakinada",
    code: "JNTUK",
    name: "JNTU College of Engineering, Kakinada",
    shortName: "JNTU Kakinada Campus",
    location: "Kakinada",
    district: "East Godavari / Kakinada",
    type: "University",
    establishedYear: 1946,
    naacRating: "A+",
    nirfRank: "Rank 85",
    eamcetCode: "JNTUK",
    officialWebsite: "https://www.jntuk.edu.in",
    annualFeeRange: "₹40,000 - ₹55,000",
    coursesOffered: ["CSE", "CSD", "ECE", "INF", "EEE", "MEC", "CIV"],
    description: "Flagship technological university campus providing state-of-the-art labs and high placement records in Core & IT.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 720,
        studentsPlaced: 648,
        placementPercentage: 90.0,
        highestPackageLPA: 36.0,
        averagePackageLPA: 7.5,
        topRecruiters: ["TCS Ninja", "Infosys", "Accenture", "Cisco", "AMD", "HCL Tech"]
      },
      {
        year: 2024,
        totalStudentsEligible: 700,
        studentsPlaced: 637,
        placementPercentage: 91.0,
        highestPackageLPA: 33.5,
        averagePackageLPA: 7.1,
        topRecruiters: ["Wipro", "Tech Mahindra", "Mindtree", "Honeywell"]
      },
      {
        year: 2023,
        totalStudentsEligible: 680,
        studentsPlaced: 612,
        placementPercentage: 90.0,
        highestPackageLPA: 31.0,
        averagePackageLPA: 6.8,
        topRecruiters: ["Infosys", "Cognizant", "Hexaware", "LTI"]
      }
    ]
  },
  {
    id: "jntua-anantapur",
    code: "JNTUA",
    name: "JNTU College of Engineering, Anantapur",
    shortName: "JNTU Anantapur Campus",
    location: "Anantapur",
    district: "Anantapur",
    type: "University",
    establishedYear: 1946,
    naacRating: "A",
    nirfRank: "Rank 112",
    eamcetCode: "JNTUA",
    officialWebsite: "https://www.jntua.ac.in",
    annualFeeRange: "₹38,000 - ₹50,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Historic Rayalaseema government university campus producing top engineering graduates and GATE rankers.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 600,
        studentsPlaced: 516,
        placementPercentage: 86.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 6.8,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Cyient", "Kia Motors", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 580,
        studentsPlaced: 504,
        placementPercentage: 86.9,
        highestPackageLPA: 25.0,
        averagePackageLPA: 6.4,
        topRecruiters: ["Accenture", "Wipro", "Capgemini", "Tata Elxsi"]
      },
      {
        year: 2023,
        totalStudentsEligible: 550,
        studentsPlaced: 478,
        placementPercentage: 86.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["Infosys", "Mindtree", "HCL", "Syntel"]
      }
    ]
  },
  {
    id: "svuce-tirupati",
    code: "SVUCE",
    name: "Sri Venkateswara University College of Engineering",
    shortName: "SVU Engineering College",
    location: "Tirupati",
    district: "Tirupati / Chittoor",
    type: "University",
    establishedYear: 1959,
    naacRating: "A+",
    nirfRank: "Rank 78",
    eamcetCode: "SVUCE",
    officialWebsite: "https://www.svuniversity.edu.in",
    annualFeeRange: "₹35,000 - ₹48,000",
    coursesOffered: ["CSE", "ECE", "INF", "EEE", "MEC", "CIV", "CHE"],
    description: "Renowned South AP University with extensive green campus, dedicated R&D centres, and strong corporate tie-ups.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 550,
        studentsPlaced: 495,
        placementPercentage: 90.0,
        highestPackageLPA: 32.0,
        averagePackageLPA: 7.4,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Cognizant", "BOSCH", "Maruti Suzuki"]
      },
      {
        year: 2024,
        totalStudentsEligible: 530,
        studentsPlaced: 477,
        placementPercentage: 90.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 7.0,
        topRecruiters: ["Wipro", "Accenture", "Hyundai", "Tech Mahindra"]
      },
      {
        year: 2023,
        totalStudentsEligible: 500,
        studentsPlaced: 450,
        placementPercentage: 90.0,
        highestPackageLPA: 27.5,
        averagePackageLPA: 6.6,
        topRecruiters: ["Infosys", "Capgemini", "Mindtree", "Cyient"]
      }
    ]
  },
  {
    id: "gvp-visakhapatnam",
    code: "GVP",
    name: "Gayatri Vidya Parishad College of Engineering",
    shortName: "GVP College of Engineering",
    location: "Madhurawada, Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 1996,
    naacRating: "A++",
    nirfRank: "Rank 128",
    eamcetCode: "GVPE",
    officialWebsite: "https://www.gvpce.ac.in",
    annualFeeRange: "₹70,000 - ₹95,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Top autonomous private college in North Coastal AP known for exceptional discipline, research, and IT placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1100,
        studentsPlaced: 990,
        placementPercentage: 90.0,
        highestPackageLPA: 44.0,
        averagePackageLPA: 7.2,
        topRecruiters: ["Amazon", "Salesforce", "TCS Digital", "Accenture", "Cognizant", "Infosys", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1050,
        studentsPlaced: 955,
        placementPercentage: 91.0,
        highestPackageLPA: 40.0,
        averagePackageLPA: 6.8,
        topRecruiters: ["Wipro", "Mindtree", "Modak Analytics", "Hexaware"]
      },
      {
        year: 2023,
        totalStudentsEligible: 980,
        studentsPlaced: 891,
        placementPercentage: 90.9,
        highestPackageLPA: 35.0,
        averagePackageLPA: 6.5,
        topRecruiters: ["Infosys", "Capgemini", "Persistent Systems", "LTI"]
      }
    ]
  },
  {
    id: "vrsec-vijayawada",
    code: "VRSEC",
    name: "Velagapudi Ramakrishna Siddhartha Engineering College",
    shortName: "VR Siddhartha College",
    location: "Kanuru, Vijayawada",
    district: "NTR / Krishna",
    type: "Autonomous",
    establishedYear: 1977,
    naacRating: "A+",
    nirfRank: "Rank 141",
    eamcetCode: "VRSE",
    officialWebsite: "https://www.vrsiddhartha.ac.in",
    annualFeeRange: "₹72,000 - ₹98,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "The first private engineering college in Andhra Pradesh, holding autonomous status and industry partnership labs.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1200,
        studentsPlaced: 1068,
        placementPercentage: 89.0,
        highestPackageLPA: 45.0,
        averagePackageLPA: 7.1,
        topRecruiters: ["Microsoft", "Amazon", "TCS", "Cognizant", "Deloitte", "IBM", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1150,
        studentsPlaced: 1035,
        placementPercentage: 90.0,
        highestPackageLPA: 42.0,
        averagePackageLPA: 6.7,
        topRecruiters: ["Infosys", "Capgemini", "Tech Mahindra", "Walmart"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1100,
        studentsPlaced: 979,
        placementPercentage: 89.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 6.3,
        topRecruiters: ["Wipro", "Hexaware", "Virtusa", "Mindtree"]
      }
    ]
  },
  {
    id: "rvrjc-guntur",
    code: "RVRJC",
    name: "R.V.R. & J.C. College of Engineering",
    shortName: "RVR & JC Guntur",
    location: "Chowdavaram, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 1985,
    naacRating: "A+",
    nirfRank: "Rank 152",
    eamcetCode: "RVRJ",
    officialWebsite: "https://rvrjcce.ac.in",
    annualFeeRange: "₹68,000 - ₹92,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Leading autonomous institute in Central AP providing comprehensive placement training and Siemens Centre of Excellence.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1050,
        studentsPlaced: 924,
        placementPercentage: 88.0,
        highestPackageLPA: 34.0,
        averagePackageLPA: 6.5,
        topRecruiters: ["TCS", "Cognizant", "Infosys", "Wipro", "Accenture", "Efftronics", "Mindtree"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1000,
        studentsPlaced: 880,
        placementPercentage: 88.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["Capgemini", "Hexaware", "Virtusa", "Tech Mahindra"]
      },
      {
        year: 2023,
        totalStudentsEligible: 950,
        studentsPlaced: 836,
        placementPercentage: 88.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Infosys", "Syntel", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "anits-visakhapatnam",
    code: "ANITS",
    name: "Anil Neerukonda Institute of Technology and Sciences",
    shortName: "ANITS Visakhapatnam",
    location: "Sangivalasa, Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "ANIL",
    officialWebsite: "https://www.anits.edu.in",
    annualFeeRange: "₹65,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Highly reputable engineering college affiliated to Andhra University, with strong software training programs.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 900,
        studentsPlaced: 783,
        placementPercentage: 87.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 6.4,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Cognizant", "Virtusa", "ValueLabs"]
      },
      {
        year: 2024,
        totalStudentsEligible: 850,
        studentsPlaced: 748,
        placementPercentage: 88.0,
        highestPackageLPA: 33.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["Wipro", "Accenture", "Mindtree", "Hyundai Motor"]
      },
      {
        year: 2023,
        totalStudentsEligible: 800,
        studentsPlaced: 704,
        placementPercentage: 88.0,
        highestPackageLPA: 29.5,
        averagePackageLPA: 5.6,
        topRecruiters: ["Capgemini", "Hexaware", "LTI", "Tech Mahindra"]
      }
    ]
  },
  {
    id: "gmrit-rajam",
    code: "GMRIT",
    name: "GMR Institute of Technology",
    shortName: "GMRIT Rajam",
    location: "Rajam, Srikakulam",
    district: "Srikakulam",
    type: "Autonomous",
    establishedYear: 1997,
    naacRating: "A",
    nirfRank: "Rank 188",
    eamcetCode: "GMRR",
    officialWebsite: "http://www.gmrit.org",
    annualFeeRange: "₹66,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Established by GMR Varalakshmi Foundation with world-class residential facilities, entrepreneurship cell, and core industrial placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 87.0,
        highestPackageLPA: 32.0,
        averagePackageLPA: 6.3,
        topRecruiters: ["GMR Group", "TCS", "Cognizant", "Infosys", "Wipro", "JSW", "L&T Construction"]
      },
      {
        year: 2024,
        totalStudentsEligible: 720,
        studentsPlaced: 626,
        placementPercentage: 87.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.9,
        topRecruiters: ["Accenture", "Mindtree", "Virtusa", "Hyundai"]
      },
      {
        year: 2023,
        totalStudentsEligible: 680,
        studentsPlaced: 591,
        placementPercentage: 86.9,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.5,
        topRecruiters: ["Infosys", "Capgemini", "Tech Mahindra", "Tata Projects"]
      }
    ]
  },
  {
    id: "srkr-bhimavaram",
    code: "SRKR",
    name: "S.R.K.R. Engineering College",
    shortName: "SRKR Bhimavaram",
    location: "Bhimavaram",
    district: "West Godavari",
    type: "Autonomous",
    establishedYear: 1980,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "SRKR",
    officialWebsite: "https://www.srkrengg.ac.in",
    annualFeeRange: "₹70,000 - ₹92,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Prominent Godavari region college famous for producing thousands of software engineers in US tech giants.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1100,
        studentsPlaced: 968,
        placementPercentage: 88.0,
        highestPackageLPA: 41.0,
        averagePackageLPA: 6.9,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Cognizant", "Accenture", "Wipro", "Hexaware"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1050,
        studentsPlaced: 924,
        placementPercentage: 88.0,
        highestPackageLPA: 36.0,
        averagePackageLPA: 6.4,
        topRecruiters: ["Capgemini", "Virtusa", "Tech Mahindra", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1000,
        studentsPlaced: 880,
        placementPercentage: 88.0,
        highestPackageLPA: 31.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "pvpsit-vijayawada",
    code: "PVPS",
    name: "Prasad V. Potluri Siddhartha Institute of Technology",
    shortName: "PVP Siddhartha",
    location: "Kanuru, Vijayawada",
    district: "NTR / Krishna",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Band 200-250",
    eamcetCode: "PVPS",
    officialWebsite: "https://www.pvpsiddhartha.ac.in",
    annualFeeRange: "₹65,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Siddhartha Academy managed premier institution with strong discipline, coding culture, and MNC tie-ups.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 650,
        studentsPlaced: 565,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Capgemini", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 620,
        studentsPlaced: 539,
        placementPercentage: 87.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Accenture", "Mindtree", "Tech Mahindra", "Hexaware"]
      },
      {
        year: 2023,
        totalStudentsEligible: 580,
        studentsPlaced: 504,
        placementPercentage: 86.9,
        highestPackageLPA: 22.5,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "LTI", "Efftronics", "Mphasis"]
      }
    ]
  },
  {
    id: "vvit-guntur",
    code: "VVIT",
    name: "Vasireddy Venkatadri Institute of Technology",
    shortName: "VVIT Nambur",
    location: "Nambur, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A",
    nirfRank: "Band 151-200",
    eamcetCode: "VVIT",
    officialWebsite: "https://www.vvitguntur.com",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Modern autonomous college in Capital Region with Siemens CoE, Google Code Labs, and steady placement growth.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 950,
        studentsPlaced: 826,
        placementPercentage: 87.0,
        highestPackageLPA: 33.0,
        averagePackageLPA: 6.3,
        topRecruiters: ["TCS Ninja", "Infosys", "Cognizant", "Wipro", "Virtusa", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 900,
        studentsPlaced: 783,
        placementPercentage: 87.0,
        highestPackageLPA: 29.0,
        averagePackageLPA: 5.9,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 86.9,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.5,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "mits-madanapalle",
    code: "MITS",
    name: "Madanapalle Institute of Technology & Science",
    shortName: "MITS Madanapalle",
    location: "Madanapalle",
    district: "Annamayya / Chittoor",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Rank 201-250",
    eamcetCode: "MITS",
    officialWebsite: "https://www.mits.ac.in",
    annualFeeRange: "₹69,000 - ₹94,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV"],
    description: "Dynamic autonomous institution in Rayalaseema featuring Japanese language training and foreign internship programs.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1200,
        studentsPlaced: 1020,
        placementPercentage: 85.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["Amazon", "TCS", "Cognizant", "Infosys", "Accenture", "L&T", "Mindtree"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1100,
        studentsPlaced: 935,
        placementPercentage: 85.0,
        highestPackageLPA: 33.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["Wipro", "Capgemini", "Tech Mahindra", "Hexaware"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1000,
        studentsPlaced: 850,
        placementPercentage: 85.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Infosys", "Virtusa", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "srec-bhimavaram",
    code: "SREC",
    name: "Shri Vishnu Engineering College for Women",
    shortName: "SVECW Bhimavaram",
    location: "Bhimavaram",
    district: "West Godavari",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Rank 175",
    eamcetCode: "VESW",
    officialWebsite: "https://www.svecw.edu.in",
    annualFeeRange: "₹72,000 - ₹95,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE"],
    description: "Premier women's engineering college in India with high placement rates in top product companies like Microsoft and Adobe.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 750,
        studentsPlaced: 712,
        placementPercentage: 94.9,
        highestPackageLPA: 46.0,
        averagePackageLPA: 8.5,
        topRecruiters: ["Microsoft", "Adobe", "Amazon", "Walmart", "TCS Digital", "Optum", "Salesforce"]
      },
      {
        year: 2024,
        totalStudentsEligible: 700,
        studentsPlaced: 665,
        placementPercentage: 95.0,
        highestPackageLPA: 43.0,
        averagePackageLPA: 8.1,
        topRecruiters: ["Goldman Sachs", "Infosys", "Cognizant", "Target"]
      },
      {
        year: 2023,
        totalStudentsEligible: 650,
        studentsPlaced: 617,
        placementPercentage: 94.9,
        highestPackageLPA: 41.0,
        averagePackageLPA: 7.7,
        topRecruiters: ["Accenture", "Wipro", "Capgemini", "Mindtree"]
      }
    ]
  },
  {
    id: "vignan-visakhapatnam",
    code: "VIGNAN",
    name: "Vignan's Institute of Information Technology",
    shortName: "VIIT Duvvada",
    location: "Duvvada, Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 2002,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "VIEW",
    officialWebsite: "https://www.vignanview.ac.in",
    annualFeeRange: "₹65,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Leading autonomous institution under Vignan Group offering skill development academies and high IT placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 950,
        studentsPlaced: 826,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 900,
        studentsPlaced: 783,
        placementPercentage: 87.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["Mindtree", "Tech Mahindra", "Hexaware", "Modak"]
      },
      {
        year: 2023,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 86.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "aitam-tekkali",
    code: "AITAM",
    name: "Aditya Institute of Technology and Management",
    shortName: "AITAM Tekkali",
    location: "Tekkali, Srikakulam",
    district: "Srikakulam",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "AITM",
    officialWebsite: "https://www.adityatekkali.edu.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "First engineering college in Srikakulam district with NAAC A+ grade and comprehensive campus recruitment drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 750,
        studentsPlaced: 637,
        placementPercentage: 85.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra", "Hexaware"]
      },
      {
        year: 2024,
        totalStudentsEligible: 700,
        studentsPlaced: 595,
        placementPercentage: 85.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 84.9,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "adit-surampalem",
    code: "ADIT",
    name: "Aditya Engineering College",
    shortName: "Aditya Surampalem",
    location: "Surampalem, Kakinada",
    district: "East Godavari / Kakinada",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A++",
    nirfRank: "Rank 185",
    eamcetCode: "AECK",
    officialWebsite: "https://www.aec.edu.in",
    annualFeeRange: "₹70,000 - ₹90,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV", "PET"],
    description: "Massive campus spread over 180 acres offering Technical Hub coding ecosystem and high campus recruitment volumes.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1400,
        studentsPlaced: 1232,
        placementPercentage: 88.0,
        highestPackageLPA: 33.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS Ninja", "Infosys", "Cognizant", "Wipro", "DXC Technology", "Accenture", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1300,
        studentsPlaced: 1144,
        placementPercentage: 88.0,
        highestPackageLPA: 29.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Tech Mahindra", "Mindtree", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1200,
        studentsPlaced: 1056,
        placementPercentage: 88.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "lbrce-mylavaram",
    code: "LBRCE",
    name: "Lakireddy Bali Reddy College of Engineering",
    shortName: "LBRCE Mylavaram",
    location: "Mylavaram, NTR District",
    district: "NTR / Krishna",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "LBCR",
    officialWebsite: "https://www.lbrce.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV", "ASE"],
    description: "Reputed autonomous institute offering Aerospace & CS streams with Siemens & ISRO sponsored research projects.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["Mindtree", "Tech Mahindra", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Infosys", "LTI", "Efftronics", "Syntel"]
      }
    ]
  },
  {
    id: "svec-tirupati",
    code: "SVEC",
    name: "Sree Vidyanikethan Engineering College",
    shortName: "Sree Vidyanikethan Tirupati",
    location: "A. Rangampet, Tirupati",
    district: "Tirupati",
    type: "Autonomous",
    establishedYear: 1996,
    naacRating: "A+",
    nirfRank: "Rank 165",
    eamcetCode: "SVNE",
    officialWebsite: "https://svec.education",
    annualFeeRange: "₹70,000 - ₹92,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Premier autonomous college in Rayalaseema founded by Dr. M. Mohan Babu with world-class sports & tech infrastructure.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1250,
        studentsPlaced: 1087,
        placementPercentage: 87.0,
        highestPackageLPA: 44.0,
        averagePackageLPA: 6.8,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Cognizant", "Accenture", "Wipro", "L&T Infotech"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1200,
        studentsPlaced: 1044,
        placementPercentage: 87.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 6.4,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1150,
        studentsPlaced: 1000,
        placementPercentage: 86.9,
        highestPackageLPA: 32.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["Infosys", "Hexaware", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "gmr-vizianagaram",
    code: "MVGR",
    name: "Maharaj Vijayaram Gajapathi Raj College of Engineering",
    shortName: "MVGR Vizianagaram",
    location: "Chintalavalasa, Vizianagaram",
    district: "Vizianagaram",
    type: "Autonomous",
    establishedYear: 1997,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "MVGR",
    officialWebsite: "https://www.mvgrce.edu.in",
    annualFeeRange: "₹68,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Top autonomous institution in Vizianagaram district under MANSAS educational trust with impressive green campus.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 31.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 27.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Mindtree", "Tech Mahindra", "Hexaware", "Modak"]
      },
      {
        year: 2023,
        totalStudentsEligible: 700,
        studentsPlaced: 609,
        placementPercentage: 87.0,
        highestPackageLPA: 23.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "nri-it-agiripalli",
    code: "NRI",
    name: "NRI Institute of Technology",
    shortName: "NRI IT Agiripalli",
    location: "Agiripalli, Eluru District",
    district: "Eluru / Krishna",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "NRIT",
    officialWebsite: "https://nriit.edu.in",
    annualFeeRange: "₹60,000 - ₹80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Fast-growing autonomous college near Vijayawada with specialized AI/ML labs and active placement drive training.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 700,
        studentsPlaced: 595,
        placementPercentage: 85.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Efftronics"]
      },
      {
        year: 2024,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 84.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "svcet-tirupati",
    code: "SVCET",
    name: "Sri Venkateswara College of Engineering & Technology",
    shortName: "SVCET Chittoor",
    location: "Chittoor",
    district: "Chittoor",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "SVCT",
    officialWebsite: "https://www.svcetedu.org",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV"],
    description: "Autonomous engineering college in Chittoor providing multi-lingual IT training and core mechanical tie-ups.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 650,
        studentsPlaced: 546,
        placementPercentage: 84.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 600,
        studentsPlaced: 504,
        placementPercentage: 84.0,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 550,
        studentsPlaced: 462,
        placementPercentage: 84.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "raghu-visakhapatnam",
    code: "RAGHU",
    name: "Raghu Engineering College",
    shortName: "Raghu College Vizag",
    location: "Bheemunipatnam, Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "RAGU",
    officialWebsite: "https://www.raghuenggcollege.com",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC"],
    description: "Popular autonomous campus in Vizag known for AWS Academy, RedHat Academy, and high IT recruitment stats.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 87.0,
        highestPackageLPA: 32.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["Amazon", "TCS", "Infosys", "Cognizant", "Wipro", "Virtusa", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "vignans-foundation-guntur",
    code: "VFSTR",
    name: "Vignan's Foundation for Science, Technology & Research",
    shortName: "Vignan University Guntur",
    location: "Vadlamudi, Guntur",
    district: "Guntur",
    type: "University",
    establishedYear: 1997,
    naacRating: "A+",
    nirfRank: "Rank 75",
    eamcetCode: "VIGN",
    officialWebsite: "https://www.vignan.ac.in",
    annualFeeRange: "₹1,20,000 - ₹1,80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV", "BIO"],
    description: "Deemed University campus offering cutting-edge research, international collaborations, and top placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1400,
        studentsPlaced: 1260,
        placementPercentage: 90.0,
        highestPackageLPA: 44.0,
        averagePackageLPA: 7.5,
        topRecruiters: ["Amazon", "Cisco", "TCS Digital", "Infosys", "Accenture", "Cognizant", "IBM"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1300,
        studentsPlaced: 1170,
        placementPercentage: 90.0,
        highestPackageLPA: 40.0,
        averagePackageLPA: 7.1,
        topRecruiters: ["Wipro", "Mindtree", "Capgemini", "Deloitte"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1200,
        studentsPlaced: 1080,
        placementPercentage: 90.0,
        highestPackageLPA: 36.0,
        averagePackageLPA: 6.7,
        topRecruiters: ["Infosys", "Hexaware", "Virtusa", "NTT Data"]
      }
    ]
  },
  {
    id: "kl-university-guntur",
    code: "KLU",
    name: "K L Deemed to be University",
    shortName: "KL University Vijayawada",
    location: "Vaddeswaram, Guntur",
    district: "Guntur / Vijayawada",
    type: "University",
    establishedYear: 1980,
    naacRating: "A++",
    nirfRank: "Rank 50",
    eamcetCode: "KLEV",
    officialWebsite: "https://www.kluniversity.in",
    annualFeeRange: "₹1,50,000 - ₹2,40,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV", "BIO"],
    description: "Category-1 Deemed University renowned for 100% placement record, foreign exchanges, and research infrastructure.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 2200,
        studentsPlaced: 2134,
        placementPercentage: 97.0,
        highestPackageLPA: 58.0,
        averagePackageLPA: 9.2,
        topRecruiters: ["Microsoft", "Google", "Amazon", "Salesforce", "ServiceNow", "TCS Digital", "Deloitte"]
      },
      {
        year: 2024,
        totalStudentsEligible: 2000,
        studentsPlaced: 1940,
        placementPercentage: 97.0,
        highestPackageLPA: 52.0,
        averagePackageLPA: 8.8,
        topRecruiters: ["Goldman Sachs", "Infosys", "Cognizant", "Accenture", "Cisco"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1800,
        studentsPlaced: 1746,
        placementPercentage: 97.0,
        highestPackageLPA: 46.0,
        averagePackageLPA: 8.4,
        topRecruiters: ["Wipro", "Capgemini", "Oracle", "Walmart"]
      }
    ]
  },
  {
    id: "gitam-visakhapatnam",
    code: "GITAM",
    name: "GITAM Deemed to be University",
    shortName: "GITAM Visakhapatnam",
    location: "Rushikonda, Visakhapatnam",
    district: "Visakhapatnam",
    type: "University",
    establishedYear: 1980,
    naacRating: "A++",
    nirfRank: "Rank 67",
    eamcetCode: "GITA",
    officialWebsite: "https://www.gitam.edu",
    annualFeeRange: "₹1,60,000 - ₹2,60,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Scenic beachfront university campus with multi-disciplinary programs and worldwide alumni presence.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1800,
        studentsPlaced: 1656,
        placementPercentage: 92.0,
        highestPackageLPA: 46.5,
        averagePackageLPA: 8.4,
        topRecruiters: ["Amazon", "Microsoft", "TCS Ninja", "Infosys", "Cognizant", "Accenture", "Deloitte"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1700,
        studentsPlaced: 1564,
        placementPercentage: 92.0,
        highestPackageLPA: 42.0,
        averagePackageLPA: 8.0,
        topRecruiters: ["Salesforce", "Wipro", "Mindtree", "Tech Mahindra"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1600,
        studentsPlaced: 1472,
        placementPercentage: 92.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 7.6,
        topRecruiters: ["Capgemini", "Hexaware", "Virtusa", "Oracle"]
      }
    ]
  },
  {
    id: "nbkr-vidyanagar",
    code: "NBKR",
    name: "N.B.K.R. Institute of Science and Technology",
    shortName: "NBKRIST Vidyanagar",
    location: "Vidyanagar, Tirupati",
    district: "Tirupati / Nellore",
    type: "Autonomous",
    establishedYear: 1979,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "NBKR",
    officialWebsite: "https://www.nbkrist.co.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "One of the oldest private colleges in South AP providing autonomous quality education and core industry tie-ups.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 600,
        studentsPlaced: 516,
        placementPercentage: 86.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra", "Cyient"]
      },
      {
        year: 2024,
        totalStudentsEligible: 550,
        studentsPlaced: 473,
        placementPercentage: 86.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 500,
        studentsPlaced: 430,
        placementPercentage: 86.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "giscet-rajahmundry",
    code: "GIET",
    name: "Godavari Institute of Engineering and Technology",
    shortName: "GIET Rajahmundry",
    location: "Rajahmundry",
    district: "East Godavari",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "GIET",
    officialWebsite: "https://www.giet.ac.in",
    annualFeeRange: "₹60,000 - ₹80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV", "MIN"],
    description: "Autonomous college in Rajahmundry with specialized Mining, Petroleum, and CS branches.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 800,
        studentsPlaced: 680,
        placementPercentage: 85.0,
        highestPackageLPA: 27.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Hexaware"]
      },
      {
        year: 2024,
        totalStudentsEligible: 750,
        studentsPlaced: 637,
        placementPercentage: 84.9,
        highestPackageLPA: 23.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 700,
        studentsPlaced: 595,
        placementPercentage: 85.0,
        highestPackageLPA: 19.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "geethanjali-nellore",
    code: "GEETH",
    name: "Geethanjali Institute of Science and Technology",
    shortName: "GIST Nellore",
    location: "Gangavaram, Nellore",
    district: "Nellore / Tirupati",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "GIST",
    officialWebsite: "https://gist.edu.in",
    annualFeeRange: "₹55,000 - ₹75,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Famous engineering college in Nellore providing skill certifications and steady corporate placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 550,
        studentsPlaced: 462,
        placementPercentage: 84.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 500,
        studentsPlaced: 420,
        placementPercentage: 84.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.6,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "gprec-kurnool",
    code: "GPREC",
    name: "G. Pulla Reddy Engineering College",
    shortName: "GPREC Kurnool",
    location: "Kurnool",
    district: "Kurnool",
    type: "Autonomous",
    establishedYear: 1984,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "GPRE",
    officialWebsite: "https://www.gprec.ac.in",
    annualFeeRange: "₹70,000 - ₹90,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "The top autonomous engineering institution in Rayalaseema Kurnool area with high GATE and IT placement performance.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 900,
        studentsPlaced: 792,
        placementPercentage: 88.0,
        highestPackageLPA: 36.0,
        averagePackageLPA: 6.7,
        topRecruiters: ["Amazon", "TCS", "Infosys", "Cognizant", "Accenture", "Wipro", "Hexaware"]
      },
      {
        year: 2024,
        totalStudentsEligible: 850,
        studentsPlaced: 748,
        placementPercentage: 88.0,
        highestPackageLPA: 31.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 800,
        studentsPlaced: 704,
        placementPercentage: 88.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "srit-anantapur",
    code: "SRIT",
    name: "Srinivasa Ramanujan Institute of Technology",
    shortName: "SRIT Anantapur",
    location: "Rotary Nagar, Anantapur",
    district: "Anantapur",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "SRIT",
    officialWebsite: "https://www.srit.ac.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Renowned autonomous college in Anantapur with strong IT industry placement records and active IEEE student branch.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 85.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Accenture", "Mindtree", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 550,
        studentsPlaced: 467,
        placementPercentage: 84.9,
        highestPackageLPA: 18.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "viit-bhimavaram",
    code: "VITB",
    name: "Vishnu Institute of Technology",
    shortName: "VIT Bhimavaram",
    location: "Vishnupur, Bhimavaram",
    district: "West Godavari",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A++",
    nirfRank: "Rank 160",
    eamcetCode: "VITB",
    officialWebsite: "https://www.vishnu.edu.in",
    annualFeeRange: "₹72,000 - ₹95,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Sri Vishnu Educational Society campus offering state-of-the-art Assistive Technology Lab and high CS placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1000,
        studentsPlaced: 910,
        placementPercentage: 91.0,
        highestPackageLPA: 44.0,
        averagePackageLPA: 7.5,
        topRecruiters: ["Amazon", "Microsoft", "TCS Digital", "Infosys", "Cognizant", "Accenture", "Walmart"]
      },
      {
        year: 2024,
        totalStudentsEligible: 950,
        studentsPlaced: 864,
        placementPercentage: 91.0,
        highestPackageLPA: 40.0,
        averagePackageLPA: 7.1,
        topRecruiters: ["Wipro", "Mindtree", "Tech Mahindra", "Capgemini"]
      },
      {
        year: 2023,
        totalStudentsEligible: 900,
        studentsPlaced: 819,
        placementPercentage: 91.0,
        highestPackageLPA: 35.0,
        averagePackageLPA: 6.7,
        topRecruiters: ["Infosys", "Virtusa", "LTI", "Hexaware"]
      }
    ]
  },
  {
    id: "aucew-visakhapatnam",
    code: "AUCEW",
    name: "Andhra University College of Engineering for Women",
    shortName: "AU Women Engineering",
    location: "Visakhapatnam",
    district: "Visakhapatnam",
    type: "University",
    establishedYear: 2010,
    naacRating: "A++",
    nirfRank: "Rank 55",
    eamcetCode: "AUCW",
    officialWebsite: "https://www.andhrauniversity.edu.in",
    annualFeeRange: "₹35,000 - ₹48,000",
    coursesOffered: ["CSE", "ECE", "EEE", "MEC"],
    description: "Exclusive university engineering campus for women providing safe residential campus and top government/IT placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 240,
        studentsPlaced: 223,
        placementPercentage: 93.0,
        highestPackageLPA: 40.0,
        averagePackageLPA: 8.0,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Accenture", "Cognizant", "L&T"]
      },
      {
        year: 2024,
        totalStudentsEligible: 220,
        studentsPlaced: 204,
        placementPercentage: 92.7,
        highestPackageLPA: 35.0,
        averagePackageLPA: 7.5,
        topRecruiters: ["Wipro", "Capgemini", "Mindtree", "Tech Mahindra"]
      },
      {
        year: 2023,
        totalStudentsEligible: 200,
        studentsPlaced: 186,
        placementPercentage: 93.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 7.1,
        topRecruiters: ["Infosys", "Hexaware", "LTI", "Mphasis"]
      }
    ]
  },
  {
    id: "kits-guntur",
    code: "KITS",
    name: "KKR & KSR Institute of Technology and Sciences",
    shortName: "KITS Guntur",
    location: "Vinjanampadu, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "KITS",
    officialWebsite: "https://kitsguntur.ac.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE"],
    description: "Dynamic autonomous institution in Guntur known for high pass percentages and IBM, AWS specialized tracks.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 750,
        studentsPlaced: 645,
        placementPercentage: 86.0,
        highestPackageLPA: 27.0,
        averagePackageLPA: 5.9,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 700,
        studentsPlaced: 602,
        placementPercentage: 86.0,
        highestPackageLPA: 23.0,
        averagePackageLPA: 5.5,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 650,
        studentsPlaced: 559,
        placementPercentage: 86.0,
        highestPackageLPA: 19.0,
        averagePackageLPA: 5.1,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "pace-ongole",
    code: "PACE",
    name: "PACE Institute of Technology and Sciences",
    shortName: "PACE Ongole",
    location: "Ongole",
    district: "Prakasam",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "PACE",
    officialWebsite: "https://pace.ac.in",
    annualFeeRange: "₹60,000 - ₹78,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV", "AME"],
    description: "Top engineering college in Prakasam district with Automobile and CS research centers.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 700,
        studentsPlaced: 595,
        placementPercentage: 85.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 84.9,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 17.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "qis-ongole",
    code: "QIS",
    name: "QIS College of Engineering and Technology",
    shortName: "QIS Ongole",
    location: "Vengamukkapalem, Ongole",
    district: "Prakasam",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "QISC",
    officialWebsite: "https://www.qiscet.edu.in",
    annualFeeRange: "₹58,000 - ₹76,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Established autonomous institution in Prakasam providing industry ready internships and campus drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 650,
        studentsPlaced: 546,
        placementPercentage: 84.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 600,
        studentsPlaced: 504,
        placementPercentage: 84.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Tech Mahindra", "Accenture", "Virtusa", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 550,
        studentsPlaced: 462,
        placementPercentage: 84.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.5,
        topRecruiters: ["Infosys", "Hexaware", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "svit-anantapur",
    code: "SVIT",
    name: "Sri Venkateswara Institute of Technology",
    shortName: "SVIT Anantapur",
    location: "Hampapuram, Anantapur",
    district: "Anantapur",
    type: "Private",
    establishedYear: 2009,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "SVIT",
    officialWebsite: "https://svit.ac.in",
    annualFeeRange: "₹50,000 - ₹68,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Accessible technical education campus in Rayalaseema focusing on foundational CS and ECE placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 400,
        studentsPlaced: 320,
        placementPercentage: 80.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 380,
        studentsPlaced: 304,
        placementPercentage: 80.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.4,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 350,
        studentsPlaced: 280,
        placementPercentage: 80.0,
        highestPackageLPA: 12.5,
        averagePackageLPA: 4.1,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "svce-tirupati",
    code: "SVCE",
    name: "SV College of Engineering",
    shortName: "SVCE Tirupati",
    location: "Karakambadi Road, Tirupati",
    district: "Tirupati",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "SVET",
    officialWebsite: "https://svce.edu.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC"],
    description: "Highly sought after autonomous institution in Tirupati with state of the art labs and strong IT placement track record.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 31.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 27.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Hexaware"]
      },
      {
        year: 2023,
        totalStudentsEligible: 700,
        studentsPlaced: 609,
        placementPercentage: 87.0,
        highestPackageLPA: 23.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "bits-kurnool",
    code: "BITK",
    name: "Brindavan Institute of Technology and Science",
    shortName: "BITS Kurnool",
    location: "Peddatekur, Kurnool",
    district: "Kurnool",
    type: "Private",
    establishedYear: 2008,
    naacRating: "B+",
    nirfRank: "Not Listed",
    eamcetCode: "BITK",
    officialWebsite: "https://bitskurnool.edu.in",
    annualFeeRange: "₹50,000 - ₹68,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Affordable engineering college in Kurnool focusing on core engineering skills and IT placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 420,
        studentsPlaced: 336,
        placementPercentage: 80.0,
        highestPackageLPA: 16.0,
        averagePackageLPA: 4.7,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 400,
        studentsPlaced: 320,
        placementPercentage: 80.0,
        highestPackageLPA: 14.0,
        averagePackageLPA: 4.3,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 380,
        studentsPlaced: 304,
        placementPercentage: 80.0,
        highestPackageLPA: 12.0,
        averagePackageLPA: 4.0,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "vignans-nirula-guntur",
    code: "VNW",
    name: "Vignan's Nirula Institute of Technology and Science for Women",
    shortName: "Vignan Nirula Women Guntur",
    location: "Palakaluru, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "VNOW",
    officialWebsite: "https://www.vignannirula.org",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE"],
    description: "Specialized women's engineering college in Guntur under Vignan Group offering high software placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 600,
        studentsPlaced: 546,
        placementPercentage: 91.0,
        highestPackageLPA: 32.0,
        averagePackageLPA: 6.8,
        topRecruiters: ["Amazon", "TCS Digital", "Infosys", "Cognizant", "Accenture", "Wipro"]
      },
      {
        year: 2024,
        totalStudentsEligible: 550,
        studentsPlaced: 500,
        placementPercentage: 90.9,
        highestPackageLPA: 28.0,
        averagePackageLPA: 6.4,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 500,
        studentsPlaced: 455,
        placementPercentage: 91.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["Infosys", "Hexaware", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "lendi-vizianagaram",
    code: "LENDI",
    name: "Lendi Institute of Engineering and Technology",
    shortName: "Lendi Vizianagaram",
    location: "Denkada, Vizianagaram",
    district: "Vizianagaram",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "LEND",
    officialWebsite: "https://www.lendi.org",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC"],
    description: "Highly disciplined autonomous campus near Vizag airport with dedicated coding bootcamps and MNC recruitment.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 700,
        studentsPlaced: 609,
        placementPercentage: 87.0,
        highestPackageLPA: 29.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 650,
        studentsPlaced: 565,
        placementPercentage: 86.9,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Mindtree", "Hexaware"]
      },
      {
        year: 2023,
        totalStudentsEligible: 600,
        studentsPlaced: 522,
        placementPercentage: 87.0,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "vism-visakhapatnam",
    code: "VIZM",
    name: "Vignan's Institute of Engineering for Women",
    shortName: "VIEW Visakhapatnam",
    location: "Kapujaggarajupeta, Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "VIEW",
    officialWebsite: "https://www.view.edu.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE"],
    description: "Women's autonomous engineering institute in Visakhapatnam providing safe residential setup and strong software placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 500,
        studentsPlaced: 450,
        placementPercentage: 90.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 6.3,
        topRecruiters: ["Amazon", "TCS", "Infosys", "Cognizant", "Wipro", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 480,
        studentsPlaced: 432,
        placementPercentage: 90.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.9,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Virtusa", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 450,
        studentsPlaced: 405,
        placementPercentage: 90.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.5,
        topRecruiters: ["Infosys", "Hexaware", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "crr-eluru",
    code: "CRR",
    name: "Sir C.R. Reddy College of Engineering",
    shortName: "CR Reddy Eluru",
    location: "Eluru",
    district: "Eluru / West Godavari",
    type: "Autonomous",
    establishedYear: 1989,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "CRRE",
    officialWebsite: "https://www.sircrreddycollegeofengg.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Historic engineering college in Eluru with expansive campus, Siemens skill development centre, and high software placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["Mindtree", "Tech Mahindra", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 700,
        studentsPlaced: 609,
        placementPercentage: 87.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "gites-rajahmundry",
    code: "GIETW",
    name: "GIET Engineering College",
    shortName: "GIET Engineering Rajahmundry",
    location: "NH-16, Rajahmundry",
    district: "East Godavari",
    type: "Private",
    establishedYear: 2009,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "GIETW",
    officialWebsite: "https://gietec.ac.in",
    annualFeeRange: "₹55,000 - ₹75,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC"],
    description: "Affiliated private engineering college in Rajahmundry providing IT placement drives and skill certifications.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 420,
        studentsPlaced: 352,
        placementPercentage: 83.8,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 336,
        placementPercentage: 84.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.4,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "shri-vishnu-bhimavaram",
    code: "SVEB",
    name: "Swarnandhra College of Engineering and Technology",
    shortName: "Swarnandhra Bhimavaram",
    location: "Seetharampuram, Narsapur",
    district: "West Godavari",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "SWAR",
    officialWebsite: "https://swarnandhra.ac.in",
    annualFeeRange: "₹60,000 - ₹80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Autonomous college near Godavari coastal belt offering robotics, AI labs, and high IT company placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 700,
        studentsPlaced: 595,
        placementPercentage: 85.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 84.9,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Tech Mahindra", "Mindtree", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "diet-visakhapatnam",
    code: "DIET",
    name: "Dadi Institute of Engineering & Technology",
    shortName: "DIET Anakapalle",
    location: "Anakapalle, Visakhapatnam",
    district: "Anakapalle / Visakhapatnam",
    type: "Private",
    establishedYear: 2006,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "DIET",
    officialWebsite: "https://www.diet.edu.in",
    annualFeeRange: "₹55,000 - ₹75,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Popular engineering college in Anakapalle district with active TCS and Infosys recruitment drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.1,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 420,
        studentsPlaced: 352,
        placementPercentage: 83.8,
        highestPackageLPA: 17.0,
        averagePackageLPA: 4.7,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 336,
        placementPercentage: 84.0,
        highestPackageLPA: 14.0,
        averagePackageLPA: 4.3,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "giet-guntur",
    code: "GUNT",
    name: "Guntur Engineering College",
    shortName: "GEC Guntur",
    location: "Yanamadala, Guntur",
    district: "Guntur",
    type: "Private",
    establishedYear: 2008,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "GECG",
    officialWebsite: "https://gecg.in",
    annualFeeRange: "₹50,000 - ₹68,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC"],
    description: "Affordable private college in Guntur focusing on skill acquisition and core regional placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 350,
        studentsPlaced: 280,
        placementPercentage: 80.0,
        highestPackageLPA: 16.0,
        averagePackageLPA: 4.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 320,
        studentsPlaced: 256,
        placementPercentage: 80.0,
        highestPackageLPA: 14.0,
        averagePackageLPA: 4.2,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 300,
        studentsPlaced: 240,
        placementPercentage: 80.0,
        highestPackageLPA: 12.0,
        averagePackageLPA: 3.9,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "chalapathi-guntur",
    code: "CLPT",
    name: "Chalapathi Institute of Technology",
    shortName: "Chalapathi Guntur",
    location: "Mothadaka, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "CITY",
    officialWebsite: "https://city.ac.in",
    annualFeeRange: "₹58,000 - ₹78,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "CIV"],
    description: "Progressive engineering college in Guntur district with AI labs and active placement bootcamps.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 500,
        studentsPlaced: 425,
        placementPercentage: 85.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 450,
        studentsPlaced: 382,
        placementPercentage: 84.9,
        highestPackageLPA: 18.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 340,
        placementPercentage: 85.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.6,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "amrita-amravati",
    code: "AMRITA",
    name: "Amrita Vishwa Vidyapeetham, Amaravati",
    shortName: "Amrita University Amaravati",
    location: "Nowlur, Amaravati",
    district: "Guntur / Amaravati",
    type: "University",
    establishedYear: 2019,
    naacRating: "A++",
    nirfRank: "Rank 7",
    eamcetCode: "AMRT",
    officialWebsite: "https://www.amrita.edu/campus/amaravati",
    annualFeeRange: "₹1,80,000 - ₹2,80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE"],
    description: "World-class university campus in Andhra Pradesh capital region offering top research and international placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 400,
        studentsPlaced: 376,
        placementPercentage: 94.0,
        highestPackageLPA: 48.0,
        averagePackageLPA: 9.5,
        topRecruiters: ["Microsoft", "Amazon", "Cisco", "Google", "TCS Digital", "Intel", "Qualcomm"]
      },
      {
        year: 2024,
        totalStudentsEligible: 350,
        studentsPlaced: 329,
        placementPercentage: 94.0,
        highestPackageLPA: 42.0,
        averagePackageLPA: 9.0,
        topRecruiters: ["Salesforce", "Infosys", "Cognizant", "Accenture"]
      },
      {
        year: 2023,
        totalStudentsEligible: 300,
        studentsPlaced: 282,
        placementPercentage: 94.0,
        highestPackageLPA: 38.0,
        averagePackageLPA: 8.5,
        topRecruiters: ["Wipro", "Capgemini", "Oracle", "Deloitte"]
      }
    ]
  },
  {
    id: "srm-ap-amaravati",
    code: "SRMAP",
    name: "SRM University, AP",
    shortName: "SRM University Amaravati",
    location: "Neerukonda, Amaravati",
    district: "Guntur / Amaravati",
    type: "University",
    establishedYear: 2017,
    naacRating: "A++",
    nirfRank: "Rank 36",
    eamcetCode: "SRMA",
    officialWebsite: "https://srmap.edu.in",
    annualFeeRange: "₹2,00,000 - ₹3,10,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV"],
    description: "Ultra-modern university campus featuring Harvard-collaborated curriculum, silicon valley internships, and 100% placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 816,
        placementPercentage: 96.0,
        highestPackageLPA: 50.0,
        averagePackageLPA: 9.8,
        topRecruiters: ["Google", "Amazon", "Microsoft", "PayPal", "Adobe", "Barclays", "TCS Digital"]
      },
      {
        year: 2024,
        totalStudentsEligible: 750,
        studentsPlaced: 720,
        placementPercentage: 96.0,
        highestPackageLPA: 45.0,
        averagePackageLPA: 9.2,
        topRecruiters: ["Salesforce", "Cognizant", "Infosys", "Accenture"]
      },
      {
        year: 2023,
        totalStudentsEligible: 650,
        studentsPlaced: 624,
        placementPercentage: 96.0,
        highestPackageLPA: 40.0,
        averagePackageLPA: 8.6,
        topRecruiters: ["Wipro", "Capgemini", "Deloitte", "Walmart"]
      }
    ]
  },
  {
    id: "vit-ap-amaravati",
    code: "VITAP",
    name: "VIT-AP University",
    shortName: "VIT AP Amaravati",
    location: "Inavolu, Amaravati",
    district: "Guntur / Amaravati",
    type: "University",
    establishedYear: 2017,
    naacRating: "A++",
    nirfRank: "Rank 28",
    eamcetCode: "VITP",
    officialWebsite: "https://vitap.ac.in",
    annualFeeRange: "₹1,90,000 - ₹3,00,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC"],
    description: "Flagship VIT campus in AP offering Flexible Credit System (FFCS), foreign exchange programs, and massive IT placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1600,
        studentsPlaced: 1536,
        placementPercentage: 96.0,
        highestPackageLPA: 55.0,
        averagePackageLPA: 9.6,
        topRecruiters: ["Microsoft", "Amazon", "Cisco", "Intel", "Qualcomm", "Deloitte", "TCS Digital"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1400,
        studentsPlaced: 1344,
        placementPercentage: 96.0,
        highestPackageLPA: 48.0,
        averagePackageLPA: 9.1,
        topRecruiters: ["Infosys", "Cognizant", "Accenture", "Wipro"]
      },
      {
        year: 2023,
        totalStudentsEligible: 1200,
        studentsPlaced: 1152,
        placementPercentage: 96.0,
        highestPackageLPA: 42.0,
        averagePackageLPA: 8.5,
        topRecruiters: ["Capgemini", "Oracle", "Walmart", "Virtusa"]
      }
    ]
  },
  {
    id: "aditya-college-surampalem",
    code: "ACOE",
    name: "Aditya College of Engineering & Technology",
    shortName: "ACET Surampalem",
    location: "Surampalem, Kakinada",
    district: "Kakinada",
    type: "Autonomous",
    establishedYear: 2004,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "ACET",
    officialWebsite: "https://www.acet.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV"],
    description: "Part of Aditya Educational Group providing Technical Hub competitive coding bootcamps and high MNC placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "DXC Technology", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["Tech Mahindra", "Mindtree", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "pragati-kakinada",
    code: "PRAG",
    name: "Pragati Engineering College",
    shortName: "Pragati Surampalem",
    location: "Surampalem, Kakinada",
    district: "Kakinada",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "PRAG",
    officialWebsite: "https://www.pragati.ac.in",
    annualFeeRange: "₹68,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Renowned autonomous college in Godavari district with consistent placement track record in software and core domains.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 950,
        studentsPlaced: 836,
        placementPercentage: 88.0,
        highestPackageLPA: 32.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS Ninja", "Infosys", "Cognizant", "Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2024,
        totalStudentsEligible: 900,
        studentsPlaced: 792,
        placementPercentage: 88.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 850,
        studentsPlaced: 748,
        placementPercentage: 88.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "usr-rajahmundry",
    code: "USHA",
    name: "Usha Rama College of Engineering and Technology",
    shortName: "Usha Rama Vijayawada",
    location: "Telaprolu, NTR District",
    district: "NTR / Krishna",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "URCE",
    officialWebsite: "https://www.usharama.edu.in",
    annualFeeRange: "₹58,000 - ₹78,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Autonomous college on NH-16 near Vijayawada featuring active Industry Institute Partnership Cell (IIPC).",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 550,
        studentsPlaced: 462,
        placementPercentage: 84.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 500,
        studentsPlaced: 420,
        placementPercentage: 84.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.5,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "ideal-kakinada",
    code: "IDEL",
    name: "Ideal Institute of Technology",
    shortName: "Ideal Kakinada",
    location: "Kakinada",
    district: "Kakinada",
    type: "Private",
    establishedYear: 2009,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "IDEL",
    officialWebsite: "https://www.idealtech.edu.in",
    annualFeeRange: "₹48,000 - ₹65,000",
    coursesOffered: ["CSE", "ECE", "EEE", "MEC", "CIV"],
    description: "Affordable engineering college located in Kakinada city focusing on foundational technical skill training.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 300,
        studentsPlaced: 240,
        placementPercentage: 80.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.4,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 280,
        studentsPlaced: 224,
        placementPercentage: 80.0,
        highestPackageLPA: 13.0,
        averagePackageLPA: 4.0,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 250,
        studentsPlaced: 200,
        placementPercentage: 80.0,
        highestPackageLPA: 11.0,
        averagePackageLPA: 3.8,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "anurag-vijayawada",
    code: "ANUR",
    name: "Amrita Sai Institute of Science and Technology",
    shortName: "Amrita Sai Paritala",
    location: "Paritala, NTR District",
    district: "NTR / Krishna",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "ASIT",
    officialWebsite: "https://amritasai.org.in",
    annualFeeRange: "₹55,000 - ₹75,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Autonomous college near Vijayawada with specialized CS & Electronics laboratories and placement bootcamps.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 500,
        studentsPlaced: 420,
        placementPercentage: 84.0,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 17.5,
        averagePackageLPA: 4.8,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 336,
        placementPercentage: 84.0,
        highestPackageLPA: 14.5,
        averagePackageLPA: 4.4,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "gites-guntur",
    code: "GITE",
    name: "Vignan's Lara Institute of Technology & Science",
    shortName: "Vignan Lara Vadlamudi",
    location: "Vadlamudi, Guntur",
    district: "Guntur",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A+",
    nirfRank: "Band 151-200",
    eamcetCode: "VLIS",
    officialWebsite: "https://www.vignanlara.org",
    annualFeeRange: "₹68,000 - ₹88,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC"],
    description: "Top autonomous engineering college under Vignan banner providing 90%+ placement rates for IT streams.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 900,
        studentsPlaced: 810,
        placementPercentage: 90.0,
        highestPackageLPA: 33.0,
        averagePackageLPA: 6.5,
        topRecruiters: ["TCS Ninja", "Infosys", "Cognizant", "Wipro", "Accenture", "Virtusa", "Mindtree"]
      },
      {
        year: 2024,
        totalStudentsEligible: 850,
        studentsPlaced: 765,
        placementPercentage: 90.0,
        highestPackageLPA: 29.0,
        averagePackageLPA: 6.1,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Hexaware", "Modak"]
      },
      {
        year: 2023,
        totalStudentsEligible: 800,
        studentsPlaced: 720,
        placementPercentage: 90.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "st-ann-chirala",
    code: "SAC",
    name: "St. Ann's College of Engineering & Technology",
    shortName: "St Anns Chirala",
    location: "Chirala, Bapatla District",
    district: "Bapatla / Prakasam",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "SACET",
    officialWebsite: "https://sacet.ac.in",
    annualFeeRange: "₹58,000 - ₹78,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Established autonomous college in coastal AP providing high disciplined training and corporate placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 600,
        studentsPlaced: 504,
        placementPercentage: 84.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 550,
        studentsPlaced: 462,
        placementPercentage: 84.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 500,
        studentsPlaced: 420,
        placementPercentage: 84.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.5,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "siddharth-puttur",
    code: "SIDE",
    name: "Siddharth Institute of Engineering & Technology",
    shortName: "Siddharth Puttur",
    location: "Puttur, Tirupati District",
    district: "Tirupati / Chittoor",
    type: "Autonomous",
    establishedYear: 2001,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "SIET",
    officialWebsite: "https://siddharthgroup.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "MEC", "CIV", "AGE"],
    description: "Major autonomous educational hub in Chittoor district offering Agriculture Engineering alongside CSE & AI.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 1100,
        studentsPlaced: 946,
        placementPercentage: 86.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.0,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 1000,
        studentsPlaced: 860,
        placementPercentage: 86.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.6,
        topRecruiters: ["Mindtree", "Virtusa", "Hexaware", "L&T"]
      },
      {
        year: 2023,
        totalStudentsEligible: 900,
        studentsPlaced: 774,
        placementPercentage: 86.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["Infosys", "Mphasis", "Syntel", "NTT Data"]
      }
    ]
  },
  {
    id: "grec-kurnool",
    code: "GTEC",
    name: "Ravindra College of Engineering for Women",
    shortName: "Ravindra Women Kurnool",
    location: "Kurnool",
    district: "Kurnool",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "RCEW",
    officialWebsite: "https://www.recw.ac.in",
    annualFeeRange: "₹58,000 - ₹76,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE"],
    description: "Women's engineering college in Kurnool managed by G. Pulla Reddy Educational Trust with high software placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 400,
        studentsPlaced: 352,
        placementPercentage: 88.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 380,
        studentsPlaced: 334,
        placementPercentage: 87.8,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Capgemini", "Tech Mahindra", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 350,
        studentsPlaced: 308,
        placementPercentage: 88.0,
        highestPackageLPA: 17.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "santhan-kadapa",
    code: "KORM",
    name: "KSRM College of Engineering",
    shortName: "KSRM Kadapa",
    location: "Yerramasupalli, Kadapa",
    district: "YSR Kadapa",
    type: "Autonomous",
    establishedYear: 1980,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "KSRM",
    officialWebsite: "https://ksrmce.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "MEC", "CIV"],
    description: "Pioneer engineering institution in YSR Kadapa district with expansive labs and GATE performance.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 650,
        studentsPlaced: 552,
        placementPercentage: 85.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra", "L&T"]
      },
      {
        year: 2024,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Accenture", "Capgemini", "Mindtree", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 550,
        studentsPlaced: 467,
        placementPercentage: 84.9,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "aits-rajampet",
    code: "AITS",
    name: "Annamacharya Institute of Technology and Sciences",
    shortName: "AITS Rajampet",
    location: "Boyanapalli, Rajampet",
    district: "Annamayya / Kadapa",
    type: "Autonomous",
    establishedYear: 1998,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "AITS",
    officialWebsite: "https://aitsrajampet.ac.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "CSD", "INF", "ECE", "EEE", "MEC", "CIV"],
    description: "Leading autonomous institute in Annamayya district with IBM CoE and high placement conversion numbers.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 731,
        placementPercentage: 86.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 5.9,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini"]
      },
      {
        year: 2024,
        totalStudentsEligible: 800,
        studentsPlaced: 688,
        placementPercentage: 86.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.5,
        topRecruiters: ["Mindtree", "Tech Mahindra", "Hexaware", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 750,
        studentsPlaced: 645,
        placementPercentage: 86.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.1,
        topRecruiters: ["Infosys", "LTI", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "aits-tirupati",
    code: "AITST",
    name: "Annamacharya Institute of Technology and Sciences, Tirupati",
    shortName: "AITS Tirupati",
    location: "Venkatapathipalli, Tirupati",
    district: "Tirupati",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A",
    nirfRank: "Band 201-250",
    eamcetCode: "AITT",
    officialWebsite: "https://aits-tirupati.ac.in",
    annualFeeRange: "₹60,000 - ₹80,000",
    coursesOffered: ["CSE", "CSM", "CSD", "ECE", "EEE", "CIV"],
    description: "Autonomous college in Tirupati offering modern CS specializations and active campus recruitment.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 600,
        studentsPlaced: 510,
        placementPercentage: 85.0,
        highestPackageLPA: 25.0,
        averagePackageLPA: 5.7,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 550,
        studentsPlaced: 467,
        placementPercentage: 84.9,
        highestPackageLPA: 21.0,
        averagePackageLPA: 5.3,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 500,
        studentsPlaced: 425,
        placementPercentage: 85.0,
        highestPackageLPA: 18.0,
        averagePackageLPA: 4.9,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data"]
      }
    ]
  },
  {
    id: "alits-anantapur",
    code: "ALIT",
    name: "ALTS - Anantha Lakshmi Institute of Technology & Sciences",
    shortName: "ALITS Anantapur",
    location: "Near ITI, Anantapur",
    district: "Anantapur",
    type: "Private",
    establishedYear: 2008,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "ALTS",
    officialWebsite: "https://alits.ac.in",
    annualFeeRange: "₹52,000 - ₹70,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Growing technical institute in Anantapur providing coding skills development and placement assistance.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 450,
        studentsPlaced: 378,
        placementPercentage: 84.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 400,
        studentsPlaced: 336,
        placementPercentage: 84.0,
        highestPackageLPA: 17.0,
        averagePackageLPA: 4.8,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 350,
        studentsPlaced: 294,
        placementPercentage: 84.0,
        highestPackageLPA: 14.0,
        averagePackageLPA: 4.4,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  },
  {
    id: "bapatla-bapatla",
    code: "BECB",
    name: "Bapatla Engineering College",
    shortName: "Bapatla Engg College",
    location: "Bapatla",
    district: "Bapatla",
    type: "Autonomous",
    establishedYear: 1981,
    naacRating: "A",
    nirfRank: "Band 151-200",
    eamcetCode: "BECB",
    officialWebsite: "https://becbapatla.ac.in",
    annualFeeRange: "₹65,000 - ₹85,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE", "EEE", "MEC", "CIV", "CHE"],
    description: "Historic autonomous engineering college in coastal Bapatla producing thousands of successful software and core engineers.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 850,
        studentsPlaced: 739,
        placementPercentage: 87.0,
        highestPackageLPA: 30.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Accenture", "Capgemini", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 800,
        studentsPlaced: 696,
        placementPercentage: 87.0,
        highestPackageLPA: 26.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Mindtree", "Virtusa", "Hexaware", "L&T"]
      },
      {
        year: 2023,
        totalStudentsEligible: 750,
        studentsPlaced: 652,
        placementPercentage: 86.9,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "Mphasis", "NTT Data", "Syntel"]
      }
    ]
  },
  {
    id: "nrion-guntur",
    code: "NRIA",
    name: "NRI Institute of Technology, Guntur",
    shortName: "NRI Guntur",
    location: "Perecherla, Guntur",
    district: "Guntur",
    type: "Private",
    establishedYear: 2008,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "NRIG",
    officialWebsite: "https://nriguntur.ac.in",
    annualFeeRange: "₹50,000 - ₹68,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Private engineering college in Guntur focusing on affordable education and basic IT recruitment.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 350,
        studentsPlaced: 280,
        placementPercentage: 80.0,
        highestPackageLPA: 16.0,
        averagePackageLPA: 4.6,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 320,
        studentsPlaced: 256,
        placementPercentage: 80.0,
        highestPackageLPA: 14.0,
        averagePackageLPA: 4.2,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 300,
        studentsPlaced: 240,
        placementPercentage: 80.0,
        highestPackageLPA: 12.0,
        averagePackageLPA: 3.9,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "srikrupa-srikakulam",
    code: "SKSP",
    name: "Sri Sivani College of Engineering",
    shortName: "Sri Sivani Srikakulam",
    location: "Chilakapalem, Srikakulam",
    district: "Srikakulam",
    type: "Private",
    establishedYear: 2006,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "SSSK",
    officialWebsite: "https://srisivani.in",
    annualFeeRange: "₹48,000 - ₹65,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Established private college in Srikakulam district offering technical skill training and placement support.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 300,
        studentsPlaced: 240,
        placementPercentage: 80.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.5,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 280,
        studentsPlaced: 224,
        placementPercentage: 80.0,
        highestPackageLPA: 13.0,
        averagePackageLPA: 4.1,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 250,
        studentsPlaced: 200,
        placementPercentage: 80.0,
        highestPackageLPA: 11.0,
        averagePackageLPA: 3.8,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "vignans-vignan-vizag",
    code: "VITW",
    name: "Vignan's Institute of Information Technology for Women",
    shortName: "Vignan Women Vizag",
    location: "Visakhapatnam",
    district: "Visakhapatnam",
    type: "Autonomous",
    establishedYear: 2008,
    naacRating: "A+",
    nirfRank: "Band 201-250",
    eamcetCode: "VIW",
    officialWebsite: "https://vignanview.ac.in",
    annualFeeRange: "₹62,000 - ₹82,000",
    coursesOffered: ["CSE", "CSM", "INF", "ECE"],
    description: "Exclusive women's engineering campus under Vignan trust providing high IT placements.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 450,
        studentsPlaced: 405,
        placementPercentage: 90.0,
        highestPackageLPA: 28.0,
        averagePackageLPA: 6.2,
        topRecruiters: ["Amazon", "TCS", "Infosys", "Cognizant", "Accenture"]
      },
      {
        year: 2024,
        totalStudentsEligible: 420,
        studentsPlaced: 378,
        placementPercentage: 90.0,
        highestPackageLPA: 24.0,
        averagePackageLPA: 5.8,
        topRecruiters: ["Wipro", "Capgemini", "Mindtree"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 360,
        placementPercentage: 90.0,
        highestPackageLPA: 20.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["Infosys", "Hexaware", "Virtusa"]
      }
    ]
  },
  {
    id: "st-johns-kurnool",
    code: "STJN",
    name: "St. Johns College of Engineering and Technology",
    shortName: "St Johns Yemmiganur",
    location: "Yemmiganur, Kurnool",
    district: "Kurnool",
    type: "Private",
    establishedYear: 2001,
    naacRating: "B++",
    nirfRank: "Not Listed",
    eamcetCode: "SJCE",
    officialWebsite: "https://sjcet.ac.in",
    annualFeeRange: "₹48,000 - ₹65,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Affordable private college in Yemmiganur area focusing on technical education and placement bootcamps.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 300,
        studentsPlaced: 240,
        placementPercentage: 80.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.4,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 280,
        studentsPlaced: 224,
        placementPercentage: 80.0,
        highestPackageLPA: 13.0,
        averagePackageLPA: 4.0,
        topRecruiters: ["Wipro", "Accenture", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 250,
        studentsPlaced: 200,
        placementPercentage: 80.0,
        highestPackageLPA: 11.0,
        averagePackageLPA: 3.7,
        topRecruiters: ["Infosys", "Syntel", "Mphasis"]
      }
    ]
  },
  {
    id: "sva-tirupati",
    code: "SVAI",
    name: "Sri Venkateswara College of Engineering, Kadapa",
    shortName: "SVCE Kadapa",
    location: "Karakambadi, Kadapa",
    district: "YSR Kadapa",
    type: "Autonomous",
    establishedYear: 2007,
    naacRating: "A",
    nirfRank: "Not Listed",
    eamcetCode: "SVCK",
    officialWebsite: "https://svck.edu.in",
    annualFeeRange: "₹58,000 - ₹78,000",
    coursesOffered: ["CSE", "CSM", "ECE", "EEE", "CIV"],
    description: "Autonomous college in Kadapa region providing hands-on lab training and software campus placement drives.",
    placements: [
      {
        year: 2025,
        totalStudentsEligible: 500,
        studentsPlaced: 425,
        placementPercentage: 85.0,
        highestPackageLPA: 22.0,
        averagePackageLPA: 5.4,
        topRecruiters: ["TCS", "Infosys", "Cognizant", "Wipro", "Tech Mahindra"]
      },
      {
        year: 2024,
        totalStudentsEligible: 450,
        studentsPlaced: 382,
        placementPercentage: 84.9,
        highestPackageLPA: 18.0,
        averagePackageLPA: 5.0,
        topRecruiters: ["Accenture", "Capgemini", "Virtusa"]
      },
      {
        year: 2023,
        totalStudentsEligible: 400,
        studentsPlaced: 340,
        placementPercentage: 85.0,
        highestPackageLPA: 15.0,
        averagePackageLPA: 4.6,
        topRecruiters: ["Infosys", "Mphasis", "Syntel"]
      }
    ]
  }
];

// Helper to get unique districts in AP dataset
export const AP_DISTRICTS = Array.from(new Set(AP_TOP_COLLEGES_DATABASE.map(c => c.district))).sort();
