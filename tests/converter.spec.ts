import { signatureToPubkey, fromHexString } from '../src/converter';

test('test signature', () => {
  const signature = "0xf527c2b44d01982c7418c8ca7a8406d4d796f8deb0ef059c9aedb5c2535d7f8333e9eda7623db267886d4c6c3cec2e26ca5d81e3dcb7d506c1c676352a522ade1b"
  const message = Buffer.from(fromHexString("0000000000000000000000000000000000000000000000000000000000000000"))
  const pubkey = "Al/qkTwDiNGVYkF4Q5x4P+NbxS3GFLs32kNgvuBbjRjR"

  expect(signatureToPubkey(signature, message)).toBe(pubkey);
})
