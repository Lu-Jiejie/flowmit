export interface Config {
  types?: {
    title: string
    value: string
    description: string
  }[]
}

export interface FileInfo {
  file: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'
