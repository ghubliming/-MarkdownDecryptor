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
