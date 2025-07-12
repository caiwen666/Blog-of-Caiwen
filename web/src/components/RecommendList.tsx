"use client";

import React from "react";
import SmallArticleItem from "@/components/SmallArticleItem";
import { Paper } from "@mui/material";
import classNames from "classnames";
import { Article } from "@shared/entity";

export default function RecommendList({
	data,
	className = "",
	square = false,
	elevation = 2,
}: {
	data: Article[];
	className?: string;
	square?: boolean;
	elevation?: number;
}) {
	return (
		<Paper
			elevation={elevation}
			className={classNames("h-48 bg-card flex flex-col", className)}
			square={square}
		>
			<div className={"text-title font-bold text-xl p-3"}>推荐文章</div>
			<div className={"flex-1 overflow-x-auto px-3 pb-2 flex flex-nowrap"}>
				{data.map((article, index) => {
					return (
						<SmallArticleItem
							key={article.id}
							title={article.title}
							id={article.id}
							img={article.background}
							className={classNames({
								"ml-2": index !== 0,
							})}
						/>
					);
				})}
			</div>
		</Paper>
	);
}
