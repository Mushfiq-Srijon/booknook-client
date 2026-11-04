export type BookCategory =
    | "Fiction"
    | "Science"
    | "History"
    | "Kids"
    | "Others";

export interface Book {
    _id: string;
    title: string;
    author: string;
    category: BookCategory;
    imageUrl: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
    addedBy: {
        userId: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt?: string;
}