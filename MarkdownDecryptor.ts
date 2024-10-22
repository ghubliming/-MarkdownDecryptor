import * as fs from 'fs';
import * as path from 'path';
import * as CryptoJS from 'crypto-js';

interface DecryptorOptions {
    password: string;
    inputDir: string;
    outputDir?: string;
}

class MarkdownDecryptor {
    private password: string;
    private inputDir: string;
    private outputDir: string;

    constructor(options: DecryptorOptions) {
        this.password = options.password;
        this.inputDir = options.inputDir;
        this.outputDir = options.outputDir || path.join(this.inputDir, 'decrypted');
    }

    private hashPassword(): string {
        return CryptoJS.SHA256(this.password).toString(CryptoJS.enc.Hex);
    }

    private decryptContent(content: string): string {
        try {
            const key = this.hashPassword();
            const decrypted = CryptoJS.AES.decrypt(content, key);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    private async readFile(filePath: string): Promise<string> {
        return fs.promises.readFile(filePath, 'utf8');
    }

    private async writeFile(filePath: string, content: string): Promise<void> {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        return fs.promises.writeFile(filePath, content, 'utf8');
    }

    private isMarkdownFile(fileName: string): boolean {
        return fileName.toLowerCase().endsWith('.md');
    }

    async decryptFiles(): Promise<{ success: string[]; failed: string[] }> {
        const results = {
            success: [] as string[],
            failed: [] as string[]
        };

        try {
            // Create output directory if it doesn't exist
            if (!fs.existsSync(this.outputDir)) {
                await fs.promises.mkdir(this.outputDir, { recursive: true });
            }

            // Get all files in the directory
            const files = await fs.promises.readdir(this.inputDir);
            
            for (const file of files) {
                if (!this.isMarkdownFile(file)) continue;

                const inputPath = path.join(this.inputDir, file);
                const outputPath = path.join(this.outputDir, file);

                try {
                    const content = await this.readFile(inputPath);
                    if (content.length <= 1) continue;

                    const decryptedContent = this.decryptContent(content);
                    await this.writeFile(outputPath, decryptedContent);
                    results.success.push(file);
                } catch (error) {
                    console.error(`Failed to decrypt ${file}:`, error);
                    results.failed.push(file);
                }
            }
        } catch (error) {
            console.error('Decryption process failed:', error);
            throw error;
        }

        return results;
    }
}

// Example usage
async function main() {
    try {
        const decryptor = new MarkdownDecryptor({
            password: 'your-password-here',
            inputDir: '/path/to/encrypted/files',
            outputDir: '/path/to/output/directory' // Optional
        });

        const results = await decryptor.decryptFiles();
        
        console.log('Successfully decrypted files:', results.success);
        if (results.failed.length > 0) {
            console.log('Failed to decrypt files:', results.failed);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the script
if (require.main === module) {
    main();
}

export { MarkdownDecryptor, DecryptorOptions };
