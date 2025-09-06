"use client";

import React, { useEffect } from "react";
import { ArchiverNavigator, useNavigatorStore } from "@/config/navigator";

export default function Client() {
	const setNavigator = useNavigatorStore((state) => state.setNow);
	useEffect(() => {
		setNavigator(ArchiverNavigator);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <div></div>;
}
