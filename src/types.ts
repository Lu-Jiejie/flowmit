export interface Config {
  /** commit types */
  types?: {
    /** commit types title that would be shown */
    title: string
    /** commit types value that would be used in commit message */
    value: string
    /** commit types description that would be shown */
    description: string
  }[]
  scopes?: string[]
  language?: 'en' | 'zh'
}

export interface FileInfo {
  name: string
  path: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'
