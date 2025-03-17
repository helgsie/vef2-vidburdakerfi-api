export declare const signup: (email: string, name: string, password: string) => Promise<{
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
    createdAt: Date;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: {
        id: number;
        email: string;
        name: string;
        isAdmin: boolean;
    };
    token: string;
}>;
