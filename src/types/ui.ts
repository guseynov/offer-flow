export type TableDensity = "comfortable" | "compact";

export type DashboardUiState = {
  tableDensity: TableDensity;
  setTableDensity: (density: TableDensity) => void;
};

export type DensityOption = {
  value: TableDensity;
  label: string;
};
