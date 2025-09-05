"use client";

import React, { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/global.css";
import "@/katex.min.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Appbar from "@/components/Appbar";
import theme from "@/config/theme";
import { ThemeProvider } from "@mui/material/styles";
import NormalContainter from "@/components/NormalContainter";
import SideDrawer from "@/components/SideDrawer";
import { GongAnBeian, ICPBeian, SiteName } from "@/config";
import Image from "next/image";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	return (
		<html>
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<Appbar
							onDrawerOpen={() => {
								setDrawerOpen(true);
							}}
						></Appbar>
						<SideDrawer
							open={drawerOpen}
							onClose={() => {
								setDrawerOpen(false);
							}}
						></SideDrawer>
						<div className="mt-12 z-0">{children}</div>
						<div className={"bg-footer px-3 sm:px-0"}>
							<NormalContainter className={"p-6 sm:flex"}>
								<div>
									<div className={"text-head font-bold text-4xl"}>
										{SiteName}
									</div>
									<div className={"text-sm opacity-40 mt-3"}>
										Powered by Next.js
									</div>
									<div className={"text-sm opacity-40"}>
										All Copyright Reserved © 2022-2025
									</div>
								</div>
								<div className="sm:ml-auto sm:self-end sm:flex sm:flex-col mt-5 sm:mt-0">
									<a
										href="https://beian.miit.gov.cn/"
										rel="noopener noreferrer"
										target="_blank"
										className="opacity-60 hover:opacity-40 transition-opacity ml-auto"
									>
										{ICPBeian}
									</a>
									<a
										href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=13090202000724"
										rel="noopener noreferrer"
										target="_blank"
										className="flex items-center opacity-60 hover:opacity-40 transition-opacity"
									>
										<Image
											src="/img/beian.png"
											className={"opacity-100"}
											alt="公安备案"
										/>
										<div className={"flex-none"}>{GongAnBeian}</div>
									</a>
								</div>
							</NormalContainter>
						</div>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
