export interface FileInfo {
  file: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'
