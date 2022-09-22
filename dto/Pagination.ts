import "source-map-support/register";

export interface Pagination {
    limit?: number | undefined;
    cursor?: string | undefined;
}

export interface PaginationResult<T> {
    totalCount: number | undefined;
    nextCursor?: string | undefined;
    records: T[] | undefined;
}