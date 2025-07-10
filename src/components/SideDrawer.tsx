"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Drawer,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
} from "@mui/material";
import LazyLoad from "react-lazyload";
import Navigator, {
	NavigatorItem,
	useNavigatorStore,
} from "@/config/navigator";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import classNames from "classnames";
import { useTocStore } from "@/utils/toc";
import { CSSTransition } from "react-transition-group";

export default function SideDrawer({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const [showToc, setShowToc] = useState(false);
	const ref1 = useRef(null);
	const ref2 = useRef(null);

	const navigatorStore = useNavigatorStore();
	const tocStore = useTocStore();

	useEffect(() => {
		const unsubscribe = useTocStore.subscribe((state) => {
			setShowToc(state.hasToc);
		});
		// 清理订阅
		return () => unsubscribe();
	}, []);

	const handleChange = (newValue: NavigatorItem) => {
		navigatorStore.setNow(newValue);
	};

	return (
		<>
			<Drawer
				open={open}
				onClose={() => {
					onClose();
				}}
			>
				<div className={"w-72"}></div>
				<>
					<CSSTransition
						in={!showToc}
						timeout={200}
						classNames={"card"}
						unmountOnExit
						nodeRef={ref1}
					>
						<div ref={ref1} className={"h-full bg-white"}>
							<Paper
								elevation={2}
								square
								className={"h-48 w-72 overflow-hidden bg-primary relative flex"}
							>
								<LazyLoad className={"w-full h-full"}>
									<div
										style={{ backgroundImage: "url('/img/th.jpg')" }}
										className={
											"animate-fadeIn w-full h-full bg-cover bg-center"
										}
									></div>
								</LazyLoad>
								<div
									className={
										"z-10 absolute left-0 bottom-0 w-full h-9 bg-black opacity-30"
									}
								></div>
								<Paper
									elevation={2}
									className={
										"h-16 w-16 rounded-full z-20 absolute left-2 bottom-2 overflow-hidden bg-primary"
									}
								>
									<LazyLoad>
										<img
											src="/img/avatar.webp"
											className={"object-cover animate-fadeIn w-full h-full"}
										/>
									</LazyLoad>
								</Paper>
								<div
									className={
										"absolute z-20 bottom-4 text-white text-xl left-16 pl-2"
									}
								>
									<div className={"ml-3 mb-1"}>Caiwen</div>
									<div className={"ml-3 text-xs"}>一只蒟蒻，爱好编程和算法</div>
								</div>
							</Paper>
							<List>
								{Navigator.map((item) => {
									return (
										<ListItem key={item.path} disablePadding>
											<Link
												underline={"none"}
												className={"w-full"}
												href={item.path}
												color="inherit"
											>
												<ListItemButton
													selected={navigatorStore.now === item}
													onClick={() => handleChange(item)}
												>
													<ListItemIcon>
														<item.icon
															className={classNames({
																"text-primary": navigatorStore.now === item,
															})}
														/>
													</ListItemIcon>
													<ListItemText
														primary={item.title}
														className={classNames({
															"text-primary font-bold":
																navigatorStore.now === item,
														})}
													/>
												</ListItemButton>
											</Link>
										</ListItem>
									);
								})}
								{tocStore.hasToc && (
									<ListItem disablePadding>
										<ListItemButton onClick={() => setShowToc(true)}>
											<ListItemIcon>
												<ArrowBackIcon />
											</ListItemIcon>
											<ListItemText primary={"返回文章目录"} />
										</ListItemButton>
									</ListItem>
								)}
							</List>
						</div>
					</CSSTransition>
					<CSSTransition
						in={showToc}
						timeout={200}
						classNames={"card"}
						unmountOnExit
						nodeRef={ref2}
					>
						<div className={"w-72 "} ref={ref2}>
							<div className={"bg-card overflow-hidden"}>
								<IconButton className={"m-2"} onClick={() => setShowToc(false)}>
									<ArrowBackIcon />
								</IconButton>
								<div className={"text-title m-4 truncate"}>
									{navigatorStore.title}
								</div>
							</div>
							<List>
								{tocStore.toc.map((item) => {
									return (
										<ListItem
											disablePadding
											key={item.id}
											className={"scroll-m-6"}
											ref={(ref) => {
												if (
													ref !== null &&
													item.id === tocStore.currentAnchor
												) {
													requestAnimationFrame(() => {
														ref.scrollIntoView({ block: "nearest" });
													});
												}
											}}
										>
											<Link
												underline={"none"}
												className={"w-full"}
												color="inherit"
												href={`#${item.id}`}
											>
												<ListItemButton
													selected={tocStore.currentAnchor === item.id}
													onClick={() => onClose()}
												>
													<ListItemText
														className={classNames({
															"pl-4": item.level === 3,
															"pl-8": item.level === 4,
															"text-primary font-bold":
																tocStore.currentAnchor === item.id,
														})}
													>
														{item.title}
													</ListItemText>
												</ListItemButton>
											</Link>
										</ListItem>
									);
								})}
							</List>
						</div>
					</CSSTransition>
				</>
			</Drawer>
		</>
	);
}
