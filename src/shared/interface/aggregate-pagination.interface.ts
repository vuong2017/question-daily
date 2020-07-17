export interface Options {
    page: number,
    limit: number,
    sort?: Sort,
    customLabels?: CustomLabels,
    allowDiskUse?: boolean,
}

interface Sort {
    field: string,
    test: number
}

interface CustomLabels {
    totalDocs?: string,
    docs?: string,
    limit?: string,
    page?: string,
    nextPage?: string,
    prevPage?: string,
    totalPages?: string,
    hasPrevPage?: string,
    hasNextPage?: string,
    pagingCounter?: string
}
