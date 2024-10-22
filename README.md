# MarkdownDecryptor - Decrypt `.md` Files Encrypted by Obsidian Protected Note

## Overview

This script decrypts Markdown (`.md`) files that were encrypted using the [Obsidian Protected Note](https://github.com/mmiksaa/obsidian-protected-note) plugin. It uses AES decryption through the `crypto-js` library and outputs the decrypted files to a specified directory.

## Requirements

- Node.js
- The `crypto-js` library for decryption
- Markdown files that were encrypted using the Obsidian Protected Note plugin

## Installation

1. Install the required dependencies:
   ```bash
   npm install crypto-js @types/crypto-js
   ```

## How to Use

1. **Set Up the Decryptor**: Create an instance of `MarkdownDecryptor` and provide the password and the directory containing the encrypted files.
   
2. **Run the Decryptor**: Call `decryptFiles()` to process all the `.md` files in the input directory.

### Example

```typescript
const decryptor = new MarkdownDecryptor({
    password: 'your-password-here',                // Password used to encrypt the notes
    inputDir: '/path/to/encrypted/files',          // Directory containing the encrypted .md files
    outputDir: '/path/to/output/directory'         // (Optional) Directory where decrypted files will be saved
});

decryptor.decryptFiles().then((results) => {
    console.log('Successfully decrypted files:', results.success);
    console.log('Failed to decrypt files:', results.failed);
});
```

## Decryptor Workflow

1. **Password Hashing**: The decryptor hashes the provided password with SHA256 to generate a key.
2. **File Processing**: It scans the input directory for `.md` files and attempts to decrypt them using the hashed password.
3. **Decryption**: AES decryption is applied, and the decrypted content is saved to the output directory.
4. **Error Handling**: Files that fail to decrypt (due to incorrect keys or corruption) are logged separately.

## Notes

- The script only decrypts `.md` files that were encrypted using the Obsidian Protected Note plugin.
- If the decryption fails for some files, the script will continue processing the rest and log any failed files.

## License

This project is open-source under the MIT License.
