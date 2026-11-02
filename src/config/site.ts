export const siteConfig = {
    name: "BookNook",
    description:
        "A little corner for every book lover.",
    url: "",
    navigation: [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "All Books",
            href: "/books",
        },
        {
            label: "Add Book",
            href: "/add-book",
            private: true,
        },
        {
            label: "My Books",
            href: "/my-books",
            private: true,
        },
        {
            label: "My Borrows",
            href: "/my-borrows",
            private: true,
        },
    ],
};

export const bookCategories = [
    "Fiction",
    "Science",
    "History",
    "Kids",
    "Others",
] as const;