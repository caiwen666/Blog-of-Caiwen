import React from "react";
import NormalContainer from "@/components/NormalContainter";
import RecommendList from "@/components/RecommendList";
import Client from "@/app/client";
import HomeWaterfallList from "@/components/HomeWaterfallList";
import getDataInstance, { getArticle } from "@/config/data";
import { Article } from "@/config/entity";
import { SiteDescription, SiteName } from "@/config";

export const revalidate = 0;
export const metadata = {
	title: SiteName,
	description: SiteDescription,
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
