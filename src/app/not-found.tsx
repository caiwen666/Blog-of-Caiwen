import React from "react";
import NormalContainter from "@/components/NormalContainter";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Metadata } from "next";
import { SiteName } from "@/config";

export const metadata: Metadata = {
	title: "页面不存在 - " + SiteName,
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
