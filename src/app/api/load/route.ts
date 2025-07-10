import getDataInstance from "@/config/data";
import { getConfigInstance } from "@/config/api";
import { NextRequest } from "next/server";

export function GET(req: NextRequest | Request) {
	const url = new URL(req.url!);
	const searchParams = new URLSearchParams(url.search);
	const token = searchParams.get("token");
	if (token !== getConfigInstance().api_token) {
		return new Response("Unauthorized", { status: 401 });
	}
	getDataInstance(true);
	return new Response("Success", { status: 200 });
}
