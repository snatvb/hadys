declare type ValueOf<T> = T[keyof T]
declare type ValueOfContext<T extends {}> = {
  [K in keyof T]: ValueOf<T[K]>
}[keyof T]

declare type TupleUnion<U extends string, R extends any[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : TupleUnion<Exclude<U, S>, [...R, S]>
}[U]

declare type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]
