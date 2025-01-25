import NormalContainter from "@/app/components/NormalContainter";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "页面不存在 - Caiwen的博客",
};

export default function NotFound() {
	return (
		<NormalContainter>
			<div className={"py-16 flex items-center"}>
				<ErrorOutlineOutlinedIcon className={"text-5xl text-title ml-auto"} />
				<div className={"text-title text-3xl mr-auto ml-4"}>页面不存在</div>
			</div>
		</NormalContainter>
	);
}
