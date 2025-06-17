import { PPB_VERSION_NO } from './interfaces';
import type { PalletProject } from './interfaces';

export async function loadFromFile(file: File): Promise<PalletProject> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (data.PPB_VERSION_NO !== PPB_VERSION_NO) {
    throw new Error('Invalid PPB version');
  }
  return data as PalletProject;
}

export function saveToFile(project: PalletProject): Blob {
  const data = JSON.stringify(project, null, 2);
  return new Blob([data], { type: 'application/json' });
}
