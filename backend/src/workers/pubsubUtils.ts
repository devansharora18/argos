export function decodePubSubData(event: unknown): unknown {
  const source = event as {
    data?: { message?: { data?: string; json?: unknown } };
    message?: { data?: string; json?: unknown };
  };

  const jsonPayload = source.data?.message?.json ?? source.message?.json;
  if (jsonPayload !== undefined) {
    return jsonPayload;
  }

  const encoded = source.data?.message?.data ?? source.message?.data;
  if (!encoded) {
    return null;
  }

  try {
    const json = Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}
