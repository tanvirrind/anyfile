import { SoftwareInfo } from '../types';
import { INDEXED_SOFTWARE_LIST, getOrGenerateSoftwareInfo as lookupSoftware } from '../lib/database/softwareEngine';

export const SOFTWARE_LIST: SoftwareInfo[] = INDEXED_SOFTWARE_LIST;

export const getOrGenerateSoftwareInfo = lookupSoftware;
