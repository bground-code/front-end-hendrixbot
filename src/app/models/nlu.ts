export interface NluData {
  id: number;  // Se estiver sempre presente quando renderizado, não precisa ser opcional.
  intentText: string;
  texts: string[];
}
