"use client";

import React, { useEffect } from "react";
import { ArchiverNavigator, useNavigatorStore } from "@/config/navigator";

export default function Client() {
	const setNavigator = useNavigatorStore((state) => state.setNow);
	useEffect(() => {
		setNavigator(ArchiverNavigator);
	}, [setNavigator]);
	return <div></div>;
}
