// Buyer API Service
// Note: Most buyer functionality is now in FSD entities:
// - Reports: @/entities/report (useReports, useReportById)
// - AI Q&A: @/entities/ai (useAiQa)

// Re-export from entities for backward compatibility
export { reportApi, useReports, useReportById } from '@/entities/report';
export { aiApi, useAiQa } from '@/entities/ai';
