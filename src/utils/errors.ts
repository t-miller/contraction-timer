export class StorageError extends Error {
  constructor(
    public operation: 'save' | 'load',
    public key: string,
    public override cause: unknown
  ) {
    super(`Failed to ${operation} ${key}`);
    this.name = 'StorageError';
  }
}
