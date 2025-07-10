"use client";

import { Alert, Chip, CircularProgress, Tooltip } from "@mui/material";
import NormalArticalItem from "@/components/NormalArticalItem";
import IconButton from "@mui/material/IconButton";
import { KeyboardArrowDown } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import { ArticleDTO } from "@/config/entity";

const ARTICLE_PER_PAGE = 6;

export default function HomeWaterfallList() {
	const [loading, setLoading] = useState(false);
	const theLoading = useRef(false);
	const [currentTab, setCurrentTab] = useState(0);
	const theCurrentTab = useRef(0);
	const [end, setEnd] = useState(false);
	const theEnd = useRef(false);
	const [data, setData] = useState<ArticleDTO[]>([]);
	const theData = useRef<ArticleDTO[]>([]);
	const page = useRef(0);

	async function loadMore(target: number, toggle: boolean) {
		setLoading(true);
		theLoading.current = true;
		if (toggle) {
			setEnd(false);
			theEnd.current = false;
			setCurrentTab(target);
			theCurrentTab.current = target;
			setData([]);
			page.current = 0;
		}
		const status =
			target === 0 ? "published" : target === 1 ? "draft" : "discard";
		try {
			const res = await fetch(
				`/api/list?status=${status}&lim=${ARTICLE_PER_PAGE}&page=${page.current + 1}`,
			);
			if (res.status !== 200) {
				throw new Error("Bad HTTP Response Code :" + res.status);
			}
			const list = (await res.json()) as ArticleDTO[];
			if (toggle) {
				setData(list);
				theData.current = list;
			} else {
				const new_list = [...theData.current, ...list];
				setData(new_list);
				theData.current = new_list;
			}
			if (list.length < ARTICLE_PER_PAGE) {
				setEnd(true);
				theEnd.current = true;
			}
			page.current += 1;
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
		theLoading.current = false;
	}

	interface Tabs {
		value: string;
		alert: boolean;
		level?: "info" | "warning" | "error" | "success";
		msg?: string;
		ref: React.RefObject<HTMLDivElement | null>;
	}

	const tabs: Tabs[] = [
		{
			value: "已发布",
			alert: false,
			ref: useRef(null),
		},
		{
			value: "草稿",
			alert: true,
			level: "info",
			msg: "下列的文章正在处于草稿状态，尚未完成。",
			ref: useRef(null),
		},
		{
			value: "废弃",
			alert: true,
			level: "warning",
			msg: "下列的文章已经被废弃。文章的质量、正确性、时效性无法保证。",
			ref: useRef(null),
		},
	];

	function handleScroll() {
		//console.log(theLoading, theEnd);
		if (theLoading.current || theEnd.current) return;
		const scrollHeight = document.documentElement.scrollHeight;
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const clientHeight =
			window.innerHeight || document.documentElement.clientHeight;
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			loadMore(theCurrentTab.current, false).then(() => {});
		}
	}

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		loadMore(0, true).then(() => {});
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<div className={"mt-8 flex"}>
				{tabs.map((tab, index) => {
					return (
						<Chip
							key={index}
							variant="outlined"
							color={currentTab == index ? "primary" : "default"}
							className={classNames("flex-none", { "ml-2": index != 0 })}
							label={tab.value}
							onClick={() => loadMore(index, true)}
						/>
					);
				})}
			</div>
			{tabs.map((tab, index) => {
				return (
					<CSSTransition
						key={index}
						in={currentTab == index}
						timeout={200}
						classNames={"toggle"}
						unmountOnExit
						nodeRef={tab.ref}
					>
						<div ref={tab.ref}>
							{tab.alert && (
								<Alert severity={tab.level!} className={"mt-3"}>
									{tab.msg}
								</Alert>
							)}
							<div className={"grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"}>
								{data.map((item) => {
									return (
										<NormalArticalItem
											key={item.id}
											title={item.title}
											id={item.id}
											date={item.createTime}
											summary={item.summary}
											img={item.background}
										/>
									);
								})}
							</div>
						</div>
					</CSSTransition>
				);
			})}
			{!end && (
				<div className={"flex"}>
					{loading ? (
						<CircularProgress color="inherit" className={"mt-12 mx-auto"} />
					) : (
						<Tooltip title={"加载更多"}>
							<IconButton
								onClick={() => loadMore(currentTab, false)}
								size={"large"}
								className={"mt-8 mx-auto text-title"}
								loading={loading}
							>
								<KeyboardArrowDown fontSize={"large"} className={"text-5xl"} />
							</IconButton>
						</Tooltip>
					)}
				</div>
			)}
		</>
	);
}
