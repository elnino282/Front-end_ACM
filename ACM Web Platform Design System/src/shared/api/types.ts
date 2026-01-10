import { z, ZodType } from 'zod';

// ═══════════════════════════════════════════════════════════════
// STANDARD API RESPONSE WRAPPER
// All endpoints return responses wrapped in ApiResponse<T>
// ═══════════════════════════════════════════════════════════════

export const ApiResponseSchema = <T extends ZodType>(resultSchema: T) =>
    z.object({
        status: z.number(),
        code: z.string(),
        message: z.string(),
        result: resultSchema,
    });

export type ApiResponse<T> = {
    status: number;
    code: string;
    message: string;
    result: T;
};

// ═══════════════════════════════════════════════════════════════
// PAGINATED RESPONSE STRUCTURE
// For paginated endpoints, result contains PageResponse<T>
// ═══════════════════════════════════════════════════════════════

export const PageResponseSchema = <T extends ZodType>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        page: z.number().int(),
        size: z.number().int(),
        totalElements: z.number().int(),
        totalPages: z.number().int(),
    });

export type PageResponse<T> = {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

// ═══════════════════════════════════════════════════════════════
// RESPONSE PARSING HELPERS
// Use these to parse API responses with Zod validation
// ═══════════════════════════════════════════════════════════════

/**
 * Parse an API response and extract the result with Zod validation.
 * @param data - Raw response data from axios
 * @param resultSchema - Zod schema for the result type
 * @returns Validated result of type T
 */
export function parseApiResponse<T extends ZodType>(
    data: unknown,
    resultSchema: T
): z.infer<T> {
    const schema = z.object({
        status: z.number(),
        code: z.string(),
        message: z.string(),
        result: resultSchema,
    });
    const parsed = schema.parse(data);
    return parsed.result;
}

/**
 * Parse a paginated API response and extract the page result with Zod validation.
 * @param data - Raw response data from axios
 * @param itemSchema - Zod schema for each item in the page
 * @returns Validated PageResponse with items of the inferred type
 */
export function parsePageResponse<T extends ZodType>(
    data: unknown,
    itemSchema: T
): PageResponse<z.infer<T>> {
    const pageSchema = z.object({
        items: z.array(itemSchema),
        page: z.number().int(),
        size: z.number().int(),
        totalElements: z.number().int(),
        totalPages: z.number().int(),
    });
    const schema = z.object({
        status: z.number(),
        code: z.string(),
        message: z.string(),
        result: pageSchema,
    });
    const parsed = schema.parse(data);
    return parsed.result as PageResponse<z.infer<T>>;
}

// ═══════════════════════════════════════════════════════════════
// COMMON PAGINATION PARAMS
// ═══════════════════════════════════════════════════════════════

export const PaginationParamsSchema = z.object({
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// COMMON DATE FORMATS
// ═══════════════════════════════════════════════════════════════

/** ISO date format: yyyy-MM-dd */
export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in yyyy-MM-dd format',
});

/** ISO datetime format: yyyy-MM-ddTHH:mm:ss */
export const DateTimeSchema = z.string().regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    { message: 'DateTime must be in yyyy-MM-ddTHH:mm:ss format' }
);
