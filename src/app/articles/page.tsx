import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { Card } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import ArticleSearchInput from "@/components/articles/article-search-input";
import AllArticlesPageSkeleton from "@/app/articles/all-articles-page-skeleton"; // Corrected Import
import { AllArticlesPage } from "@/components/articles/all-articles-page";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 3; // Number of items per page

const page: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { search = "", page = "1" } = await searchParams;
  const currentPage = Number(page);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(search, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            All Articles
          </h1>
          <Suspense>
            <ArticleSearchInput />
          </Suspense>
        </div>
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>
        <div className="mt-12 flex justify-center gap-2">
          <Link href={`?search=${search}&page=${currentPage - 1}`} passHref>
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Prev
            </Button>
          </Link>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              href={`?search=${search}&page=${index + 1}`}
              passHref
            >
              <Button
                variant={currentPage === index + 1 ? "destructive" : "ghost"}
                size="sm"
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            </Link>
          ))}

          <Link href={`?search=${search}&page=${currentPage + 1}`} passHref>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages}>
              Next →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default page;
