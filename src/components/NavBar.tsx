"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const MAX_WIDTH = "max-w-5xl";

const NavBar = () => {
	console.log("Nav bar is rendering");

	const handleLogout = async () => {
		console.log("handleLogout is rendering");

		try {
			await fetch("/api/logout", {
				method: "GET",
				credentials: "include",
			});
			localStorage.removeItem("authToken");
			window.location.href = "/login";
		} catch (error) {
			console.error("Logout failed", error);
			window.location.href = "/login";
		}
	};

	return (
		<div className="w-full bg-blue-900">
			<div
				className={`${MAX_WIDTH} mx-auto px-4 flex justify-between items-center h-16`}
			>
				<h1 className="text-xl font-semibold text-white">Business Insights</h1>
				<div className="flex items-center gap-4">
					<Button variant="secondary" size="sm" onClick={handleLogout}>
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
