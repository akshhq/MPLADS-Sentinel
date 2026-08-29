const path = require("path");
const fs = require("fs");
const { loadCSVFile, getAvailableDatasetsMeta, DATASETS_DIR } = require("../utils/csvLoader");

// GET /api/datasets
exports.getDatasets = async (req, res) => {
  try {
    const metaList = getAvailableDatasetsMeta();

    const formatted = await Promise.all(
      metaList.map(async (meta) => {
        const sampleRows = await loadCSVFile(meta.filename, 5);
        const columns =
          sampleRows.length > 0
            ? Object.keys(sampleRows[0]).map((colKey) => ({
                key: colKey,
                label: colKey,
                dataType:
                  colKey.toLowerCase().includes("amount") || colKey.toLowerCase().includes("cost") || colKey.toLowerCase().includes("expenditure")
                    ? "currency"
                    : colKey.toLowerCase().includes("date")
                    ? "date"
                    : "string",
              }))
            : [];

        return {
          id: meta.id,
          filename: meta.filename,
          name: meta.name,
          category: meta.category,
          sourceOfficialName: meta.sourceOfficialName,
          description: `Official dataset containing live administrative and treasury records for ${meta.house}.`,
          totalRows: meta.fileSizeKb > 500 ? 5000 : 500, // estimated
          fileSizeKb: meta.fileSizeKb,
          lastSyncedAt: new Date().toISOString(),
          columns,
          sampleRows,
        };
      })
    );

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/datasets/:id
exports.getDatasetById = async (req, res) => {
  try {
    const { id } = req.params;
    const { search, page = 1, limit = 50 } = req.query;

    const metaList = getAvailableDatasetsMeta();
    const meta = metaList.find((m) => m.id === id || m.filename.toLowerCase() === id.toLowerCase());

    if (!meta) {
      return res.status(404).json({ success: false, message: `Dataset ${id} not found.` });
    }

    const allRows = await loadCSVFile(meta.filename, 5000);
    let filtered = allRows;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(q))
      );
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedRows = filtered.slice(startIndex, startIndex + limitNum);

    const columns =
      allRows.length > 0
        ? Object.keys(allRows[0]).map((colKey) => ({
            key: colKey,
            label: colKey,
            dataType:
              colKey.toLowerCase().includes("amount") || colKey.toLowerCase().includes("cost") || colKey.toLowerCase().includes("expenditure")
                ? "currency"
                : colKey.toLowerCase().includes("date")
                ? "date"
                : "string",
          }))
        : [];

    res.json({
      success: true,
      data: {
        id: meta.id,
        name: meta.name,
        category: meta.category,
        sourceOfficialName: meta.sourceOfficialName,
        description: `Official dataset containing live administrative and treasury records for ${meta.name}.`,
        totalRows: filtered.length,
        fileSizeKb: meta.fileSizeKb,
        columns,
        sampleRows: paginatedRows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filtered.length / limitNum) || 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
