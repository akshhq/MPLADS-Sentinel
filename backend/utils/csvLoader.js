const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function getDatasetsDirectory() {
  const candidatePaths = [
    path.join(__dirname, "../../frontend/Data/Datasets"),
    path.join(__dirname, "../frontend/Data/Datasets"),
    path.join(__dirname, "../Data/Datasets"),
    path.join(__dirname, "../../Data/Datasets"),
    path.join(process.cwd(), "frontend/Data/Datasets"),
    path.join(process.cwd(), "Data/Datasets"),
    path.join(process.cwd(), "../frontend/Data/Datasets"),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.join(__dirname, "../../frontend/Data/Datasets");
}

const DATASETS_DIR = getDatasetsDirectory();

/**
 * Loads a CSV file from Data/Datasets and returns parsed rows
 */
function loadCSVFile(filename, limit = 1000) {
  return new Promise((resolve) => {
    const dir = getDatasetsDirectory();
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[CSVLoader] File not found: ${filePath}`);
      return resolve([]);
    }

    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (rows.length < limit) {
          rows.push(data);
        }
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (err) => {
        console.error(`[CSVLoader] Error reading ${filename}:`, err.message);
        resolve([]);
      });
  });
}

/**
 * Lists all available dataset files with row counts
 */
function getAvailableDatasetsMeta() {
  const dir = getDatasetsDirectory();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  return files.map((filename, idx) => {
    const filePath = path.join(dir, filename);
    const stats = fs.statSync(filePath);
    const name = filename.replace(".csv", "");
    const house = filename.includes("Rajya Sabha") ? "Rajya Sabha" : "Lok Sabha";

    let category = "General";
    if (name.includes("Recommended")) category = "Works Recommended";
    else if (name.includes("Sanctioned")) category = "Works Sanctioned";
    else if (name.includes("Completed")) category = "Works Completed";
    else if (name.includes("Expenditure")) category = "Expenditure & Disbursements";
    else if (name.includes("Allocated Limit")) category = "Allocated Limits";
    else if (name.includes("Calamity")) category = "Calamity Consents";

    return {
      id: `DS-${String(idx + 1).padStart(2, "0")}`,
      filename,
      name,
      house,
      category,
      fileSizeKb: Math.round(stats.size / 1024),
      sourceOfficialName: "eSAKSHI & MoSPI Official Registry",
    };
  });
}

module.exports = {
  loadCSVFile,
  getAvailableDatasetsMeta,
  DATASETS_DIR,
};
