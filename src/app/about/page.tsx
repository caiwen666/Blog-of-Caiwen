"use client";

import React, { useEffect } from "react";
import { AboutNavigator, useNavigatorStore } from "@/app/config/navigator";
import { Divider, Paper, SvgIcon, Tooltip } from "@mui/material";
import LazyLoad from "react-lazyload";
import NormalContainter from "@/app/components/NormalContainter";
import { Avatar } from "@/app/config";
import IconButton from "@mui/material/IconButton";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import "@/app/config/markdown.css";

export default function About() {
	const setNavigator = useNavigatorStore((state) => state.setNow);
	useEffect(() => {
		setNavigator(AboutNavigator);
	}, []);
	return (
		<NormalContainter className={"py-16"}>
			<Paper className={"overflow-hidden"}>
				<div className={"flex h-56 items-center"}>
					<Paper
						elevation={0}
						className={
							"h-24 w-24 sm:h-32 sm:w-32 rounded-full m-3 overflow-hidden bg-primary ml-auto"
						}
					>
						<LazyLoad>
							<img
								src={Avatar}
								className={"object-cover animate-fadeIn w-full h-full"}
							/>
						</LazyLoad>
					</Paper>
					<div className={"ml-4 mr-auto"}>
						<div className={"text-3xl text-title"}>Caiwen</div>
						<div className={"text-sm text-head opacity-60"}>
							全栈开发者 / 学生 / ACMer
						</div>
						<Tooltip title={"QQ：3102733279"}>
							<IconButton>
								<SvgIcon>
									<svg
										className="text-title"
										viewBox="0 0 1024 1024"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										width="200"
										height="200"
									>
										<path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"></path>
									</svg>
								</SvgIcon>
							</IconButton>
						</Tooltip>
						<Tooltip title={"Github: caiwen666"}>
							<IconButton>
								<SvgIcon>
									<svg
										className="icon"
										viewBox="0 0 1024 1024"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										width="200"
										height="200"
									>
										<path
											d="M512 12.672c-282.88 0-512 229.248-512 512 0 226.261333 146.688 418.133333 350.08 485.76 25.6 4.821333 34.986667-11.008 34.986667-24.618667 0-12.16-0.426667-44.373333-0.64-87.04-142.421333 30.890667-172.458667-68.693333-172.458667-68.693333C188.672 770.986667 155.008 755.2 155.008 755.2c-46.378667-31.744 3.584-31.104 3.584-31.104 51.413333 3.584 78.421333 52.736 78.421333 52.736 45.653333 78.293333 119.850667 55.68 149.12 42.581333 4.608-33.109333 17.792-55.68 32.426667-68.48-113.706667-12.8-233.216-56.832-233.216-253.013333 0-55.893333 19.84-101.546667 52.693333-137.386667-5.76-12.928-23.04-64.981333 4.48-135.509333 0 0 42.88-13.738667 140.8 52.48 40.96-11.392 84.48-17.024 128-17.28 43.52 0.256 87.04 5.888 128 17.28 97.28-66.218667 140.16-52.48 140.16-52.48 27.52 70.528 10.24 122.581333 5.12 135.509333 32.64 35.84 52.48 81.493333 52.48 137.386667 0 196.693333-119.68 240-233.6 252.586667 17.92 15.36 34.56 46.762667 34.56 94.72 0 68.522667-0.64 123.562667-0.64 140.202666 0 13.44 8.96 29.44 35.2 24.32C877.44 942.592 1024 750.592 1024 524.672c0-282.752-229.248-512-512-512"
											fill=""
										></path>
									</svg>
								</SvgIcon>
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<Divider />
				<div className={"text-title text-xl m-3"}>简介</div>
				<div className={"md-typeset ml-2 text-sm mr-2"}>
					<ul>
						<li>目前就读于湖南大学城乡规划专业。</li>
						<li>已经退役的OI选手，现役的ACM选手。</li>
						<li>业余的全栈开发者。</li>
						<ul className={"ml-6"}>
							<li>前端：Vue（略懂），React（正在学）/ Next.js</li>
							<li>后端：Java / SpringBoot，Python，Rust（正在学）</li>
						</ul>
						<li>业余的搞机爱好者。</li>
					</ul>
				</div>
				<Divider />
				<div className={"text-title text-xl m-3"}>奖项</div>
				<div className={"md-typeset ml-2 text-sm"}>
					<ul>
						<li>
							<WorkspacePremiumOutlinedIcon color={"success"} />
							<span className={"ml-2"}>CCF CSP 430分（2024-12）</span>
						</li>
						<li>
							<WorkspacePremiumOutlinedIcon color={"success"} />
							<span className={"ml-2"}>NOIP 2023 一等奖（2023-11）</span>
						</li>
						<li>
							<WorkspacePremiumOutlinedIcon color={"success"} />
							<span className={"ml-2"}>CSP 2023 一等奖（2023-10）</span>
						</li>
						<li>
							<WorkspacePremiumOutlinedIcon color={"warning"} />
							<span className={"ml-2"}>NOI春季测试 二等奖（2023-3）</span>
						</li>
						<li>
							<WorkspacePremiumOutlinedIcon color={"warning"} />
							<span className={"ml-2"}>CSP 2022 二等奖（2022-10）</span>
						</li>
					</ul>
				</div>
			</Paper>
		</NormalContainter>
	);
}
