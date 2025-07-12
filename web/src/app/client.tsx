"use client";

import React, { useEffect } from "react";
import { HomeNavigator, useNavigatorStore } from "@/config/navigator";
import { Paper } from "@mui/material";
import LazyLoad from "react-lazyload";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import { TagCloud } from "react-tagcloud";
import { Author, IndexTags, Introduction, SiteName } from "@/config";

export default function Client() {
	const setNavigator = useNavigatorStore((state) => state.setNow);
	useEffect(() => {
		setNavigator(HomeNavigator);
	}, []);
	return (
		<div className={"flex mt-28 flex-wrap"}>
			<Paper
				elevation={2}
				className={
					"sm:flex-1 h-64 w-full overflow-hidden bg-primary relative hidden sm:flex"
				}
			>
				<LazyLoad className={"w-full h-full"}>
					<div
						style={{ backgroundImage: "url('/img/th.jpg')" }}
						className={"animate-fadeIn w-full h-full bg-cover bg-center"}
					></div>
				</LazyLoad>
				<div
					className={
						"z-10 absolute left-0 bottom-0 w-full h-12 bg-black opacity-30"
					}
				></div>
				<Paper
					elevation={2}
					className={
						"h-20 w-20 rounded-full z-20 absolute left-4 bottom-3 overflow-hidden bg-primary"
					}
				>
					<LazyLoad>
						<img
							src="/img/avatar.webp"
							className={"object-cover animate-fadeIn w-full h-full"}
						/>
					</LazyLoad>
				</Paper>
				<div className={"absolute z-20 bottom-6 text-white text-xl left-24"}>
					<div className={"ml-3 mb-3"}>{Author}</div>
					<div className={"ml-3 text-xs"}>{Introduction}</div>
				</div>
			</Paper>
			<Paper
				elevation={2}
				className={
					"flex-none w-full sm:w-64 md:w-80 h-64 sm:ml-2 mt-2 sm:mt-0 bg-primary flex"
				}
			>
				<div className={"self-center m-auto"}>
					<div className={"text-white"}>
						<div className={"flex justify-center"}>
							<LocalLibraryOutlinedIcon className={"text-6xl"} />
						</div>
						<div className={"text-2xl text-center"}>{SiteName}</div>
					</div>
					<TagCloud
						className={"text-center mx-12"}
						colorOptions={{
							luminosity: "light",
							hue: "#9C27B0",
						}}
						minSize={15}
						maxSize={25}
						tags={IndexTags}
					/>
				</div>
			</Paper>
		</div>
	);
}
