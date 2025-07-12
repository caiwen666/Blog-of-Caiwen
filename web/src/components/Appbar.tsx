"use client";

import React, { useEffect, useState } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import classNames from "classnames";
import Navigator, {
	useNavigatorStore,
	NavigatorItem,
	LoadingNavigator,
} from "@/config/navigator";
import IconButton from "@mui/material/IconButton";
import Search from "@/components/Search";
import "client-only";

export default function Appbar({ onDrawerOpen }: { onDrawerOpen: () => void }) {
	const navigatorStore = useNavigatorStore();
	const handleChange = (
		event: React.SyntheticEvent,
		newValue: NavigatorItem,
	) => {
		navigatorStore.setNow(newValue);
	};
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
	const [showSearch, setShowSearch] = useState(false);
	return (
		<>
			<Paper
				className="h-12 bg-background z-50 flex text-sm fixed top-0 left-0 w-full backdrop-blur-md bg-opacity-70"
				elevation={isScrolled ? 4 : 0}
				square
			>
				<IconButton
					className="ml-2 self-center p-2 sm:hidden"
					size="large"
					onClick={onDrawerOpen}
				>
					<MenuIcon />
				</IconButton>
				<div className="self-center font-bold text-lg ml-4 mr-4 text-title">
					Caiwen的博客
				</div>
				<Tabs
					value={
						navigatorStore.now == LoadingNavigator ? false : navigatorStore.now
					}
					onChange={handleChange}
					textColor="secondary"
					indicatorColor="secondary"
					className={"hidden sm:block"}
				>
					{Navigator.map((item) => {
						return (
							<Tab
								key={item.value}
								className={classNames(
									"bg-black bg-opacity-0 hover:bg-opacity-5 transition",
								)}
								value={item}
								component={"a"}
								href={item.path}
								label={
									<div
										className={classNames("flex items-center", {
											"opacity-50": navigatorStore.now != item,
										})}
									>
										<item.icon className="mr-1" />
										<div>{item.title}</div>
									</div>
								}
							/>
						);
					})}
				</Tabs>
				<IconButton
					className="ml-auto mr-2 self-center p-2"
					size="large"
					onClick={() => {
						setShowSearch(true);
					}}
				>
					<SearchOutlinedIcon />
				</IconButton>
			</Paper>
			<Search open={showSearch} onClose={() => setShowSearch(false)} />
		</>
	);
}
