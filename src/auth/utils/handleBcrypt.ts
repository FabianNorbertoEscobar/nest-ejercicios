import * as bcryptjs from 'bcryptjs';

const seed = 10;

/**
 * genera un hash a partir de texto plano
 *
 * @param plain
 * @returns hash
 */
async function generateHash(plain: string): Promise<string> {
  return await bcryptjs.hash(plain, seed);
}

/**
 * compara un texto plano con un hash
 *
 * @param plain
 * @param hash
 * @returns comparation
 */
async function compareHash(plain: string, hash: string): Promise<string> {
  return await bcryptjs.compare(plain, hash);
}

export { generateHash, compareHash };
