export interface FileInfo {
  name: string
  path: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'
