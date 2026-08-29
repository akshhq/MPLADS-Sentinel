export interface GroundDataset {
  id: string;
  name: string;
  category: "recommended" | "sanctioned" | "completed" | "expenditure" | "allocations" | "calamity";
  description: string;
  house: "Lok Sabha" | "Rajya Sabha" | "Combined";
  totalRows: number;
  columnsCount: number;
  lastIngestedAt: string;
  sourceOfficialName: string;
  sampleRows: Record<string, string | number>[];
  columns: {
    key: string;
    label: string;
    dataType: "string" | "number" | "date" | "currency";
  }[];
}
