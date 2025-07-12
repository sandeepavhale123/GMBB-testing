import { CreateReportRequest, Report } from '../types/reportTypes';

// Mock data for development
const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Performance Report',
    type: 'Individual',
    reportSections: [
      { id: 'insights', name: 'Insight Section', enabled: true },
      { id: 'reviews', name: 'Review Section', enabled: true },
      { id: 'posts', name: 'Post Section', enabled: false },
    ],
    dateRange: {
      from: new Date('2024-10-10'),
      to: new Date('2024-11-10'),
    },
    createdAt: '2024-11-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Quarterly Comparison',
    type: 'Compare',
    reportSections: [
      { id: 'insights', name: 'Insight Section', enabled: true },
      { id: 'geo-ranking', name: 'GEO Ranking Section', enabled: true },
    ],
    dateRange: {
      period1: {
        from: new Date('2024-07-01'),
        to: new Date('2024-09-30'),
      },
      period2: {
        from: new Date('2024-10-01'),
        to: new Date('2024-12-31'),
      },
    },
    createdAt: '2024-11-20T14:20:00Z',
    status: 'completed',
  },
];

export const reportsApi = {
  getReports: async (listingId: string): Promise<Report[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReports;
  },

  createReport: async (data: CreateReportRequest): Promise<Report> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${data.type} Report`,
      type: data.type,
      reportSections: data.sections.map(sectionId => ({
        id: sectionId,
        name: sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + ' Section',
        enabled: true,
      })),
      dateRange: data.dateRange,
      createdAt: new Date().toISOString(),
      status: 'generating',
    };

    return newReport;
  },

  getReport: async (reportId: string): Promise<Report | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockReports.find(report => report.id === reportId) || null;
  },
};