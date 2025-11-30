## Project Overview

This is a stylish, modern blog built using Next.js, TypeScript, and Tailwind CSS. The project follows the App Router paradigm and is designed to be statically generated (SSG), making it highly performant and SEO-friendly.

The core feature is a blog that sources its content from local MDX files stored in the `content/posts` directory. A "liquid glass" aesthetic is implemented throughout the UI, using custom components and Tailwind CSS.

### Key Technologies

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with PostCSS. It includes the `@tailwindcss/typography` plugin for styling rendered Markdown content.
- **Content:** MDX (via `next-mdx-remote` and `gray-matter`) for blog posts.
- **UI Components:** A mix of custom components (like `GlassCard`, `GlassButton`) and icons from `lucide-react`.

## Building and Running

This project uses `pnpm` as its package manager.

### Development

To run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application. The page will auto-update as you edit the files.

### Building for Production

To create an optimized production build:

```bash
pnpm build
```

The output will be in the `.next` directory. The build process statically generates all blog post pages for optimal performance.

### Running Production Server

To start the production server after building:

```bash
pnpm start
```

### Linting

To run the ESLint checker for code quality:

```bash
pnpm lint
```

## Development Conventions

### Project Structure

- **`src/app/`**: Contains the main application routes, following the Next.js App Router structure.
    - **`src/app/page.tsx`**: The home page.
    - **`src/app/blog/page.tsx`**: The page that lists all blog posts.
    - **`src/app/blog/[slug]/page.tsx`**: The dynamic route template for displaying a single blog post.
- **`src/components/`**: Contains reusable React components.
    - **`src/components/ui/`**: Holds general-purpose UI elements like `GlassCard.tsx` and `Navbar.tsx`.
- **`src/lib/`**: Contains library and helper functions.
    - **`src/lib/mdx.ts`**: The core logic for reading and parsing MDX files from the filesystem. It uses `gray-matter` to extract frontmatter (metadata) from posts.
- **`content/posts/`**: The source for all blog content. Each `.mdx` file in this directory is treated as a separate blog post.

### Creating a New Post

1.  Create a new `.mdx` file inside the `content/posts/` directory (e.g., `my-new-post.mdx`).
2.  Add frontmatter to the top of the file:

    ```mdx
    ---
    title: "My New Post Title"
    date: "2025-11-26"
    description: "A short and compelling description of the post."
    ---

    Your post content, written in Markdown or MDX, goes here.
    ```
3.  The new post will automatically appear on the blog list page when you run the application.
