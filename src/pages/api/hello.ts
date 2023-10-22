import { NextRequest } from 'next/server';
// hello example response

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
	const reqMethod = req.method;

	return NextResponse.json(
		{
			message: `[${reqMethod}] hello response at ${new Date().toISOString()}`,
		},
		{
			status: 200,
		}
	);
}
