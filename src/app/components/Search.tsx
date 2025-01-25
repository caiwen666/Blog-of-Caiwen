"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import {
	Breadcrumbs,
	ButtonBase,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FilledInput,
	FormControl,
	InputAdornment,
	InputLabel,
	Link,
	Paper,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { SearchDTO, SearchResponse } from "@/app/config/entity";
import SearchHighlight from "@/app/components/SearchHighlight";

const DEBOUNCE_TIME = 1000;
const ITEMS_LIMIT = 10;

export default function Search({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const divRef = useRef<HTMLDivElement>(null);
	const divCallback = useRef<() => void>(null);
	const [end, setEnd] = useState(false);
	const endRef = useRef(end);
	const pageRef = useRef(0);
	const [loading, setLoading] = useState(false);
	const loadingRef = useRef(loading);
	const timerRef = useRef<NodeJS.Timeout>(null);
	const [data, setData] = useState<SearchDTO[]>([]);
	const dataRef = useRef(data);
	const [total, setTotal] = useState(0);
	const [empty, setEmpty] = useState(true);
	const query = useRef("");

	async function doSearch(more: boolean) {
		if (query.current.trim() === "") {
			setLoading(false);
			loadingRef.current = false;
			setEmpty(true);
			return;
		} else {
			setEmpty(false);
		}
		try {
			const response = await fetch(
				`/api/search?q=${query.current}&page=${pageRef.current + 1}`,
			);
			if (!response.ok) {
				throw new Error("Bad Response: " + response);
			}
			const result: SearchResponse = await response.json();
			if (!more) {
				setTotal(result.total);
			}
			if (result.hits.length < ITEMS_LIMIT) {
				setEnd(true);
				endRef.current = true;
			} else {
				setEnd(false);
				endRef.current = false;
			}
			const newList = [...dataRef.current, ...result.hits];
			setData(newList);
			dataRef.current = newList;
			pageRef.current++;
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
		loadingRef.current = false;
	}

	function checkIfAtBottom() {
		const div = divRef.current;
		if (div) {
			const isBottom = div.scrollHeight === div.scrollTop + div.clientHeight;
			if (isBottom) {
				if (!endRef.current && !loadingRef.current) {
					loadingRef.current = true;
					setLoading(true);
					doSearch(true);
				}
			}
		}
	}

	function handleChange(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		query.current = e.target.value;
		if (!loadingRef.current) {
			loadingRef.current = true;
			setLoading(true);
			pageRef.current = 0;
			setEnd(false);
			endRef.current = false;
			setData([]);
			dataRef.current = [];
			setTotal(0);
		}
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(async () => {
			await doSearch(false);
			timerRef.current = null;
		}, DEBOUNCE_TIME);
	}

	function handleRef(e: HTMLDivElement | null) {
		if (divCallback.current !== null) divCallback.current();
		divRef.current = e;
		if (e) {
			e.addEventListener("scroll", checkIfAtBottom);
			divCallback.current = () => {
				e.removeEventListener("scroll", checkIfAtBottom);
			};
		}
	}

	return (
		<Dialog open={open} onClose={onClose} className={"-m-6 sm:m-0"} fullWidth>
			<DialogTitle className={"p-0 z-10"}>
				<Paper elevation={1} square>
					<FormControl fullWidth variant="filled">
						<InputLabel htmlFor="filled-adornment-amount">搜索...</InputLabel>
						<FilledInput
							onChange={handleChange}
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={onClose}>
										<CloseIcon />
									</IconButton>
								</InputAdornment>
							}
						></FilledInput>
					</FormControl>
				</Paper>
			</DialogTitle>
			<DialogContent
				className={"px-4 pb-4 min-h-48"}
				ref={(ref: HTMLDivElement | null) => {
					handleRef(ref);
				}}
			>
				{data.length !== 0 && (
					<>
						<div
							className={"text-sm text-title mt-4 mb-2"}
						>{`找到 ${total} 个搜索结果：`}</div>
						{data.map((item) => {
							return (
								<div
									className={"my-2 bg-card rounded overflow-hidden"}
									key={item.id}
								>
									<div>
										<Link
											underline={"none"}
											color={"inherit"}
											className={"block"}
											href={`/post/${item.id}`}
										>
											<ButtonBase className={"block p-2"} component={"div"}>
												<Breadcrumbs>
													{item.path.slice(0, -1).map((path) => {
														return (
															<div className={"text-sm text-title"} key={path}>
																{path}
															</div>
														);
													})}
												</Breadcrumbs>
												<div className={"flex items-center mt-1"}>
													<ArticleOutlinedIcon
														fontSize={"medium"}
														className={"text-title"}
													/>
													<div className={"ml-2 text-title truncate flex-1"}>
														{item.title}
													</div>
												</div>
												<div className={"mt-2 text-sm break-all"}>
													<SearchHighlight text={item.content} />
												</div>
											</ButtonBase>
										</Link>
									</div>
								</div>
							);
						})}
					</>
				)}
				{loading && (
					<div className={"pt-6 text-center"}>
						<CircularProgress />
					</div>
				)}
				{!loading && empty && (
					<div className={"text-center pt-6 text-title"}>
						输入关键字以搜索...
					</div>
				)}
				{!loading && !empty && data.length === 0 && (
					<div className={"text-center pt-6 text-title"}>
						没有找到相关搜索结果
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
