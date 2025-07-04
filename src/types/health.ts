export interface HealthMetric {
  id: string;
  label: string;
  value: string | number;
  status: "complete" | "pending" | "error";
  tooltip: string;
  icon?: string;
}

export interface HealthSection {
  id: string;
  title: string;
  percentage: number;
  items: HealthMetric[];
}

export interface ChartDataItem {
  name: string;
  count: number;
  views: number;
  fill: string;
}
export interface GroupedMetric {
  label: string;
  items: HealthMetric[];
}

export interface CommunicationSection {
  id: string;
  title: string;
  percentage: number;
  items: GroupedMetric | GroupedMetric[]; // handle both object and array
}

export interface HealthData {
  healthScore: number;
  reviews: { current: number; total: number };
  questionsAnswers: { questions: number; answers: number };
  avgRating: number;
  gmbPhotos: number;
  gmbPosts: number;
  sections: HealthSection[];
  communication: CommunicationSection | CommunicationSection[];
  chartData: ChartDataItem[];
}
