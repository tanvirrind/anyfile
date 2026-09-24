let pendingFile: File | null = null;

/**
 * Holds a selected browser File briefly while the App Router transitions from
 * the homepage to the matching extension page. Files are never serialized or
 * sent to the server; this store only exists in the browser module graph.
 */
export function setPendingFile(file: File) {
  pendingFile = file;
}

export function consumePendingFile(): File | null {
  const file = pendingFile;
  pendingFile = null;
  return file;
}
