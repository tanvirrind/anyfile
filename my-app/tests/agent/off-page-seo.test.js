import assert from 'node:assert';
import { describe, it } from 'node:test';

import {
  approveDirectoryListing,
  getDirectoryListingRequest,
  listDirectoryCandidates,
  prepareDirectoryListing,
  submitApprovedDirectoryListing,
} from '../../agent/off-page-seo.js';

describe('off-page SEO workflow', () => {
  it('returns relevant high-fit directory candidates', () => {
    const candidates = listDirectoryCandidates({ minFit: 'High' });
    assert.ok(candidates.length > 0);
    assert.ok(candidates.every((candidate) => candidate.fit === 'High'));
  });

  it('creates an approval-gated listing packet', () => {
    const packet = prepareDirectoryListing({ directoryId: 'alternativeto' });
    assert.strictEqual(packet.status, 'awaiting_approval');
    assert.strictEqual(packet.listing.url, 'https://anyfilex.com');
    assert.strictEqual(getDirectoryListingRequest(packet.requestId).status, 'awaiting_approval');
  });

  it('marks a packet approved without claiming submission', () => {
    const packet = prepareDirectoryListing({ directoryId: 'saashub' });
    const approved = approveDirectoryListing(packet.requestId);
    assert.strictEqual(approved.status, 'approved');
    assert.match(approved.submission, /not submitted/i);
  });

  it('rejects unknown directories', () => {
    assert.throws(() => prepareDirectoryListing({ directoryId: 'unknown' }), /Unknown directory/);
  });

  it('requires exact final confirmation before submission', async () => {
    const packet = prepareDirectoryListing({ directoryId: 'alternativeto' });
    approveDirectoryListing(packet.requestId);
    await assert.rejects(
      submitApprovedDirectoryListing({
        requestId: packet.requestId,
        confirmation: 'yes',
        connectors: { alternativeto: async () => ({ published: true }) },
      }),
      /Final confirmation/,
    );
  });

  it('submits through an explicitly configured connector', async () => {
    const packet = prepareDirectoryListing({ directoryId: 'saashub' });
    approveDirectoryListing(packet.requestId);
    const submitted = await submitApprovedDirectoryListing({
      requestId: packet.requestId,
      confirmation: `SUBMIT ${packet.requestId}`,
      connectors: { saashub: async (reviewedPacket) => ({ reference: reviewedPacket.requestId }) },
    });
    assert.strictEqual(submitted.status, 'submitted');
    assert.deepStrictEqual(submitted.submissionResult, { reference: packet.requestId });
  });

  it('does not pretend to submit without a connector', async () => {
    const packet = prepareDirectoryListing({ directoryId: 'product-hunt' });
    approveDirectoryListing(packet.requestId);
    await assert.rejects(
      submitApprovedDirectoryListing({
        requestId: packet.requestId,
        confirmation: `SUBMIT ${packet.requestId}`,
      }),
      /No reviewed submission connector/,
    );
  });
});
