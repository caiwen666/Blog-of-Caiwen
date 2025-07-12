import getDataInstance, { getArticle } from "@/config/data";
import { ArticleDTO } from "@shared/entity";
import { omitFields } from "@/utils";
import { NextRequest } from "next/server";

export const revalidate = 0;

export function GET(req: NextRequest | Request) {
	const url = new URL(req.url!);
	const searchParams = new URLSearchParams(url.search);

	const status = searchParams.get("status");
	if (status === null || !["published", "draft", "discard"].includes(status)) {
		return new Response("Bad Request", { status: 400 });
	}

	let lim: string | null | number = searchParams.get("lim");
	if (lim === null) {
		lim = 6;
	} else {
		lim = parseInt(lim);
		if (isNaN(lim)) {
			return new Response("Bad Request", { status: 400 });
		}
	}

	let page: string | null | number = searchParams.get("page");
	if (page === null) {
		page = 1;
	} else {
		page = parseInt(page);
		if (isNaN(page)) {
			return new Response("Bad Request", { status: 400 });
		}
	}

	const articleList: ArticleDTO[] = [];
	const db = getDataInstance();
	const list =
		status === "published"
			? db.home
			: status === "draft"
				? db.draft
				: db.discard;
	const start = (page - 1) * lim;
	const end = start + lim;
	for (let i = start; i < end && i < list.length; i++) {
		const article: ArticleDTO = omitFields(getArticle(list[i])!, ["content"]);
		articleList.push(article);
	}

	return new Response(JSON.stringify(articleList), { status: 200 });
}
