"use client";

import React, { useEffect, useRef } from "react";
import type { Article } from "@/config/entity";
import {
	Alert,
	Breadcrumbs,
	ButtonBase,
	Chip,
	Divider,
	Link,
	Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import LazyLoad from "react-lazyload";
import { Author, Avatar, Introduction } from "@/config";
import RecommendList from "@/components/RecommendList";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import "@/config/markdown.css";
import { ArchiverNavigator, useNavigatorStore } from "@/config/navigator";
import generateTOC, { useTocStore } from "@/utils/toc";
import classNames from "classnames";
import "highlight.js/styles/github.css";

export default function Article({
	data,
	children,
	before,
	after,
	recommend,
}: {
	data: Article;
	children: React.ReactNode;
	before: Article | null;
	after: Article | null;
	recommend: Article[];
}) {
	const tocStore = useTocStore();
	const setNavigator = useNavigatorStore((state) => state.setNow);
	const setTitle = useNavigatorStore((state) => state.setTitle);
	const contentRef = useRef<HTMLDivElement>(null);

	interface AnchorElementMap {
		[id: string]: HTMLAnchorElement | null;
	}

	const anchorElementMap = useRef<AnchorElementMap>({});

	async function handleCopy(value: string) {
		value = decodeURIComponent(atob(value));
		await navigator.clipboard.writeText(value);
	}

	async function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target && (e.target as HTMLElement).matches(".copy")) {
			const target = e.target as HTMLElement;
			const value = target.getAttribute("data")!;
			await handleCopy(value);
		}
	}

	useEffect(() => {
		setNavigator(ArchiverNavigator);
		setTitle(data.title);
		const lazyloadObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const image = entry.target as HTMLImageElement;
						image.src = image.getAttribute("date-src")!;
						image.removeAttribute("date-src");
						lazyloadObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 },
		);
		const tocObserver = new IntersectionObserver(
			(entries) => {
				let flag = false;
				entries.forEach((entry) => {
					if (flag) return;
					if (entry.isIntersecting) {
						tocStore.setCurrentAnchor(entry.target.id);
						window.history.replaceState(null, "", `#${entry.target.id}`);
						const targetAnchor = anchorElementMap.current[entry.target.id];
						if (targetAnchor !== null && targetAnchor !== undefined) {
							requestAnimationFrame(() => {
								targetAnchor.scrollIntoView({ block: "nearest" });
							});
						}
						flag = true;
					}
				});
			},
			{ threshold: 1 },
		);
		requestAnimationFrame(() => {
			if (contentRef.current) {
				const ref = contentRef.current;
				const images = ref.querySelectorAll(
					"img[date-src]",
				) as NodeListOf<HTMLImageElement>;
				images.forEach((image) => {
					image.onload = () => {
						image.classList.add("loaded");
					};
					lazyloadObserver.observe(image);
				});
				const toc = generateTOC(ref);
				tocStore.setToc(toc);
				toc.forEach((item) => {
					tocObserver.observe(item.target);
				});
			}
		});
		const contentDom = contentRef.current;
		return () => {
			if (contentDom) {
				lazyloadObserver.disconnect();
				tocObserver.disconnect();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	interface Path {
		name: string;
		link: string;
	}

	const path: Path[] = [{ name: "归档", link: "/archives" }];
	let nowLink = "/archives";
	for (let i = 0; i < data.path.length - 1; i++) {
		nowLink += "/" + data.path[i];
		path.push({ name: data.path[i], link: nowLink });
	}
	return (
		<>
			<div className={"flex relative pt-4 px-2 sm:px-4"}>
				<div className={"flex-1 sm:px-8 min-w-0"}>
					<div className={"ml-auto mr-auto article max-w-3xl"}>
						<Breadcrumbs>
							{path.map((item) => {
								return (
									<Link
										key={item.link}
										underline="hover"
										color="inherit"
										href={item.link}
									>
										{item.name}
									</Link>
								);
							})}
						</Breadcrumbs>
						<div
							className={
								"w-full h-48 bg-primary relative rounded overflow-hidden mt-2"
							}
						>
							<LazyLoad className={"w-full h-full"}>
								<div
									style={{ backgroundImage: `url("${data.background}")` }}
									className={"animate-fadeIn w-full h-full bg-cover bg-center"}
								></div>
							</LazyLoad>
						</div>
						{data.status === "discard" && (
							<Alert severity={"warning"} className={"mt-2"}>
								下列的文章已经被废弃。文章的质量、正确性、时效性无法保证。
							</Alert>
						)}
						{data.status === "draft" && (
							<Alert severity={"info"} className={"mt-2"}>
								下列的文章正在处于草稿状态，尚未完成。
							</Alert>
						)}
						<div className={"md-typeset mt-4"}>
							<h1 className={"mb-0 break-words break-all"}>{data.title}</h1>
						</div>
						<div
							className={
								"flex-none mt-auto text-sm opacity-60 flex items-center pt-1 text-black"
							}
						>
							<AccessTimeIcon fontSize={"inherit"} />
							<span className={"ml-1"}>
								{dayjs(data.createTime).format("YYYY-MM-DD HH:mm")}
							</span>
						</div>
						<Stack spacing={2} direction="row" className={"mt-1"}>
							{data.tags.map((tag) => {
								return (
									<Chip
										key={tag.value}
										variant={"outlined"}
										color={tag.color}
										size={"small"}
										label={tag.value}
									></Chip>
								);
							})}
						</Stack>
						<div
							className={"md-typeset my-8"}
							ref={contentRef}
							onClick={handleClick}
						>
							{children}
						</div>
						<div className={"bg-card rounded mt-12"}>
							<div className={"p-2 flex items-center opacity-70"}>
								<UpdateOutlinedIcon fontSize={"small"} />
								<div className={"text-sm ml-1"}>
									最后更新于：
									{dayjs(data.updateTime).format("YYYY-MM-DD HH:mm")}
								</div>
							</div>
							<Divider />
							<div className={"flex"}>
								<div
									className={"w-32 h-32 bg-primary relative overflow-hidden"}
								>
									<LazyLoad className={"w-full h-full"}>
										<div
											style={{ backgroundImage: `url("${Avatar}")` }}
											className={
												"animate-fadeIn w-full h-full bg-cover bg-center"
											}
										></div>
									</LazyLoad>
								</div>
								<svg
									className={"-ml-8 z-10"}
									preserveAspectRatio="none"
									xmlns="http://www.w3.org/2000/svg"
									width="2em"
									height="128.8px"
									viewBox="0 1 40 200"
								>
									<path
										data-name="mdx_m1"
										d="M0 0c100-.25 100 0 100 0v200H0S75.62 104.19 0 0z"
										fill="#EDEDED"
										fillRule="evenodd"
									></path>
								</svg>
								<div className={"ml-6 flex items-center"}>
									<div>
										<div className={"text-title font-bold text-2xl"}>
											{Author}
										</div>
										<div className={"text-sm opacity-50"}>本文作者</div>
										<div className={"text-sm mt-2"}>{Introduction}</div>
									</div>
								</div>
							</div>
							{recommend.length !== 0 && (
								<>
									<Divider />
									<RecommendList data={recommend} elevation={0} />
								</>
							)}
						</div>
					</div>
				</div>
				<div
					className={
						"sticky top-20 ml-auto overflow-y-auto flex-none w-48 context-bar hidden sm:block md:w-64"
					}
				>
					<div className={"flex text-low"}>
						<div className={"text-title font-bold self-center"}>目录</div>
					</div>
					{tocStore.toc.map((item) => (
						<Link
							ref={(ref) => {
								anchorElementMap.current[item.id] = ref;
							}}
							key={item.id}
							href={`#${item.id}`}
							underline={"none"}
							className={classNames("text-low my-1 block scroll-m-6", {
								"text-black text-opacity-50 hover:text-opacity-80 transition":
									tocStore.currentAnchor !== item.id,
								"text-primary font-bold text-low":
									tocStore.currentAnchor === item.id,
								"ml-4": item.level === 3,
								"ml-8": item.level === 4,
							})}
						>
							{item.title}
						</Link>
					))}
				</div>
			</div>
			<div className={"mt-12 bg-white h-24 grid grid-cols-2"}>
				{before === null ? (
					<div></div>
				) : (
					<Link underline={"none"} href={`/post/${before.id}`}>
						<ButtonBase className={"flex pr-2 w-full h-full"}>
							<div className={"mr-auto flex items-center ml-4 overflow-hidden"}>
								<ArrowBackOutlinedIcon
									fontSize={"large"}
									className={"text-title"}
								/>
								<div className={"ml-1 min-w-0"}>
									<div className={"text-black opacity-40 text-sm text-start"}>
										上一篇
									</div>
									<div
										className={
											"text-title text-start truncate break-all w-full overflow-hidden"
										}
									>
										{before.title}
									</div>
								</div>
							</div>
						</ButtonBase>
					</Link>
				)}
				{after === null ? (
					<div></div>
				) : (
					<Link underline={"none"} href={`/post/${after.id}`}>
						<ButtonBase className={"flex pl-2 w-full h-full"}>
							<div
								className={
									"ml-auto flex items-center mr-4 overflow-hidden flex-row-reverse"
								}
							>
								<ArrowForwardOutlinedIcon
									fontSize={"large"}
									className={"text-title"}
								/>
								<div className={"mr-1 min-w-0"}>
									<div className={"text-black opacity-40 text-sm text-end"}>
										下一篇
									</div>
									<div
										className={
											"text-title text-end truncate break-all w-full overflow-hidden"
										}
									>
										{after.title}
									</div>
								</div>
							</div>
						</ButtonBase>
					</Link>
				)}
			</div>
		</>
	);
}
