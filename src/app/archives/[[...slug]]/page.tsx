import React from "react";
import NormalContainter from "@/components/NormalContainter";
import {
	Breadcrumbs,
	ButtonBase,
	Chip,
	Divider,
	Link,
	Paper,
	Stack,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { Category } from "@/config/entity";
import getDataInstance, { getArticle } from "@/config/data";
import { notFound } from "next/navigation";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import dayjs from "dayjs";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Client from "@/app/archives/[[...slug]]/client";
import classNames from "classnames";
import { SiteName } from "@/config";

export interface CategoryItem {
	name: string;
	link: string;
	entity: Category;
}

export const revalidate = 0;
export const metadata = {
	title: "归档 - " + SiteName,
};

export default async function Archives({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}) {
	let slug = (await params).slug;
	if (!slug) slug = ["归档"];
	else {
		for (let i = 0; i < slug.length; i++) {
			slug[i] = decodeURIComponent(slug[i]);
		}
		slug = ["归档", ...slug];
	}

	const db = getDataInstance();
	let categoryPoint = db.tree as Category;
	const categories: CategoryItem[] = [];
	let nowLink = "/archives";
	for (let i = 0; i < slug.length - 1; i++) {
		const item: CategoryItem = {
			name: slug[i],
			link: nowLink,
			entity: categoryPoint,
		};
		categories.push(item);
		const next = categoryPoint.subCategory.find(
			(item) => item.title === slug[i + 1],
		);
		if (next) {
			categoryPoint = next;
			nowLink += "/" + slug[i + 1];
		} else {
			notFound();
		}
	}

	return (
		<NormalContainter className={"mb-12"}>
			<div className={"pt-5"}></div>
			<Breadcrumbs>
				{categories.map((i, index) => {
					return (
						<Link key={index} href={i.link} underline="hover" color="inherit">
							{i.name}
						</Link>
					);
				})}
			</Breadcrumbs>
			<div className={"flex mt-1"}>
				{slug.length > 1 && (
					<Link
						underline={"none"}
						href={categories[categories.length - 1].link}
						className={"text-title"}
					>
						<IconButton className={"self-center p-2"}>
							<ArrowBackIosIcon />
						</IconButton>
					</Link>
				)}
				<div
					className={classNames(
						"text-title text-2xl font-bold self-center ml-1",
						{
							"mt-6": slug.length === 1,
						},
					)}
				>
					{slug.length === 1 ? "归档" : categoryPoint.title}
				</div>
			</div>
			<Paper elevation={2} className={"mt-3"}>
				{categoryPoint.subCategory.map((item) => {
					return (
						<Link
							key={item.title}
							underline={"none"}
							href={nowLink + "/" + item.title}
							className={"text-title"}
						>
							<ButtonBase
								className={
									"py-2 px-3 w-full bg-black bg-opacity-0 hover:bg-opacity-5 transition justify-start text-start rounded-sm"
								}
							>
								<div className={"flex flex-1"}>
									<FolderOpenOutlinedIcon
										fontSize={"large"}
										className={"self-center flex-none"}
									/>
									<div className={"ml-2 flex-1"}>
										<div className={"truncate"}>{item.title}</div>
										<div className={"text-xs opacity-70"}>
											最后更新：{dayjs(item.updateTime).format("YYYY-MM-DD")}
										</div>
									</div>
									<div className={"flex-none self-center ml-auto"}>
										<div className={"opacity-70"}>{item.count}</div>
									</div>
								</div>
							</ButtonBase>
							<Divider />
						</Link>
					);
				})}
				{categoryPoint.subArticle.map((item) => {
					return (
						<Link
							key={item}
							underline={"none"}
							href={`/post/${item}`}
							className={"text-title"}
						>
							<ButtonBase
								className={
									"py-1 px-3 w-full bg-black bg-opacity-0 hover:bg-opacity-5 transition block rounded-sm text-start"
								}
							>
								<div className={"flex flex-1"}>
									<DescriptionOutlinedIcon
										fontSize={"large"}
										className={"self-center flex-none"}
									/>
									<div className={"ml-2 flex-1"}>
										<div className={"truncate"}>{getArticle(item)!.title}</div>
										<div className={"sm:flex"}>
											<div className={"text-xs opacity-70"}>
												发布时间：
												{dayjs(getArticle(item)!.createTime).format(
													"YYYY-MM-DD",
												)}
											</div>
											<div className={"ml-1 mr-1 hidden sm:inline text-xs"}>
												/
											</div>
											<div className={"text-xs opacity-70"}>
												最后更新：
												{dayjs(getArticle(item)!.updateTime).format(
													"YYYY-MM-DD",
												)}
											</div>
										</div>
									</div>
								</div>
								<div className={"ml-11 mt-1"}>
									<Stack direction="row" spacing={1}>
										{getArticle(item)!.tags.map((tag) => {
											return (
												<Chip
													key={tag.value}
													variant="outlined"
													color={tag.color}
													size="small"
													label={tag.value}
												/>
											);
										})}
									</Stack>
								</div>
							</ButtonBase>
							<Divider />
						</Link>
					);
				})}
			</Paper>
			<Client />
		</NormalContainter>
	);
}
