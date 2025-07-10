import React from "react";
import getDataInstance, { getArticle, readFile } from "@/config/data";
import Path from "path";
import { notFound } from "next/navigation";
import Article from "@/app/post/[slug]/article";
import { ArticleList } from "@/config/entity";
import { Metadata } from "next";
import { SiteName } from "@/config";

export const revalidate = 0;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const db = getDataInstance();
	const id = (await params).slug;
	if (db.index[id] === undefined) {
		notFound();
	}
	const article = getArticle(id)!;
	return {
		title: article.title + " - " + SiteName,
		description: article.summary,
		keywords: article.key,
	};
}

export default async function PostDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const db = getDataInstance();
	const id = (await params).slug;
	if (db.index[id] === undefined) {
		notFound();
	}
	const index = db.index[id];
	const article = getArticle(id)!;
	const path = Path.join(process.cwd(), "data", "build", "html", id + ".html");
	const html = readFile(path);
	const recommend_id = db.recommend!.article[id];
	const recommend: ArticleList = [];
	for (const id of recommend_id) {
		recommend.push(getArticle(id)!);
	}
	const before = index === 0 ? null : db.data[index - 1];
	const after = index === db.data.length - 1 ? null : db.data[index + 1];
	return (
		<Article data={article} before={before} after={after} recommend={recommend}>
			<div
				dangerouslySetInnerHTML={{ __html: html }}
				className={"md-typeset"}
			></div>
		</Article>
	);
}
