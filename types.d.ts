type WorkPosition = {
    id: string;
    title: string;
    description: string;
    status: string;
    criterias: Criteria[]
    resumes: Resume[]
}

type BalanceHistory = {
    id: string;
    amount: number;
    createdAt: string;
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
    explanation: string
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

type RegisterFormData = {
    email: string
    password: string
    name: string
}

type VerifyFormData = {
    verificationId: string | null
    verificationCode: string
}

type VerificationCodeFormData = {
    verificationId: string | null
}

type ForgetPasswordFormData = {
    email: string
}

type ResetPasswordFormData = {
    verificationId: string | null
    verificationCode: string
    newPassword: string
}

type RefreshTokenFormData = {
    email: string
    password: string
    name: string
}

type ApiError = {
    message: string;
    statusCode: number;
}

type ChangePasswordFormData = {
    oldPassword: string
    newPassword: string
}