export interface FileInfo {
  name: string
  path: string
  status: FileStatus
}

export type FileStatus = 'A' | 'U' | 'M' | 'D'

// get the return type of a function which returns a promise
type PromiseType<T> = (args: any[]) => Promise<T>
export type UnPromisify<T> = T extends PromiseType<infer U> ? U : never
