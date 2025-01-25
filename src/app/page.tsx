import React from "react";
import NormalContainer from "@/app/components/NormalContainter";
import RecommendList from "@/app/components/RecommendList";
import Client from "@/app/client";
import HomeWaterfallList from "@/app/components/HomeWaterfallList";
import getDataInstance, { getArticle } from "@/app/config/data";
import { Article } from "@/app/config/entity";

export const revalidate = 0;
export const metadata = {
	title: "首页 - Caiwen的博客",
	description: "Caiwen的博客，一个技术博客。",
};

export default function Home() {
	const db = getDataInstance();
	const topRecommend: Article[] = [];
	for (const id of db.recommend!.top) {
		topRecommend.push(getArticle(id)!);
	}
	return (
		<NormalContainer className={"mb-12"}>
			<Client />
			<RecommendList data={topRecommend} className={"mt-8"}></RecommendList>
			<HomeWaterfallList />
		</NormalContainer>
	);
}
