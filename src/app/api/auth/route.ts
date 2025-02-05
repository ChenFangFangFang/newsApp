import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
	try {
		const { email, password, name, action } = await req.json();
		if (action === "register") {
			const hashedPassword = await hash(password, 10);
			const user = await prisma.user.create({
				data: {
					email,
					name,
					password: hashedPassword,
				},
			});
			const token = await createToken(user);
			// Create response with token
			const response = NextResponse.json(
				{
					token,
					message: "Registration successful",
				},
				{ status: 201 }
			);

			// Set cookie
			response.cookies.set("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 86400, // 24 hours
			});

			return response;
		}
		if (action === "login") {
			const user = await prisma.user.findUnique({
				where: { email },
			});
			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 400 });
			}
			const passwordValid = await compare(password, user.password);
			if (!passwordValid) {
				return NextResponse.json(
					{ error: "Invalid password" },
					{ status: 401 }
				);
			}
			const token = await createToken(user);
			console.log("backend token: ", token);
			// Create response
			const response = NextResponse.json({
				message: "Login successful",
				name: name,
				token,
			});
			console.log("response: ", NextResponse.json);
			response.cookies.set("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 86400, // 1 day
			});

			return response;
		}
	} catch {
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 500 }
		);
	}
}
