import React from "react";
import { Metadata } from "next";
import NormalContainter from "@/components/NormalContainter";
import { Author, SiteName } from "@/config";

export const metadata: Metadata = {
	title: "关于 - " + SiteName,
	description: `关于${SiteName}以及${Author}的一些信息。`,
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <NormalContainter>{children}</NormalContainter>;
}
