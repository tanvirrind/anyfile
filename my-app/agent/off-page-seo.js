const DEFAULT_SITE = {
  domain: 'anyfilex.com',
  name: 'AnyFileX',
  url: 'https://anyfilex.com',
  description:
    'AnyFileX is a browser-based toolkit for opening, converting, repairing, and identifying file formats. It supports file conversion, metadata inspection, file identification, and practical guides without requiring desktop software.',
  categories: ['File tools', 'Developer tools', 'Productivity', 'Utilities'],
  tags: ['file converter', 'file identifier', 'metadata viewer', 'file repair', 'online tools'],
};

/** @typedef {{name?: string, url?: string, description?: string, categories?: string[], tags?: string[]}} SiteOverrides */

const DIRECTORY_CATALOG = [
  {
    id: 'alternativeto',
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    fit: 'High',
    type: 'Software discovery',
    notes: 'Best for a clearly positioned alternative to desktop file utilities.',
  },
  {
    id: 'saashub',
    name: 'SaaSHub',
    url: 'https://www.saashub.com',
    fit: 'High',
    type: 'Software directory',
    notes: 'Useful for product, category, and competitor context.',
  },
  {
    id: 'product-hunt',
    name: 'Product Hunt',
    url: 'https://www.producthunt.com',
    fit: 'High',
    type: 'Product launch directory',
    notes: 'Requires an honest launch narrative and active maker participation.',
  },
  {
    id: 'betalist',
    name: 'BetaList',
    url: 'https://betalist.com',
    fit: 'Medium',
    type: 'Startup directory',
    notes: 'Only use if the product is genuinely early-stage or launching a new product.',
  },
  {
    id: 'slant',
    name: 'Slant',
    url: 'https://www.slant.co',
    fit: 'Medium',
    type: 'Recommendation community',
    notes: 'Contribute a useful comparison; do not post thin promotional copy.',
  },
];

const pendingListings = new Map();

/** @param {SiteOverrides} [site] */
function normalizeSite(site = {}) {
  return {
    ...DEFAULT_SITE,
    ...site,
    categories: site.categories ?? DEFAULT_SITE.categories,
    tags: site.tags ?? DEFAULT_SITE.tags,
  };
}

/** @param {{category?: string, minFit?: 'Medium'|'High'}} [filters] */
export function listDirectoryCandidates({ category = '', minFit = 'Medium' } = {}) {
  /** @type {Record<'Low'|'Medium'|'High', number>} */
  const fitRank = { Low: 1, Medium: 2, High: 3 };
  const minimum = fitRank[minFit] ?? fitRank.Medium;
  const normalizedCategory = category.trim().toLowerCase();

  return DIRECTORY_CATALOG.filter((directory) => {
    const currentFit = /** @type {'Low'|'Medium'|'High'} */ (directory.fit);
    const matchesFit = fitRank[currentFit] >= minimum;
    const matchesCategory =
      !normalizedCategory || `${directory.type} ${directory.notes}`.toLowerCase().includes(normalizedCategory);
    return matchesFit && matchesCategory;
  });
}

/** @param {{directoryId: string, site?: SiteOverrides, contactEmail?: string}} params */
export function prepareDirectoryListing({ directoryId, site = {}, contactEmail = '' }) {
  const directory = DIRECTORY_CATALOG.find((candidate) => candidate.id === directoryId);
  if (!directory) {
    throw new Error(`Unknown directory "${directoryId}". Ask for a fresh directory shortlist first.`);
  }

  const listing = normalizeSite(site);
  const requestId = `seo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const packet = {
    requestId,
    status: 'awaiting_approval',
    directory,
    listing: {
      name: listing.name,
      url: listing.url,
      description: listing.description,
      categories: listing.categories,
      tags: listing.tags,
      contactEmail: contactEmail || null,
    },
    approvalInstruction:
      'Review the claims, URL, category, and contact details. Approve this request before any submission connector is allowed to run.',
  };

  pendingListings.set(requestId, packet);
  return packet;
}

/** @param {string} requestId */
export function approveDirectoryListing(requestId) {
  const packet = pendingListings.get(requestId);
  if (!packet) {
    throw new Error(`No pending directory listing request exists for "${requestId}".`);
  }

  const approvedPacket = { ...packet, status: 'approved' };
  pendingListings.set(requestId, approvedPacket);
  return {
    ...approvedPacket,
    submission:
      'Approved, but not submitted: no directory submission connector is configured. Use the directory URL and this packet for a manual submission, or configure a reviewed browser connector.',
  };
}

/**
 * Submit an approved listing through an explicitly configured directory connector.
 * The connector receives the reviewed listing packet and is responsible for the
 * directory-specific browser/API interaction.
 *
 * @param {{requestId: string, confirmation: string, connectors?: Record<string, (packet: object) => Promise<object>>}} params
 */
export async function submitApprovedDirectoryListing({ requestId, confirmation, connectors = {} }) {
  const packet = pendingListings.get(requestId);
  if (!packet) {
    throw new Error(`No pending directory listing request exists for "${requestId}".`);
  }
  if (packet.status !== 'approved') {
    throw new Error(`Listing "${requestId}" must be approved before submission.`);
  }
  if (confirmation !== `SUBMIT ${requestId}`) {
    throw new Error(`Final confirmation must be exactly "SUBMIT ${requestId}".`);
  }

  const connector = connectors[packet.directory.id];
  if (!connector) {
    throw new Error(
      `No reviewed submission connector is configured for ${packet.directory.name}. The packet is ready for manual submission.`,
    );
  }

  const submittingPacket = { ...packet, status: 'submitting' };
  pendingListings.set(requestId, submittingPacket);

  try {
    const result = await connector(submittingPacket);
    const submittedPacket = { ...submittingPacket, status: 'submitted', submissionResult: result };
    pendingListings.set(requestId, submittedPacket);
    return submittedPacket;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const failedPacket = { ...submittingPacket, status: 'failed', submissionError: message };
    pendingListings.set(requestId, failedPacket);
    throw new Error(`Directory submission failed: ${message}`);
  }
}

/** @param {string} requestId */
export function getDirectoryListingRequest(requestId) {
  return pendingListings.get(requestId) ?? null;
}
