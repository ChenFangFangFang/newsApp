import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	// Convert Next.js recommended rules to Flat Config format
	...compat.extends("next/core-web-vitals", "next/typescript"),

	// Additional ESLint and Prettier configuration
	{
		rules: {
			"no-unexpected-multiline": "error",
			"prettier/prettier": ["error", { semi: true, useTabs: true }],
		},
	},
];
