/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@bitgo/blake2b' {
  interface Blake2b {
    update(input: Buffer): Blake2b
    digest(out: any): Buffer
  }
  export default function blake2b(
    outlen: any,
    key: any,
    salt: any,
    personal: any,
  ): Blake2b
}
