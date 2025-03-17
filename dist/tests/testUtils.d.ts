export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        isAdmin: boolean;
    };
}
export declare const loginAsAdmin: () => Promise<LoginResponse>;
export declare const loginAsUser: () => Promise<LoginResponse>;
export declare const createTestEvent: (adminToken: string) => Promise<any>;
