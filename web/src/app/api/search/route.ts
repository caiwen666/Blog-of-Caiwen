import { getSearchClient } from "@/config/data";
import { SearchDTO, SearchResponse } from "@shared/entity";
import { NextRequest } from "next/server";

export const revalidate = 0;
const ITEMS_LIMIT = 10;

export async function GET(req: NextRequest | Request) {
	const url = new URL(req.url!);
	const searchParams = new URLSearchParams(url.search);
	const query = searchParams.get("q");
	if (query === null) {
		return new Response("Bad Request", { status: 400 });
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

	const index = getSearchClient().index("blog");
	const result = await index.search(query, {
		attributesToRetrieve: ["title", "path", "id"],
		attributesToCrop: ["content"],
		attributesToHighlight: ["content"],
		cropLength: 20,
		limit: ITEMS_LIMIT,
		offset: (page - 1) * ITEMS_LIMIT,
	});

	const list: SearchDTO[] = [];
	for (const item of result.hits) {
		list.push({
			id: item.id,
			title: item.title,
			path: item.path,
			content: item._formatted!.content,
		});
	}

	const response: SearchResponse = {
		hits: list,
		total: result.estimatedTotalHits,
	};

	return new Response(JSON.stringify(response), { status: 200 });
}
