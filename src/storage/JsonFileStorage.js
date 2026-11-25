const fs = require('node:fs');
const path = require('node:path');

class JsonFileStorage {
  constructor(filePath) {
    this.filePath = filePath;
  }

  load() {
    if (!fs.existsSync(this.filePath)) return null;
    const raw = fs.readFileSync(this.filePath, 'utf8');
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(`Файл данных ${this.filePath} содержит некорректный JSON`);
    }
  }

  save(data) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, this.filePath);
  }
}

module.exports = JsonFileStorage;
