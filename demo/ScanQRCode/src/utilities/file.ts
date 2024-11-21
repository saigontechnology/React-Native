export const getAbsoluteFilePath = (path: string) => path?.startsWith?.('file:/') ? path : `file://${path}`
