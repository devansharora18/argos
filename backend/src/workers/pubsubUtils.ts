export function decodePubSubData(event: unknown): unknown {
	const data = event as { data?: { message?: { data?: string } } };
	const encoded = data.data?.message?.data;
	if (!encoded) {
		return null;
	}

	try {
		const json = Buffer.from(encoded, "base64").toString("utf8");
		return JSON.parse(json);
	} catch {
		return null;
	}
}
