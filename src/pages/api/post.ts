import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
	// Create redirect url
	const addNewUrl = req.nextUrl.clone();
	addNewUrl.pathname = '/';

	if (req.method !== 'POST') {
		return NextResponse.json(
			{
				message: 'Incorrect Request Method - Only POST Allowed',
			},
			{
				status: 502,
			}
		);
	}

	return NextResponse.json(
		{
			message: 'hello',
		},
		{
			status: 200,
		}
	);
}
