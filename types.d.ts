type WorkPosition = {
    id: string;
    title: string;
    description: string;
    status: string;
    criterias: Criteria[]
    resumes: Resume[]
}

type Criteria = {
    id: string;
    description: string;
    createdAt: string;
}

type Resume = {
    id: string;
    title: string;
    path: string;
    score: number | null;
    createdAt: string;
}

type WorkPositionFormData = {
    title: string;
    description: string;
}

type PaginatedResponse<T> = {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

type LoginFormData = {
    email: string
    password: string
}

type ApiError = {
    message: string;
}