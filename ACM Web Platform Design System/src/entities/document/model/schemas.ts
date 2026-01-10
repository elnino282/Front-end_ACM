import { z } from 'zod';

// Document API schema (matches backend DocumentResponse)
export const DocumentSchema = z.object({
    documentId: z.number().int().positive(),
    title: z.string(),
    url: z.string(),
    description: z.string().optional().nullable(),
    crop: z.string().optional().nullable(),
    stage: z.string().optional().nullable(),
    topic: z.string().optional().nullable(),
    isActive: z.boolean().optional().nullable(),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    isFavorited: z.boolean().optional().nullable(),
});

export type Document = z.infer<typeof DocumentSchema>;

// Paginated response schema
export const DocumentPageResponseSchema = z.object({
    items: z.array(DocumentSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
});

export type DocumentPageResponse = z.infer<typeof DocumentPageResponseSchema>;

// Filter params for list request
export interface DocumentListParams {
    tab?: 'all' | 'favorites' | 'recent';
    q?: string;
    crop?: string;
    stage?: string;
    topic?: string;
    page?: number;
    size?: number;
}
