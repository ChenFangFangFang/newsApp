// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
	});
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		console.log("starting submit");
		try {
			const res = await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					action: isLogin ? "login" : "register",
				}),
				credentials: "include",
			});

			const data = await res.json();
			console.log("Login response:", data);
			if (data.token) {
				localStorage.setItem("authToken", data.token);
			} // Save token
			if (!data) {
				console.log("response is not ok");
			}
			if (!res.ok) {
				throw new Error(data.error || "Authentication failed");
			}
			console.log("Login successful! Token is stored as a cookie.");
			// Store token in localStorage
			localStorage.setItem("authToken", data.token);

			// Store username if registering
			if (!isLogin) {
				localStorage.setItem("name", formData.name);
			}

			// If successful, redirect to dashboard
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="text-center text-3xl font-extrabold text-gray-900">
					{isLogin ? "Sign in to your account" : "Create a new account"}
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{!isLogin && (
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Name
								</label>
								<div className="mt-1">
									<input
										id="name"
										name="name"
										type="text"
										required={!isLogin}
										value={formData.name}
										onChange={handleChange}
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
									/>
								</div>
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email address
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									required
									value={formData.password}
									onChange={handleChange}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>
						</div>

						{error && <div className="text-red-600 text-sm">{error}</div>}

						<div>
							<button
								type="submit"
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								{isLogin ? "Sign in" : "Register"}
							</button>
						</div>
					</form>

					<div className="mt-6">
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
						>
							{isLogin
								? "Don't have an account? Sign up"
								: "Already have an account? Sign in"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
