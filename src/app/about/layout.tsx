import React from "react";
import { Metadata } from "next";
import NormalContainter from "@/app/components/NormalContainter";

export const metadata: Metadata = {
	title: "关于 - Caiwen的博客",
	description: "关于Caiwen的博客以及Caiwen的一些信息。",
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <NormalContainter>{children}</NormalContainter>;
}
